import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	username: text("username").notNull().unique(),
	bio: text("bio").notNull(),
	image: text("image").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$onUpdate(() => new Date()),
});

export const authorRelations = relations(authors, ({ many }) => ({
	startups: many(startups),
}));

export const startups = pgTable("startups", {
	id: serial("id").primaryKey(),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	views: integer("views").notNull().default(0),
	description: text("description").notNull(),
	category: text("category").notNull(),
	image: text("image").notNull(),
	pitch: text("pitch").notNull(),
	authorId: integer("authorId")
		.notNull()
		.references(() => authors.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$onUpdate(() => new Date()),
});

export const startupRelations = relations(startups, ({ one }) => ({
	author: one(authors, {
		fields: [startups.authorId],
		references: [authors.id],
	}),
}));

export type InsertAuthor = typeof authors.$inferInsert;
export type SelectAuthor = typeof authors.$inferSelect;

export type InsertStartup = typeof startups.$inferInsert;
export type SelectStartup = typeof startups.$inferSelect;
