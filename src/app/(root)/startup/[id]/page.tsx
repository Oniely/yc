import { getStartup } from "@/db/queries/select";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = markdownit();

export default async function Startup({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;
	const post = await getStartup(id);

	if (!post) return notFound();

	const parsedContent = md.renderInline(post?.pitch || "");

	return (
		<>
			<section className="pink_container !min-h-[230px]">
				<p className="tag">{formatDate(post.createdAt)}</p>

				<h1 className="heading">{post.title}</h1>
				<p className="sub-heading">{post.description}</p>
			</section>

			<section className="section_container">
				<img
					src={post.image}
					alt="thumbnail"
					className="w-full h-auto rounded-xl"
				/>

				<div className="space-y-5 mt-10 max-w-4xl mx-auto">
					<div className="flex-between gap-5">
						<Link
							href={`/user/${post.author.username}`}
							className=""
						>
							<Image
								src={post.author.image}
								alt={`${post.author.name}'s Profile Image`}
								width={64}
								height={64}
								className="rounded-full drop-shadow-lg"
							/>

							<div>
								<p className="text-20-medium">
									{post.author.name}
								</p>
								<p className="text-16-medium !text-black-300">
									@{post.author.username}
								</p>
							</div>
						</Link>

						<p className="category-tag">{post.category}</p>
					</div>

					<h3 className="text-30-bold">Pitch Details</h3>

					{parsedContent ? (
						<article
							className="prose max-w-4xl font-work-sans break-all"
							dangerouslySetInnerHTML={{ __html: parsedContent }}
						/>
					) : (
						<p className="no-result">No Details</p>
					)}
				</div>

				<hr className="divider" />

				<Suspense fallback={<Skeleton className="view_skeleton" />}>
					<View id={post.id} />
				</Suspense>
			</section>
		</>
	);
}
