import { getCollection } from "astro:content";

// static site: "now" is build time, so a scheduled post needs a rebuild after its date
export const getPublishedPosts = async () =>
	(await getCollection("posts", (post) => post.data.publishedAt <= new Date())).sort(
		(a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
	);
