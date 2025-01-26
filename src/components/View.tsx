"use client";

import supabase from "@/db/supabase";
import Ping from "./Ping";
import { useEffect, useState } from "react";

export default function View({ id }: { id: string | number }) {
	const [post, setPost] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("startups")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				console.error("Error fetching data:", error);
			} else {
				setPost(data);
			}
			setLoading(false);
		};

		fetchData();

		const channel = supabase
			.channel("realtime startups")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "startups",
					filter: `id=eq.${id}`,
				},
				(payload) => {
					if (payload.eventType === "UPDATE") {
						setPost(payload.new);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [id]);

	return (
		<div className="view-container">
			<div className="absolute -top-2 -right-2">
				<Ping />
			</div>
			<p className="view-text">
				{loading ? (
					<span className="font-black">Loading...</span>
				) : (
					<span className="font-black">{post?.views || 0} views</span>
				)}
			</p>
		</div>
	);
}
