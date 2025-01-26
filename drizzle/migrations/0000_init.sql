CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"bio" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "authors_email_unique" UNIQUE("email"),
	CONSTRAINT "authors_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "startups" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"image" text NOT NULL,
	"pitch" text NOT NULL,
	"authorId" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "startups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "startups" ADD CONSTRAINT "startups_authorId_authors_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;