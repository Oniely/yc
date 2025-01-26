import { db } from "../index";
import { InsertAuthor, authors } from "../schema";

export async function createUser(data: InsertAuthor) {
	await db.insert(authors).values(data);
}
