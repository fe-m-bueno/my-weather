<script lang="ts">
	import {
		Thermometer,
		Wind,
		Droplet,
		Sun,
		Umbrella,
		Sunrise,
		Sunset,
		Waves,
		Eclipse
	} from 'lucide-svelte';
	export let title: string;
	export let value: string;
</script>

<div
	class="bg-white/75 backdrop-blur-sm dark:bg-black/10 rounded-3xl shadow p-6 flex flex-col items-center justify-center min-h-[128px] gap-2 lg:aspect-square aspect-none"
>
	{#if title === 'Feels Like'}
		<div class="absolute top-4 left-4">
			<Thermometer class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Wind'}
		<div class="absolute top-4 left-4">
			<Wind class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Precipitation'}
		<div class="absolute top-4 left-4">
			<Umbrella class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Sunrise'}
		<div class="absolute top-4 left-4">
			<Sunrise class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Sunset'}
		<div class="absolute top-4 left-4">
			<Sunset class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Moon Phase'}
		<div class="absolute top-4 left-4">
			<Eclipse class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Humidity'}
		<div class="absolute top-4 left-4">
			<Waves class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'UV Index'}
		<div class="absolute top-4 left-4">
			<Sun class="~w-4/6 ~h-4/6" />
		</div>
	{:else if title === 'Chance of rain'}
		<div class="absolute top-4 left-4">
			<Droplet class="~w-4/6 ~h-4/6" />
		</div>
	{/if}
	<p class="~text-xs/base font-medium">{title}</p>
	<p class="~text-sm/2xl font-bold text-center">{value}</p>
</div>
