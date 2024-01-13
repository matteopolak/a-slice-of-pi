import { index, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const pizzaSize = pgEnum('pizza_size', ['S', 'M', 'L']);
export const pizzaType = pgEnum('pizza_type', ['Cheese', 'Pepperoni', 'Deluxe', 'Hawaiian', 'Meatlovers']);
export const reviewSentiment = pgEnum('review_sentiment', ['delighted', 'happy', 'sad', 'angry']);

export const order = pgTable('order', {
	id: serial('id').primaryKey(),
	store: text('store').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		// we want to group orders by store
		storeIdx: index().on(table.store),
	}
});

export const orderItem = pgTable('order_item', {
	orderId: integer('order_id').notNull().references(() => order.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	type: pizzaType('type').notNull(),
	size: pizzaSize('size').notNull(),
}, table => {
	return {
		// we want to filter by pizza type and size
		typeIdx: index().on(table.type),
		sizeIdx: index().on(table.size),
	}
});

export const review = pgTable('review', {
	id: serial('id').primaryKey(),
	sentiment: reviewSentiment('sentiment').notNull(),
	store: text('store').notNull(),
	message: text('message').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		// we want to be able to query reviews in a range efficiently
		createdAtIdx: index().on(table.createdAt),
	}
});

export const pricing = pgTable('pricing', {
	type: pizzaType('type'),
	size: pizzaSize('size'),
	price: integer('price').notNull(),
}, table => {
	return {
		typeSizePk: primaryKey({ columns: [table.type, table.size] }),
	};
});
