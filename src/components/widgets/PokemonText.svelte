<script lang="ts">
interface Props {
	text: string;
	align?: "start" | "end" | "center";
	class?: string;
	solidClass?: string;
	hollowClass?: string;
}

const {
	text,
	align = "start",
	class: customClass,
	solidClass,
	hollowClass,
}: Props = $props();

const words: string[] = text.trim().split(" ");
</script>

<span class={["relative w-full inline-block text-shadow-none", customClass]}>
	<span
		class={[
			"flex flex-row flex-wrap select-none",
			`justify-${align}`
		]}
	>
		{#each words as word}
			<span class="flex flex-row flex-wrap last:[&>.last-space]:hidden first:[&>.first-space]:hidden select-none">
					{#each word.split("") as letter}
						<span class="relative">
							<span
								class={[
									"font-pokemon-hollow",
									"relative z-1 block",
									"text-black",
									hollowClass
								]}
							>
								{letter}
							</span>
							<span
								class={[
									"font-pokemon-solid",
									"absolute top-0 left-0 z-0",
									"text-white",
									solidClass
								]}
							>
								{letter}
							</span>
						</span>
					{/each}
					<span class="last-space">&nbsp;&nbsp;</span>
				</span>
		{/each}

	</span>
	<span
		class={[
			"absolute top-0 left-0 w-full h-full z-1",
			"font-pokemon-hollow text-transparent",
			`text-${align}`,
		]}>{text}</span
	>
</span>