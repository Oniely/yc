import { createUser } from "@/db/queries/insert";
import { getUserByEmail } from "@/db/queries/select";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [GitHub, Google],
	callbacks: {
		async signIn({ user, account, profile }) {
			const existingUser = await getUserByEmail(user?.email!);

			if (!existingUser) {
				const uniqueUsername = `${user?.name
					?.replace(/\s+/g, "")
					.toLowerCase()}_${uuidv4().slice(0, 8)}`;
				await createUser({
					name: user?.name!,
					email: user?.email!,
					bio: "",
					image: user?.image || "",
					username: uniqueUsername,
				});
			}

			return true;
		},
	},
});
