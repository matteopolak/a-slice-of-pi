import { procedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import { PizzaSize, PizzaType, Range, ReviewSentiment } from '$lib/server/schema';
import { order, orderItem, pricing, review } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { type SQL, and, count, eq, gte, inArray, lt, sum, desc, countDistinct } from 'drizzle-orm';
import { extractMonth } from '$lib/server/db/util';

export const app = router({
	reviewsBySentiment: procedure
		.input(z.object({
			range: Range.optional(),
		}))
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

			if (input.range) {
				query.where(and(
					gte(review.createdAt, input.range.start),
					lt(review.createdAt, input.range.end)
				));
			}

			return query
				.groupBy(review.sentiment)
				// QoL: show the most popular first
				.orderBy(desc(count()));
		}),
	ordersByStore: procedure
		.input(z.object({
			pizzaType: PizzaType.array(),
			pizzaSize: PizzaSize.array(),
			range: Range,
		}).partial())
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

			if (input.range) {
				filters.push(and(
					gte(order.createdAt, input.range.start),
					lt(order.createdAt, input.range.end)
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
		.input(z.object({
			range: Range,
		}))
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
					gte(order.createdAt, input.range.start),
					lt(order.createdAt, input.range.end)
				));

			return rows[0].total ?? 0;
		}),
	revenueByMonth: procedure
		.input(z.object({
			range: Range.optional(),
		}))
		.output(z.object({
			month: z.number(),
			revenue: z.number(),
		}).array())
		.query(({ input }) => {
			const query = db
				.select({
					month: extractMonth(order.createdAt),
					revenue: sum(pricing.price).mapWith(parseInt),
				})
				.from(orderItem)
				.innerJoin(order, eq(orderItem.orderId, order.id))
				.innerJoin(pricing, and(
					eq(orderItem.size, pricing.size),
					eq(orderItem.type, pricing.type),
				));

			if (input.range) {
				query.where(and(
					gte(order.createdAt, input.range.start),
					lt(order.createdAt, input.range.end)
				));
			}

			return query
				// order by month
				.orderBy(extractMonth(order.createdAt))
				.groupBy(extractMonth(order.createdAt));
		}),
});

export default app;
export type Router = typeof app;
