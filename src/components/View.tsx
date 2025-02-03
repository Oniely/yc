"use client";

import supabase from "@/db/supabase";
import Ping from "./Ping";
import { useEffect, useState } from "react";

export default function View({ id }: { id: string | number }) {
	const [post, setPost] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// add an update to the view here to +1 everytime

	useEffect(() => {
		// fetch data to have an initial value for View, because realtime of supabase doesn't auto fetch when called but only when "realtime" updates happens
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

		// realtime code
		const channel = supabase
			.channel("realtime startups") // just channel name can be anything
			.on(
				"postgres_changes",
				{
					event: "*", // in all(*) event it will refetch (insert, update, delete)
					schema: "public",
					table: "startups", // specific table
					filter: `id=eq.${id}`, // specific column in the table
				},
				(payload) => {
					if (payload.eventType === "UPDATE") {
						setPost(payload.new); // new() method is return everytime the data refetches, it will return the newly updated data only.
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
