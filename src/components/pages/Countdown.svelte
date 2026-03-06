<script lang="ts">
import { SvelteDate } from "svelte/reactivity";
import PokemonText from "../widgets/PokemonText.svelte";

const date = new SvelteDate();

$effect(() => {
	const interval = setInterval(() => {
		date.setTime(Date.now());
	}, 1000);

	return () => {
		clearInterval(interval);
	};
});

// 21 Mar 26, 12:00 AM IST
const targetTime = new Date("2026-03-21T00:00:00+05:30").getTime();

const time = $derived.by(() => {
	const currentTime = date.getTime();

	let diff = targetTime - currentTime;

	if (diff < 0) {
		diff = 0;
	}

	const dayMs = 24 * 60 * 60 * 1000;
	const hourMs = 60 * 60 * 1000;
	const minMs = 60 * 1000;

	const days = Math.floor(diff / dayMs);
	diff %= dayMs;
	const hours = Math.floor(diff / hourMs);
	diff %= hourMs;
	const minutes = Math.floor(diff / minMs);
	diff %= minMs;
	const seconds = Math.floor(diff / 1000);

	return [
		{ label: "Days", value: days },
		{ label: "Hours", value: hours },
		{ label: "Minutes", value: minutes },
		{ label: "Seconds", value: seconds },
	];
});
</script>

<div class="grid grid-cols-19 font-pokemon-hollow tracking-widest text-center text-black/60 select-none">
	{#each time as { label, value }, index}
		<!-- Time Unit -->
		<div class="col-span-4 flex flex-col">
			<p
				class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl m-0! text-shadow-lg"
			>
				{String(value).padStart(2, "0")}
			</p>
			<p
				class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-shadow-lg"
			>
				<PokemonText text={label} align="center" />
			</p>
		</div>
		<!-- Separator -->
		{#if index < time.length - 1}
			<div class="col-span-1">
				<p
					class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl m-0! text-shadow-lg"
				>
					:
				</p>
			</div>
		{/if}
	{/each}
</div>