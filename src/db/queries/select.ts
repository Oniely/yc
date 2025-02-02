"use server";

import { db } from "@/db";
import { SelectAuthor, authors, startups } from "../schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import slugify from "slugify";

export async function getUserByEmail(email: SelectAuthor["email"]) {
	return db.query.authors.findFirst({
		where: (author, { eq }) => eq(author.email, email),
	});
}

export async function getUserByUsername(username: SelectAuthor["username"]) {
	return db.query.authors.findFirst({
		where: (author, { eq }) => eq(author.username, username),
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
				username: authors.username,
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

export async function checkAndReturnSlug(
	slug: string,
	counter: number = 1
): Promise<string> {
	// Only remove special characters but keep spaces
	const cleanSlug = counter === 1 
		? slugify(slug, { lower: true, replacement: ' ' }) 
		: slug;
	
	const startup = await getStartup(cleanSlug);

	if (!startup) return cleanSlug;

	const new_slug = `${cleanSlug}-${counter}`;
	return checkAndReturnSlug(new_slug, counter + 1);
}

export async function fetchAuthorStartups(id: number) {
	return db.query.startups.findMany({
		where: (startup, { eq }) => eq(startup.authorId, id),
		with: {
			author: true,
		},
	});
}
