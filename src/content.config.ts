import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sponsorsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content/sponsors" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			image: image(),
			href: z.string(),
			title: z.string().optional(),
		}),
});

const mentorsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content/mentors" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			image: image(),
			href: z.string(),
			org: z.string().optional(),
		}),
});

const partnersCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content/partners" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			image: image(),
			href: z.string(),
		}),
});

export const collections = {
	sponsors: sponsorsCollection,
	mentors: mentorsCollection,
	partners: partnersCollection,
};
