// @ts-nocheck

import 'dotenv/config';

import fs from 'node:fs/promises';

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { order, orderItem, review, pricing } from '../src/lib/server/db/schema.js';

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, {
	schema: { order, orderItem, review, pricing },
});

(async () => {
	const orderData = JSON.parse(await fs.readFile('datasets/order_data.json', 'utf-8'));
	const pricingData = JSON.parse(await fs.readFile('datasets/pricing_data.json', 'utf-8'));
	const reviewData = JSON.parse(await fs.readFile('datasets/review_data.json', 'utf-8'));

	await db.insert(order)
		.values(orderData.map(o => ({
			orderId: o.order_id,
			store: o.store,
			createdAt: new Date(o.date),
		})));

	await db.insert(orderItem)
		.values(orderData.flatMap(o => o.items.map(i => ({
			orderId: o.order_id,
			type: i.type,
			size: i.size,
		}))));

	await db.insert(pricing)
		.values(Object.entries(pricingData).flatMap(([type, sizes]) => Object.entries(sizes).map(s => ({
			type,
			size: s[0],
			price: s[1],
		}))));

	await db.insert(review)
		.values(reviewData.map(r => ({
			id: r.review_id,
			sentiment: r.sentiment,
			store: r.store,
			message: r.message,
			createdAt: new Date(r.date),
		})));

	await pool.end();
})();