import { z } from 'zod';

export const Range = z.object({
	start: z.coerce.date(),
	end: z.coerce.date(),
});

export const Id = z.number().int().nonnegative();
export const PizzaSize = z.enum(['S', 'M', 'L']);
export const PizzaType = z.enum(['Cheese', 'Pepperoni', 'Deluxe', 'Hawaiian', 'Meatlovers']);
export const ReviewSentiment = z.enum(['delighted', 'happy', 'sad', 'angry']);

export const Order = z.object({
	id: Id,
	store: z.string(),
	createdAt: z.coerce.date(),
});

export const OrderItem = z.object({
	orderId: Id,
	type: PizzaType,
	size: PizzaSize,
});

export const Review = z.object({
	id: Id,
	sentiment: ReviewSentiment,
	store: z.string(),
	message: z.string(),
	createdAt: z.coerce.date(),
});

export const Pricing = z.object({
	type: PizzaType,
	size: PizzaSize,
	price: z.number().nonnegative(),
});

export type Range = z.infer<typeof Range>;
export type Id = z.infer<typeof Id>;
export type PizzaSize = z.infer<typeof PizzaSize>;
export type PizzaType = z.infer<typeof PizzaType>;
export type ReviewSentiment = z.infer<typeof ReviewSentiment>;

export type Order = z.infer<typeof Order>;
export type OrderItem = z.infer<typeof OrderItem>;
export type Review = z.infer<typeof Review>;
export type Pricing = z.infer<typeof Pricing>;
