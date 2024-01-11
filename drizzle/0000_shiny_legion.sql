DO $$ BEGIN
 CREATE TYPE "pizza_size" AS ENUM('S', 'M', 'L');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pizza_type" AS ENUM('Cheese', 'Pepperoni', 'Deluxe', 'Hawaiian', 'Meatlovers');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "review_sentiment" AS ENUM('delighted', 'happy', 'sad', 'angry');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"store" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item" (
	"order_id" integer NOT NULL,
	"type" "pizza_type" NOT NULL,
	"size" "pizza_size" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricing" (
	"type" "pizza_type",
	"size" "pizza_size",
	"price" integer NOT NULL,
	CONSTRAINT "pricing_type_size_pk" PRIMARY KEY("type","size")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"sentiment" "review_sentiment" NOT NULL,
	"store" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_store_index" ON "order" ("store");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_type_index" ON "order_item" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_size_index" ON "order_item" ("size");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "review_created_at_index" ON "review" ("created_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
