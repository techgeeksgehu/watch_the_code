// @ts-check
import { defineConfig } from "astro/config";
import fonts from "./fonts";

import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	site: "https://hack.gehu.in",
	trailingSlash: "always",
	cacheDir: "./cache/astro",
	compressHTML: true,
	integrations: [icon(), svelte(), mdx()],
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	fonts,
	experimental: {
		svgo: true,
		clientPrerender: true,
		contentIntellisense: true,
	},
	vite: {
		cacheDir: "./cache/vite",
		clearScreen: true,
		plugins: [tailwindcss()],
	},
});
