import { fontProviders } from "astro/config";
import type {
	FontFamily,
	FontProvider,
} from "node_modules/astro/dist/assets/fonts/types";

const fonts: FontFamily<FontProvider<never>>[] = [
	{
		provider: fontProviders.google(),
		name: "Noto Sans",
		cssVariable: "--font-noto-sans",
	},
	{
		provider: fontProviders.local(),
		name: "Pokemon Hollow",
		cssVariable: "--font-pokemon-hollow",
		options: {
			variants: [
				{
					style: "normal",
					src: ["./src/assets/fonts/Pokemon Hollow.woff2"],
				},
			],
		},
	},
	{
		provider: fontProviders.local(),
		name: "Pokemon Solid",
		cssVariable: "--font-pokemon-solid",
		options: {
			variants: [
				{
					style: "normal",
					src: ["./src/assets/fonts/Pokemon Solid.woff2"],
				},
			],
		},
	},
	{
		provider: fontProviders.local(),
		name: "Mac's Minecraft",
		cssVariable: "--font-minecraft",
		options: {
			variants: [
				{
					style: "normal",
					src: ["./src/assets/fonts/mac's Minecraft.woff2"],
				},
				{
					style: "italic",
					src: ["./src/assets/fonts/mac's Minecraft Italic.woff2"],
				},
				{
					style: "normal",
					weight: "700",
					src: ["./src/assets/fonts/mac's Minecraft Bold.woff2"],
				},
				{
					style: "italic",
					weight: "700",
					src: ["./src/assets/fonts/mac's Minecraft Bold Italic.woff2"],
				},
			],
		},
	},
];

export default fonts;
