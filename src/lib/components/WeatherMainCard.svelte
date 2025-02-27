<script lang="ts">
	export let title: string;
	export let value: string;
	export let icon: string;
	export let text: string;
</script>

<div
	class="bg-white/75 backdrop-blur-sm dark:bg-black/10 rounded-3xl shadow p-6 flex flex-col items-center justify-around aspect-square"
>
	{#if value}
		<div class="flex flex-row items-center justify-between gap-2">
			<p class="~text-[0.9rem]/3xl font-medium">{title}</p>
			<img src={icon} alt={title} class="~w-12/16 ~h-12/16" loading="eager" fetchpriority="high" />
		</div>

		<p class="mt-2 ~text-6xl/9xl font-bold">{value}</p>
		<p class="~text-2xl/3xl text-center">{text}</p>
	{:else}
		<div class="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
		<h2 class="text-sm font-semibold text-center">{title}</h2>
		<p
			class="mt-2 text-[clamp(1.5rem, 5vw, 2.5rem)] font-bold text-center leading-none bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-24 h-8"
		></p>
		<span class="text-xs text-gray-500 bg-gray-300 dark:bg-gray-700 rounded w-20 h-4 animate-pulse"
		></span>
	{/if}
</div>
