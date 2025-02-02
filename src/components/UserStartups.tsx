import React from "react";
import StartupCard from "@/components/StartupCard";
import { SelectStartup } from "@/db/schema";
import { fetchAuthorStartups } from "@/db/queries/select";

const UserStartups = async ({ id }: { id: number }) => {
	const startups: SelectStartup[] = await fetchAuthorStartups(id);

	return (
		<>
			{startups.length > 0 ? (
				startups.map((startup: SelectStartup) => (
					<StartupCard key={startup.id} post={startup} />
				))
			) : (
				<p className="no-result">No posts yet</p>
			)}
		</>
	);
};
export default UserStartups;
