<script module lang="ts">
declare const gtag: (...args: unknown[]) => void;
</script>

<script lang="ts">
	import { Spring } from "svelte/motion";
	import { onMount } from "svelte";
	import { activeCard } from "@/lib/stores/activeCard.svelte.ts";
	import {
		orientation,
		resetBaseOrientation,
	} from "@/lib/stores/orientation.svelte.ts";
	import { clamp, round, adjust } from "@/lib/helpers/math.ts";

	interface OrientationData {
		relative: { alpha: number; beta: number; gamma: number };
		absolute: { alpha: number; beta: number; gamma: number };
	}

	interface CardProps {
		id?: string;
		name?: string;
		number?: string;
		set?: string;
		types?: string | string[];
		subtypes?: string | string[];
		supertype?: string;
		rarity?: string;
		img?: string;
		back?: string;
		foil?: string;
		mask?: string;
		showcase?: boolean;
	}

	let {
		id = "",
		name = "",
		number = "",
		set = "",
		types = "",
		subtypes = "basic",
		supertype = "pokémon",
		rarity = "common",
		img = "",
		back = "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg",
		foil = "",
		mask = "",
		showcase = false,
	}: CardProps = $props();

	// Derived normalized prop values
	const normalizedRarity = $derived(rarity.toLowerCase());
	const normalizedSupertype = $derived(supertype.toLowerCase());
	const normalizedNumber = $derived(number.toLowerCase());
	const normalizedTypes = $derived(
		Array.isArray(types) ? types.join(" ").toLowerCase() : types,
	);
	const normalizedSubtypes = $derived(
		Array.isArray(subtypes) ? subtypes.join(" ").toLowerCase() : subtypes,
	);
	const isTrainerGallery = $derived(
		/^[tg]g/i.test(normalizedNumber) ||
			id === "swshp-SWSH076" ||
			id === "swshp-SWSH077",
	);

	const randomSeed = {
		x: Math.random(),
		y: Math.random(),
	};

	const cosmosPosition = {
		x: Math.floor(randomSeed.x * 734),
		y: Math.floor(randomSeed.y * 1280),
	};

	const back_img = $derived(back);
	let front_img = $state("");
	const img_base = $derived(img.startsWith("http") ? "" : "https://images.pokemontcg.io/");

	let thisCard: HTMLDivElement;
	let repositionTimer: ReturnType<typeof setTimeout>;
	let rafId: number | null = null;
	let pendingSpringUpdate: {
		background: { x: number; y: number };
		rotate: { x: number; y: number };
		glare: { x: number; y: number; o: number };
	} | null = null;

	let active = $state(false);
	let interacting = $state(false);
	let firstPop = true;
	let loading = $state(true);
	let isVisible = true;

	const springInteractSettings = { stiffness: 0.066, damping: 0.25 };
	const springPopoverSettings = { stiffness: 0.033, damping: 0.45 };

	const springRotate = new Spring({ x: 0, y: 0 }, springInteractSettings);
	const springGlare = new Spring({ x: 50, y: 50, o: 0 }, springInteractSettings);
	const springBackground = new Spring({ x: 50, y: 50 }, springInteractSettings);
	const springRotateDelta = new Spring({ x: 0, y: 0 }, springPopoverSettings);
	const springTranslate = new Spring({ x: 0, y: 0 }, springPopoverSettings);
	const springScale = new Spring(1, springPopoverSettings);

	let showcaseInterval: ReturnType<typeof setInterval>;
	let showcaseTimerStart: ReturnType<typeof setTimeout>;
	let showcaseTimerEnd: ReturnType<typeof setTimeout>;
	// svelte-ignore state_referenced_locally
	let showcaseRunning = $state(showcase);

	const endShowcase = () => {
		if (showcaseRunning) {
			clearTimeout(showcaseTimerEnd);
			clearTimeout(showcaseTimerStart);
			clearInterval(showcaseInterval);
			showcaseRunning = false;
		}
	};

	const interact = (e: PointerEvent) => {
		endShowcase();

		if (!isVisible) {
			interacting = false;
			return;
		}

		// prevent other background cards being interacted with
		if ($activeCard && $activeCard !== thisCard) {
			interacting = false;
			return;
		}

		interacting = true;

		const el = e.target as HTMLElement;
		const rect = el.getBoundingClientRect();
		const absolute = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
		const percent = {
			x: clamp(round((100 / rect.width) * absolute.x)),
			y: clamp(round((100 / rect.height) * absolute.y)),
		};
		const center = {
			x: percent.x - 50,
			y: percent.y - 50,
		};

		// Store the latest interaction data
		pendingSpringUpdate = {
			background: {
				x: adjust(percent.x, 0, 100, 37, 63),
				y: adjust(percent.y, 0, 100, 33, 67),
			},
			rotate: {
				x: round(-(center.x / 3.5)),
				y: round(center.y / 3.5),
			},
			glare: {
				x: round(percent.x),
				y: round(percent.y),
				o: 1,
			},
		};

		// Schedule spring update for next frame if not already scheduled
		if (rafId === null) {
			rafId = requestAnimationFrame(() => {
				if (pendingSpringUpdate) {
					updateSprings(
						pendingSpringUpdate.background,
						pendingSpringUpdate.rotate,
						pendingSpringUpdate.glare,
					);
					pendingSpringUpdate = null;
				}
				rafId = null;
			});
		}
	};

	const interactEnd = (_e?: Event | null, delay: number = 500) => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		pendingSpringUpdate = null;

		setTimeout(() => {
			const snapStiff = 0.01;
			const snapDamp = 0.06;
			interacting = false;

			springRotate.stiffness = snapStiff;
			springRotate.damping = snapDamp;
			springRotate.set({ x: 0, y: 0 }, { soft: 1 });

			springGlare.stiffness = snapStiff;
			springGlare.damping = snapDamp;
			springGlare.set({ x: 50, y: 50, o: 0 }, { soft: 1 });

			springBackground.stiffness = snapStiff;
			springBackground.damping = snapDamp;
			springBackground.set({ x: 50, y: 50 }, { soft: 1 });
		}, delay);
	};

	const activate = () => {
		if ($activeCard && $activeCard === thisCard) {
			$activeCard = undefined;
		} else {
			$activeCard = thisCard;
			resetBaseOrientation();
			gtag("event", "select_item", {
				item_list_id: "cards_list",
				item_list_name: "Pokemon Cards",
				items: [
					{
						item_id: id,
						item_name: name,
						item_category: set,
						item_category2: normalizedSupertype,
						item_category3: normalizedSubtypes,
						item_category4: normalizedRarity,
					},
				],
			});
		}
	};

	const deactivate = () => {
		interactEnd();
		$activeCard = undefined;
	};

	const reposition = () => {
		clearTimeout(repositionTimer);
		repositionTimer = setTimeout(() => {
			if ($activeCard && $activeCard === thisCard) {
				setCenter();
			}
		}, 300);
	};

	const setCenter = () => {
		const rect = thisCard.getBoundingClientRect();
		const view = document.documentElement;

		const delta = {
			x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
			y: round(view.clientHeight / 2 - rect.y - rect.height / 2),
		};
		springTranslate.set({ x: delta.x, y: delta.y });
	};

	const popover = () => {
		const rect = thisCard.getBoundingClientRect();
		let delay = 100;
		const scaleW = (window.innerWidth / rect.width) * 0.9;
		const scaleH = (window.innerHeight / rect.height) * 0.9;
		const scaleF = 1.75;
		setCenter();
		if (firstPop) {
			delay = 1000;
			springRotateDelta.set({ x: 360, y: 0 });
		}
		firstPop = false;
		springScale.set(Math.min(scaleW, scaleH, scaleF));
		interactEnd(null, delay);
	};

	const retreat = () => {
		springScale.set(1, { soft: true });
		springTranslate.set({ x: 0, y: 0 }, { soft: true });
		springRotateDelta.set({ x: 0, y: 0 }, { soft: true });
		interactEnd(null, 100);
	};

	const reset = () => {
		interactEnd(null, 0);
		springScale.set(1, { hard: true });
		springTranslate.set({ x: 0, y: 0 }, { hard: true });
		springRotateDelta.set({ x: 0, y: 0 }, { hard: true });
		springRotate.set({ x: 0, y: 0 }, { hard: true });
	};

	// Active card tracking
	$effect(() => {
		if ($activeCard && $activeCard === thisCard) {
			popover();
			active = true;
		} else {
			retreat();
			active = false;
		}
	});

	let foilStyles = $state("");
	const staticStyles = `
		--seedx: ${randomSeed.x};
		--seedy: ${randomSeed.y};
		--cosmosbg: ${cosmosPosition.x}px ${cosmosPosition.y}px;
	`;

	const dynamicStyles = $derived(`
		--pointer-x: ${springGlare.current.x}%;
		--pointer-y: ${springGlare.current.y}%;
		--pointer-from-center: ${clamp(
			Math.sqrt(
				(springGlare.current.y - 50) * (springGlare.current.y - 50) +
					(springGlare.current.x - 50) * (springGlare.current.x - 50),
			) / 50,
			0,
			1,
		)};
		--pointer-from-top: ${springGlare.current.y / 100};
		--pointer-from-left: ${springGlare.current.x / 100};
		--card-opacity: ${springGlare.current.o};
		--rotate-x: ${springRotate.current.x + springRotateDelta.current.x}deg;
		--rotate-y: ${springRotate.current.y + springRotateDelta.current.y}deg;
		--background-x: ${springBackground.current.x}%;
		--background-y: ${springBackground.current.y}%;
		--card-scale: ${springScale.current};
		--translate-x: ${springTranslate.current.x}px;
		--translate-y: ${springTranslate.current.y}px;
	`);

	const orientate = (data: OrientationData) => {
		const x = data.relative.gamma;
		const y = data.relative.beta;
		const limit = { x: 16, y: 18 };

		const degrees = {
			x: clamp(x, -limit.x, limit.x),
			y: clamp(y, -limit.y, limit.y),
		};

		updateSprings(
			{
				x: adjust(degrees.x, -limit.x, limit.x, 37, 63),
				y: adjust(degrees.y, -limit.y, limit.y, 33, 67),
			},
			{
				x: round(degrees.x * -1),
				y: round(degrees.y),
			},
			{
				x: adjust(degrees.x, -limit.x, limit.x, 0, 100),
				y: adjust(degrees.y, -limit.y, limit.y, 0, 100),
				o: 1,
			},
		);
	};

	const updateSprings = (
		background: { x: number; y: number },
		rotate: { x: number; y: number },
		glare: { x: number; y: number; o: number },
	) => {
		springBackground.stiffness = springInteractSettings.stiffness;
		springBackground.damping = springInteractSettings.damping;
		springRotate.stiffness = springInteractSettings.stiffness;
		springRotate.damping = springInteractSettings.damping;
		springGlare.stiffness = springInteractSettings.stiffness;
		springGlare.damping = springInteractSettings.damping;

		springBackground.set(background);
		springRotate.set(rotate);
		springGlare.set(glare);
	};

	// Orientation tracking
	$effect(() => {
		if ($activeCard && $activeCard === thisCard) {
			interacting = true;
			orientate($orientation);
		}
	});

	const imageLoader = () => {
		loading = false;
		if (mask || foil) {
			foilStyles = `
				--mask: url(${mask});
				--foil: url(${foil});
			`;
		}
	};

	// Visibility change handler
	$effect(() => {
		const handleVisibility = () => {
			isVisible = document.visibilityState === "visible";
			endShowcase();
			reset();
		};

		document.addEventListener("visibilitychange", handleVisibility);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	});

	onMount(() => {
		isVisible = document.visibilityState === "visible";
		// set the front image on mount so that
		// the lazyloading can work correctly
		front_img = img_base + img;

		// run a cute little animation on load
		// for showcase card
		if (showcase && isVisible) {
			const s = 0.02;
			const d = 0.5;
			let r = 0;
			showcaseTimerStart = setTimeout(() => {
				interacting = true;
				active = true;
				springRotate.stiffness = s;
				springRotate.damping = d;
				springGlare.stiffness = s;
				springGlare.damping = d;
				springBackground.stiffness = s;
				springBackground.damping = d;
				if (isVisible) {
					showcaseInterval = setInterval(() => {
						r += 0.05;
						springRotate.set({ x: Math.sin(r) * 25, y: Math.cos(r) * 25 });
						springGlare.set({
							x: 55 + Math.sin(r) * 55,
							y: 55 + Math.cos(r) * 55,
							o: 0.8,
						});
						springBackground.set({
							x: 20 + Math.sin(r) * 20,
							y: 20 + Math.cos(r) * 20,
						});
					}, 20);
					showcaseTimerEnd = setTimeout(() => {
						clearInterval(showcaseInterval);
						interactEnd(null, 0);
					}, 4000);
				} else {
					interacting = false;
					active = false;
				}
			}, 2000);
		}
	});
