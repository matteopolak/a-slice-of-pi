import { and, count, countDistinct, desc, eq, gte, inArray, lt, type SQL, sum } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$lib/server/db';
import { order, orderItem, pricing, review } from '$lib/server/db/schema';
import { averageYearMonth, extractYearMonth } from '$lib/server/db/util';
import { PizzaSize, PizzaType, Range, Review, ReviewSentiment } from '$lib/server/schema';
import { procedure, router } from '$lib/server/trpc';

export const app = router({
	reviewsBySentiment: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get review count by sentiment',
				description: 'Gets the number of reviews by sentiment.',
				tags: ['agg'],
				path: '/agg/reviews/sentiment',
			},
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
					lt(review.createdAt, input.end),
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
			},
		})
		.input(z.object({
			pizzaType: PizzaType.array(),
			pizzaSize: PizzaSize.array(),
		})
			.merge(Range)
			.partial(),
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
					lt(order.createdAt, input.end),
				)!);
			}

			if (filters.length) {
				query
					.innerJoin(orderItem, eq(order.id, orderItem.orderId))
					.where(and(...filters));
			}

			return query
				.groupBy(order.store)
				.orderBy(order.store);
		}),
	totalRevenue: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get total revenue',
				description: 'Gets the total revenue.',
				tags: ['agg'],
				path: '/agg/revenue/total',
			},
		})
		.input(Range)
		.output(z.number())
		.query(async ({ input }) => {
			const rows = await db
				.select({
					// since each order_item represents one pizza,
					// summing the pricing.price column will give the total
					total: sum(pricing.price).mapWith(parseInt),
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
					lt(order.createdAt, input.end),
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
			},
		})
		.input(Range.optional())
		.output(z.object({
			timestamp: z.string().datetime(),
			revenue: z.number(),
		}).array())
		.query(({ input }) => {
			const query = db
				.select({
					timestamp: averageYearMonth(order.createdAt),
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
					lt(order.createdAt, input.end),
				));
			}

			return query
				// order by month
				.orderBy(extractYearMonth(order.createdAt))
				.groupBy(extractYearMonth(order.createdAt));
		}),
	revenueByStoreByMonth: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get revenue by store per month',
				description: 'Gets the revenue by store per month.',
				tags: ['agg'],
				path: '/agg/revenue/store',
			},
		})
		.input(Range.optional())
		.output(z.record(z.string(), z.object({
			revenue: z.number(),
			timestamp: z.string().datetime(),
		}).array()))
		.query(async ({ input }) => {
			const query = db.select({
				timestamp: averageYearMonth(order.createdAt),
				store: order.store,
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
					lt(order.createdAt, input.end),
				));
			}

			const rows = await query
				.orderBy(order.store, extractYearMonth(order.createdAt))
				.groupBy(extractYearMonth(order.createdAt), order.store);

			return rows.reduce((groups, row) => {
				const group = groups[row.store] ?? (groups[row.store] = []);

				group.push({
					timestamp: row.timestamp,
					revenue: row.revenue,
				});

				return groups;
			}, {} as Record<string, { timestamp: string, revenue: number }[]>);
		}),
	ordersByStoreByPizza: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get orders by store by pizza',
				description: 'Gets the number of orders by store by pizza.',
				tags: ['agg'],
				path: '/agg/orders/store/pizza',
			},
		})
		.input(z.object({
			key: z.enum(['type', 'size']),
		}).merge(Range.partial()))
		.output(z.record(z.string(), z.object({ x: z.string(), y: z.number() }).array()))
		.query(async ({ input }) => {
			const query = db.select({
				store: order.store,
				label: orderItem[input.key],
				count: count(),
			})
				.from(orderItem)
				.innerJoin(order, eq(orderItem.orderId, order.id));

			if (input.start && input.end) {
				query.where(and(
					gte(order.createdAt, input.start),
					lt(order.createdAt, input.end),
				));
			}

			const rows = await query
				.groupBy(order.store, orderItem[input.key])
				.orderBy(order.store, orderItem[input.key]);

			return rows.reduce((groups, row) => {
				const group = groups[row.store] ?? (groups[row.store] = []);

				group.push({
					x: row.label,
					y: row.count,
				});

				return groups;
			}, {} as Record<string, { x: string, y: number }[]>);
		}),
	reviews: procedure
		.meta({
			openapi: {
				method: 'POST',
				summary: 'Get reviews',
				description: 'Gets the reviews.',
				tags: ['review'],
				path: '/reviews',
			},
		})
		.input(z.object({
			page: z.number().int().nonnegative().default(0),
		}))
		.output(Review.array())
		.query(({ input }) => {
			return db
				.select({
					id: review.id,
					sentiment: review.sentiment,
					store: review.store,
					message: review.message,
					createdAt: review.createdAt,
				})
				.from(review)
				.orderBy(desc(review.createdAt))
				.offset(input.page * 15)
				.limit(15);
		}),
});

export default app;
export type Router = typeof app;
