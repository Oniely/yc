"use client";

import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState, useState } from "react";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/db/queries/insert";
import { startupInsertSchema } from "@/db/schema";
import { z } from "zod";

export default function StartupForm() {
	const [errors, setErrors] = useState<any>({});
	const [pitch, setPitch] = useState("");
	const { toast } = useToast();
	const router = useRouter();

	const handleFormSubmit = async (prevState: any, formData: FormData) => {
		try {
			const formValues = {
				title: formData.get("title") as string,
				description: formData.get("description") as string,
				category: formData.get("category") as string,
				image: formData.get("link") as string,
				pitch,
				authorId: 100,
				slug: "random",
			};

			await startupInsertSchema.parseAsync(formValues);

			const result = await createPitch(prevState, formData, pitch);

			if (result?.status == "SUCCESS") {
				toast({
					title: "Success",
					description:
						"Your startup pitch has been created successfully",
				});

				router.push(`/startup/${result.id}`);
			}

			return result;
		} catch (error: any) {
			if (error instanceof z.ZodError) {
				const fieldErorrs = error.flatten().fieldErrors;

				setErrors(fieldErorrs as unknown as Record<string, string>);

				toast({
					title: "Error",
					description: "Please check your inputs and try again",
					variant: "destructive",
				});

				return {
					...prevState,
					error: "Validation failed",
					status: "ERROR",
				};
			}

			toast({
				title: "Error",
				description: "An unexpected error has occurred",
				variant: "destructive",
			});

			return {
				...prevState,
				error: "An unexpected error has occurred",
				status: "ERROR",
			};
		}
	};

	const [state, formAction, isPending] = useActionState(
		handleFormSubmit,
		null
	);

	return (
		<form action={formAction} className="startup-form">
			<div>
				<label htmlFor="title" className="startup-form_label">
					Title
				</label>
				<Input
					id="title"
					name="title"
					className="startup-form_input"
					required
					placeholder="Startup Title"
				/>

				{errors.title && (
					<p className="startup-form_error">{errors.title}</p>
				)}
			</div>

			<div>
				<label htmlFor="description" className="startup-form_label">
					Description
				</label>
				<Textarea
					id="description"
					name="description"
					className="startup-form_textarea"
					required
					placeholder="Startup Description"
				/>

				{errors.description && (
					<p className="startup-form_error">{errors.description}</p>
				)}
			</div>

			<div>
				<label htmlFor="category" className="startup-form_label">
					Category
				</label>
				<Input
					id="category"
					name="category"
					className="startup-form_input"
					required
					placeholder="Startup Category (Tech, Health, Education...)"
				/>

				{errors.category && (
					<p className="startup-form_error">{errors.category}</p>
				)}
			</div>

			<div>
				<label htmlFor="link" className="startup-form_label">
					Image URL
				</label>
				<Input
					id="link"
					name="link"
					type="url"
					className="startup-form_input"
					required
					placeholder="Startup Image URL"
				/>

				{errors.link && (
					<p className="startup-form_error">{errors.link}</p>
				)}
			</div>

			<div data-color-mode="light">
				<label htmlFor="pitch" className="startup-form_label">
					Pitch
				</label>

				<MDEditor
					value={pitch}
					onChange={(value: any) => setPitch(value as string)}
					id="pitch"
					preview="edit"
					height={300}
					style={{ borderRadius: 20, overflow: "hidden" }}
					className="border-[3px] border-black text-black placeholder:text-black-300 text-[18px] font-semibold"
					textareaProps={{
						placeholder:
							"Briefly describe your idea and what problem it solves",
					}}
					previewOptions={{
						disallowedElements: ["style"],
					}}
				/>

				{errors.pitch && (
					<p className="startup-form_error">{errors.pitch}</p>
				)}
			</div>

			<Button
				type="submit"
				className="startup-form_btn text-white"
				disabled={isPending}
			>
				{isPending ? "Submitting..." : "Submit Your Pitch"}
				<Send className="size-6 ml-2" />
			</Button>
		</form>
	);
}
