import OnboardingForm from "@/components/OnboardingForm";
import { GalleryVerticalEnd } from "lucide-react";
import { auth } from "../auth";
import { getUserByEmail } from "@/db/queries/select";
import { redirect } from "next/navigation";

export default async function Onboarding() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	const user = await getUserByEmail(session.user?.email!);

	if (user?.onboarded) {
		redirect("/");
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a
					href="#"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<GalleryVerticalEnd className="size-4" />
					</div>
					YC Pitch Directory.
				</a>
				<OnboardingForm data={user!} />
			</div>
		</div>
	);
}
