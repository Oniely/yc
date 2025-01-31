"use server";

import { db } from "@/db";
import { authors } from "../schema";
import { eq } from "drizzle-orm";
export async function updateUsernameAndBio(prevState: any, formData: FormData) {
	const authorId = formData.get("authorId") as unknown as number;
	const username = formData.get("username") as string;
	const bio = formData.get("bio") as string;

	if (!authorId) return null;

	return await db
		.update(authors)
		.set({ username, bio })
		.where(eq(authors.id, authorId));
}
