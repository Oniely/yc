"use server";

import { auth } from "@/app/auth";
import { db } from "../index";
import { InsertAuthor, authors, startups } from "../schema";
import { checkAndReturnSlug, getUserByEmail } from "./select";
import slugify from "slugify";

export async function createUser(data: InsertAuthor) {
	return await db.insert(authors).values(data);
}

export async function createPitch(
	prevState: any,
	formData: FormData,
	pitch: string
) {
	const session = await auth();

	if (!session) return null;

	const author = await getUserByEmail(session.user.email);

	if (!author) return null;

	const title = formData.get("title") as string;
	const description = formData.get("description") as string;
	const category = formData.get("category") as string;
	const link = formData.get("link") as string;

	const startup_slug = slugify(title);
	const checkedSlug = await checkAndReturnSlug(startup_slug);

	const inserted = await db.insert(startups).values({
		authorId: author.id,
		title,
		description,
		category,
		pitch,
		image: link,
		slug: checkedSlug!,
	});

	if (inserted) {
		return {
			id: checkedSlug,
			status: "SUCCESS",
		};
	} else {
		return {
			id: null,
			status: "FAILED",
		};
	}
}
