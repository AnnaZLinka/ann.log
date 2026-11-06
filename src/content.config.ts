import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content" }),
	schema: z.object({
		title: z.string(),
		media: z.string().optional(),
		publishedAt: z.coerce.date(),
		url: z.url().optional(),
	}),
});

export const collections = { posts };
