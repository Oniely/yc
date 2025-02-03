"use server";

import { db } from "@/db";
import { authors } from "../schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/auth";
export async function updateUsernameAndBio(prevState: any, formData: FormData) {
	const session = await auth();

	if (!session) return null;

	const authorId = formData.get("authorId") as unknown as number;
	const username = formData.get("username") as string;
	const bio = formData.get("bio") as string;

	if (!authorId) return null;

	const updated = await db
		.update(authors)
		.set({ username, bio, onboarded: true })
		.where(eq(authors.id, authorId));

	return updated;
}
