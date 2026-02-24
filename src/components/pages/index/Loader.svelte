<script lang="ts">
import { onMount } from "svelte";

let overlay: HTMLDivElement;
let loaderText: string = $state("Loading...");
let mediaReady = false;

function hideLoader() {
	document.body.classList.remove("loading");
	overlay.remove();
}

function tryHideLoader() {
	if (mediaReady) {
		hideLoader();
	}
}

const pendingAssets = new Set<HTMLImageElement>();

function waitForMedia() {
	const images = document.querySelectorAll("img");
	const totalAssets = images.length;
	let loadedAssets = 0;

	for (const image of images) pendingAssets.add(image);

	if (totalAssets === 0) {
		hideLoader();
	}

	function markLoaded(image: HTMLImageElement) {
		pendingAssets.delete(image);
		loadedAssets++;

		loaderText = `Loading (${Math.round((loadedAssets / totalAssets) * 100)}%)`;

		if (loadedAssets === totalAssets) {
			mediaReady = true;
			tryHideLoader();
		}
	}

	images.forEach((image) => {
		if (image.complete) {
			markLoaded(image);
		} else {
			image.addEventListener("load", () => {
				markLoaded(image);
			});
			image.addEventListener("error", () => {
				markLoaded(image);
			});
		}
	});
}

onMount(() => {
	document.body.classList.add("loading");

	if (document.readyState === "complete") {
		waitForMedia();
	} else {
		window.addEventListener("load", waitForMedia, { once: true });
	}

	setTimeout(() => {
		if (!mediaReady) {
			if (pendingAssets.size > 0) {
				console.warn(
					`[Loader timeout] ${pendingAssets.size} asset(s) still loading:`,
				);
				for (const image of pendingAssets) {
					console.warn(
						"  IMG:",
						image.src || image.currentSrc || image.outerHTML,
					);
				}
			}
			hideLoader();
		}
	}, 15000);
});
</script>

<div
    bind:this={overlay}
    class="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-[#b4c7ce] opacity-100 transition-opacity duration-500 ease-linear"
>
    <div
        class="w-14 h-14 border-[5px] border-black/20 border-t-black rounded-full animate-spin"
    >
    </div>
    <p class="text-sm text-neutral-700 tracking-wider">
        {loaderText}
    </p>
</div>


<style>
    :global(body.loading) {
        overflow: hidden;
    }
</style>