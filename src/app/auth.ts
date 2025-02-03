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

			// is user is not yet registered, we'll create new user with their data from provider
			// and generate a unique username for them derived from their name
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

			// return boolean indicating if signIn has been successful or not
			return true;
		},
		// modifying the jwt token
		async jwt({ token, trigger, user, session }) {
			if (trigger === "update" && session?.user?.username) {
				token.username = session.user.username;
				return token;
			}

			// if user has logged in successfully these callback will run automatically
			// we'll modify the id, username, image
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
		async session({ session, token }) {
			// now from here, coming from jwt token we will now modify the session using the modified token
			// so we can access this session and get the user creds instead of fetching through db everytime
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
