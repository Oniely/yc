"use server";

import { db } from "@/db";
import { SelectAuthor, authors, startups } from "../schema";
import { desc, eq, ilike, or } from "drizzle-orm";

export async function getUserByEmail(email: SelectAuthor["email"]) {
	return db.query.authors.findFirst({
		where: (author, { eq }) => eq(author.email, email),
	});
}

export async function fetchStartups(searchQuery: string | null) {
	return db
		.select({
			id: startups.id,
			title: startups.title,
			views: startups.views,
			slug: startups.slug,
			author: {
				id: authors.id,
				name: authors.name,
				email: authors.email,
			},
			image: startups.image,
			description: startups.description,
			category: startups.category,
			createdAt: startups.createdAt,
		})
		.from(startups)
		.innerJoin(authors, eq(startups.authorId, authors.id))
		.where(
			searchQuery
				? or(
						ilike(startups.title, `%${searchQuery}%`),
						ilike(startups.category, `%${searchQuery}%`),
						ilike(authors.name, `%${searchQuery}%`)
				  )
				: undefined
		)
		.orderBy(desc(startups.createdAt));
}

export async function getStartup(slug: string | null) {
	if (!slug) return;

	return db.query.startups.findFirst({
		where: (startup, { eq }) => eq(startup.slug, slug),
		with: {
			author: true,
		},
	});
}
