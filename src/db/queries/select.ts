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

export async function getUserByUsernameOrId(id: string) {
	const numId = parseInt(id);

	return db.query.authors.findFirst({
		where: (author, { eq, or }) =>
			Number.isNaN(numId)
				? eq(author.username, id)
				: or(eq(author.username, id), eq(author.id, numId)),
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
	const startup = await getStartup(slug);

	if (!startup) return slug;

	const new_slug = `${slugify(slug)}-${counter}`;
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
