import { auth } from "@/app/auth";
import { createUser } from "@/db/queries/insert";
import { getUserByEmail } from "@/db/queries/select";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const session = await auth();

	if (!session) {
		return NextResponse.redirect("http://localhost:3000/login");
	}

	const dbUser = await getUserByEmail(session.user?.email!);

	if (!dbUser || !dbUser.length) {
		console.log("Doesn't exist in db yet, adding user rn...");
		await createUser({
			name: session.user?.name!,
			email: session.user?.email!,
			bio: "",
			image: session.user?.image || "",
			username: "",
		});
	}

	return NextResponse.redirect("http://localhost:3000/");
}