</script>

<svelte:window onscroll={reposition} />

<div
	class="card {normalizedTypes} / interactive /"
	class:active
	class:interacting
	class:loading
	class:masked={!!mask}
	data-number={normalizedNumber}
	data-set={set}
	data-subtypes={normalizedSubtypes}
	data-supertype={normalizedSupertype}
	data-rarity={normalizedRarity}
	data-trainer-gallery={isTrainerGallery}
	style={dynamicStyles}
	bind:this={thisCard}
>
	<div class="card__translater">
		<button
			class="card__rotator"
			onclick={activate}
			onpointermove={interact}
			onmouseout={() => interactEnd()}
			onblur={deactivate}
			aria-label="Expand the Pokemon Card; {name}."
			tabindex="0"
		>
			<img
				class="card__back"
				src={back_img}
				alt="The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
				loading="lazy"
				width="660"
				height="921"
			/>
			<div class="card__front" style={staticStyles + foilStyles}>
				<img
					src={front_img}
					alt="Front design of the {name} Pokemon Card, with the stats and info around the edge"
					onload={imageLoader}
					loading="lazy"
					width="660"
					height="921"
				/>
				<div class="card__shine"></div>
				<div class="card__glare"></div>
			</div>
		</button>
	</div>
</div>

<style>
	:root {
		--pointer-x: 50%;
		--pointer-y: 50%;
		--card-scale: 1;
		--card-opacity: 0;
		--translate-x: 0px;
		--translate-y: 0px;
		--rotate-x: 0deg;
		--rotate-y: 0deg;
		--background-x: var(--pointer-x);
		--background-y: var(--pointer-y);
		--pointer-from-center: 0;
		--pointer-from-top: var(--pointer-from-center);
		--pointer-from-left: var(--pointer-from-center);
	}
</style>