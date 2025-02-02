import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function StartupCard({ post }: { post: any }) {
	const {
		id,
		createdAt,
		views,
		slug,
		author: { id: authorId, name: authorName, username: authorUsername },
		description,
		image,
		category,
		title,
	} = post;

	return (
		<li className="startup-card group">
			<div className="flex-between">
				<p className="startup-card_date">{formatDate(createdAt)}</p>
				<div className="flex gap-1.5">
					<EyeIcon className="size-6 text-primary" />
					<span>{views}</span>
				</div>
			</div>

			<div className="flex-between mt-5 gap-5">
				<div className="flex-1">
					<Link href={`/user/${authorUsername}`}>
						<p className="text-16-medium line-clamp-1">
							{authorName}
						</p>
					</Link>
					<Link href={`/startup/${slug}`}>
						<h3 className="text-26-semibold line-clamp-1">
							{title}
						</h3>
					</Link>
				</div>
				<Link href={`/user/${authorUsername}`}>
					<Image
						src={image}
						alt="Author Profile"
						width={48}
						height={48}
						className="h-fit object-cover rounded-full"
					/>
				</Link>
			</div>

			<Link href={`/startup/${slug}`}>
				<p className="startup-card_desc">{description}</p>

				<img
					src={image}
					alt="Startup Image"
					className="startup-card_img"
				/>
			</Link>

			<div className="flex-between gap-3 mt-5">
				<Link href={`/?query=${category?.toLowerCase()}`}>
					<p className="text-16-medium">{category}</p>
				</Link>
				<Button className="startup-card_btn" asChild>
					<Link href={`/startup/${slug}`}>Details</Link>
				</Button>
			</div>
		</li>
	);
}

export const StartupCardSkeleton = () => (
	<>
		{[0, 1, 2, 3, 4].map((index: number) => (
			<li key={cn("skeleton", index)}>
				<Skeleton className="startup-card_skeleton" />
			</li>
		))}
	</>
);
