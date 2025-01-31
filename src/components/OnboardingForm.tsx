"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SelectAuthor } from "@/db/schema";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import { useActionState, useState } from "react";
import { updateUsernameAndBio } from "@/db/queries/update";
import { redirect } from "next/navigation";

export default function OnboardingForm({
	data,
	className,
	...props
}: React.ComponentPropsWithoutRef<"div"> & { data: SelectAuthor }) {
	const [username, setUsername] = useState(data.username || "");
	const [bio, setBio] = useState(data.bio || "");

	const [state, formAction, isPending] = useActionState(
		updateUsernameAndBio,
		null
	);

	if (state) {
		redirect("/");
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">
						Welcome to Onboarding
					</CardTitle>
					<CardDescription>
						Fill in your details to finish signing up!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="grid gap-6">
						<input type="hidden" name="authorId" value={data.id} />
						<div className="flex flex-col gap-4">
							<div className="grid gap-2 justify-center">
								<div className="relative">
									<Image
										src={data.image || "/logo.png"}
										alt={`${data.name}'s Profile Image`}
										width={100}
										height={100}
										className="rounded-full"
									/>
									{/* <Button
										type="button"
										variant="outline"
										size="icon"
										className="rounded-full absolute -bottom-1 -right-1 bg-white-100"
									>
										<ImageUp />
									</Button> */}
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									defaultValue={data.email}
									disabled
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									name="username"
									placeholder="Your Username"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									name="bio"
									placeholder="Add your bio here..."
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" disabled={isPending}>
								<span className="!text-white text-base font-semibold">
									{isPending ? "Loading..." : "Sign up"}
								</span>
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
