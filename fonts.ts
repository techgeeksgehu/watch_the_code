import { fontProviders } from "astro/config";
import type { FontFamily } from "node_modules/astro/dist/assets/fonts/types";

const fonts: FontFamily[] = [
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
];

export default fonts;
