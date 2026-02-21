CREATE TYPE "public"."status" AS ENUM('open', 'done', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('pix');--> statement-breakpoint
CREATE TABLE "service_payment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"service_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"method" "payment_method" DEFAULT 'pix' NOT NULL,
	"note" text,
	"paid_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "client" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "client" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rate_setting" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rate_setting" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "client_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "tractor_user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "status" "status" DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "worked_minutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "client_hourly_rate_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "tractor_hourly_rate_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "total_client_cents" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "total_tractor_cents" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "service_payment" ADD CONSTRAINT "service_payment_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_setting" ADD CONSTRAINT "rate_setting_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_tractor_user_id_user_id_fk" FOREIGN KEY ("tractor_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;