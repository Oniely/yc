import { db } from "../index";
import { InsertAuthor, authors } from "../schema";

export async function createUser(data: InsertAuthor) {
	return await db.insert(authors).values(data);
}
