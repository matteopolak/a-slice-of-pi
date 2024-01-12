import { procedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import { PizzaSize, PizzaType, Range, ReviewSentiment } from '$lib/server/schema';
import { order, orderItem, pricing, review } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { type SQL, and, count, eq, gte, inArray, lt, sum, desc, countDistinct, sql } from 'drizzle-orm';
import { extractYearMonth } from '$lib/server/db/util';

export const app = router({
	reviewsBySentiment: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get review count by sentiment',
				description: 'Gets the number of reviews by sentiment.',
				tags: ['agg'],
				path: '/agg/reviews/sentiment',
			}
		})
		.input(Range.optional())
		.output(z.object({
			sentiment: ReviewSentiment,
			count: z.number(),
		}).array())
		.query(({ input }) => {
			const query = db
				.select({
					sentiment: review.sentiment,
					count: count(),
				})
				.from(review);

			if (input) {
				query.where(and(
					gte(review.createdAt, input.start),
					lt(review.createdAt, input.end)
				));
			}

			return query
				.groupBy(review.sentiment)
				// QoL: show the most popular first
				.orderBy(desc(count()));
		}),
	ordersByStore: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get order count by store',
				description: 'Gets the number of orders by store.',
				tags: ['agg'],
				path: '/agg/orders/store',
			}
		})
		.input(z.object({
			pizzaType: PizzaType.array(),
			pizzaSize: PizzaSize.array(),
		})
			.merge(Range)
			.partial()
		)
		.output(z.object({
			store: z.string(),
			count: z.number(),
		}).array())
		.query(({ input }) => {
			const query = db
				.select({
					store: order.store,
					count: countDistinct(order.id),
				})
				.from(order);

			const filters: SQL[] = [];

			if (input.pizzaType) {
				filters.push(inArray(orderItem.type, input.pizzaType));
			}

			if (input.pizzaSize) {
				filters.push(inArray(orderItem.size, input.pizzaSize));
			}

			if (input.start && input.end) {
				filters.push(and(
					gte(order.createdAt, input.start),
					lt(order.createdAt, input.end)
				)!);
			}

			if (filters.length) {
				query
					.innerJoin(orderItem, eq(order.id, orderItem.orderId))
					.where(and(...filters));
			}

			return query
				.groupBy(order.store)
				// QoL: show the most popular first
				.orderBy(desc(countDistinct(order.id)));
		}),
	totalRevenue: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get total revenue',
				description: 'Gets the total revenue.',
				tags: ['agg'],
				path: '/agg/revenue/total',
			}
		})
		.input(Range)
		.output(z.number())
		.query(async ({ input }) => {
			const rows = await db
				.select({
					// since each order_item represents one pizza,
					// summing the pricing.price column will give the total
					total: sum(pricing.price).mapWith(parseInt)
				})
				.from(orderItem)
				// join with "order" so we can filter by date
				.innerJoin(order, eq(orderItem.orderId, order.id))
				// join with "pricing" so we can compute the revenue
				.innerJoin(pricing, and(
					eq(orderItem.size, pricing.size),
					eq(orderItem.type, pricing.type),
				))
				.where(and(
					gte(order.createdAt, input.start),
					lt(order.createdAt, input.end)
				));

			return rows[0].total ?? 0;
		}),
	revenueByMonth: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get revenue by month',
				description: 'Gets the revenue by month.',
				tags: ['agg'],
				path: '/agg/revenue/month',
			}
		})
		.input(Range.optional())
		.output(z.object({
			timestamp: z.string().datetime(),
			revenue: z.number(),
		}).array())
		.query(({ input }) => {
			const query = db
				.select({
					timestamp: sql<string>`TO_TIMESTAMP(AVG(EXTRACT(EPOCH FROM ${order.createdAt})))`
						.mapWith(v => {
							const date = new Date(v);

							date.setUTCDate(15);
							date.setUTCHours(0, 0, 0, 0);

							return date.toISOString();
						}),
					revenue: sum(pricing.price).mapWith(parseInt),
				})
				.from(orderItem)
				.innerJoin(order, eq(orderItem.orderId, order.id))
				.innerJoin(pricing, and(
					eq(orderItem.size, pricing.size),
					eq(orderItem.type, pricing.type),
				));

			if (input) {
				query.where(and(
					gte(order.createdAt, input.start),
					lt(order.createdAt, input.end)
				));
			}

			return query
				// order by month
				.orderBy(extractYearMonth(order.createdAt))
				.groupBy(extractYearMonth(order.createdAt));
		}),
});

export default app;
export type Router = typeof app;
