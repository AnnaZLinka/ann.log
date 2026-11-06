import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content" }),
	schema: z.object({
		title: z.string(),
		media: z.string().optional(),
		publishedAt: z.coerce.date(),
		url: z.string().url().optional(),
	}),
});

export const collections = { posts };
