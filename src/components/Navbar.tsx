import { auth, signOut } from "@/app/auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
	const session = await auth();

	return (
		<header className="px-5 py-3 bg-white shadow-sm font-work-sans text-black">
			<nav className="flex justify-between items-center">
				<Link href="/">
					<Image
						src="/images/logo.png"
						alt="logo"
						width={144}
						height={30}
					/>
				</Link>

				<div className="flex items-center gap-5">
					{session && session?.user ? (
						<>
							<Link href="/startup/create">
								<span>Create</span>
							</Link>

							<form
								action={async () => {
									"use server";

									await signOut({ redirectTo: "/" });
								}}
							>
								<button type="submit">Logout</button>
							</form>

							<Link href={`/user/${session.user.username}`}>
								<span>{session.user.name}</span>
							</Link>
						</>
					) : (
						<Link href="/login">Login</Link>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
