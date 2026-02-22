// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import playformCompress from "@playform/compress";
import icon from "astro-icon";
import fonts from "./fonts";

// https://astro.build/config
export default defineConfig({
	site: "https://watchthecode.gehu.in",
	base: "watch_the_code",
	compressHTML: true,
	trailingSlash: "always",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		icon(),
		playformCompress({
			Image: false,
		}),
	],
	experimental: {
		fonts,
	},
});
