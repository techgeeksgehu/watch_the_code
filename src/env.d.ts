/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	gsap: typeof import("gsap").gsap;
	ScrollTrigger: typeof import("gsap/all").ScrollTrigger;
	ScrollSmoother: typeof import("gsap/all").ScrollSmoother;
}
