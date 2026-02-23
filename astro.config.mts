// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import fonts from "./fonts";

// https://astro.build/config
export default defineConfig({
	site: "https://hack.gehu.in",
	trailingSlash: "always",
	cacheDir: "./cache/astro",
	compressHTML: true,
	integrations: [icon()],
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	experimental: {
		fonts,
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
