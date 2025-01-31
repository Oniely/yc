import { createUser } from "@/db/queries/insert";
import { getUserByEmail } from "@/db/queries/select";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";

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
		async jwt({ token, trigger, user }) {
			if (trigger === "update" && user?.name) {
				token.name = user.name;
				return token;
			}

			if (user) {
				const dbUser = await getUserByEmail(user.email!);
				if (dbUser) {
					token.id = dbUser.id;
					token.username = dbUser.username;
					token.image = dbUser.image;
				}
			}
			return token;
		},
		async session({ session, trigger, token }) {
			if (trigger === "update" && token?.name) {
				session.user.name = token.name;
				return session;
			}

			if (session.user) {
				session.user = { ...session.user, id: token.id as string };
				session.user = {
					...session.user,
					username: token.username as string,
				};
				session.user = {
					...session.user,
					image: token.image as string,
				};
			}
			return session;
		},
	},
});
