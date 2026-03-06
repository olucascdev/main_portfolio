CREATE TABLE "about_paragraphs" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"href" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"description" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text NOT NULL,
	"github_url" text DEFAULT '' NOT NULL,
	"linkedin_url" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tech" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"github_url" text DEFAULT '' NOT NULL,
	"live_url" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '',
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
