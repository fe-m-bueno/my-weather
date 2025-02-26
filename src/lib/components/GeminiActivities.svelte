<script lang="ts">
	import type { WeatherData, GeminiActivity } from '$lib/types';
	import { tick } from 'svelte';

	export let weatherData: WeatherData | null = null;
	let activities: GeminiActivity[] = [];
	let loading = false;

	async function fetchActivities() {
		if (!weatherData) return;

		loading = true;
		await tick();
		activities = [];

		const payload = {
			city: weatherData.location.name,
			tempMax: `${weatherData.forecast.forecastday[0].day.maxtemp_c}°C`,
			tempMin: `${weatherData.forecast.forecastday[0].day.mintemp_c}°C`,
			humidity: `${weatherData.current.humidity}%`,
			wind: `${weatherData.current.wind_kph} km/h`,
			rain: `${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%`
		};

		try {
			const res = await fetch('/api/gemini', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data: GeminiActivity[] = await res.json();
			activities = Array.isArray(data) ? data : [data];
		} catch (error) {
			console.error('Error fetching activities:', error);
		} finally {
			loading = false;
		}
	}

	$: if (weatherData) {
		fetchActivities();
	}
</script>

<div class="max-w-[72rem] mx-auto flex flex-col items-center justify-center min-h-[42rem]">
	{#if loading}
		<div
			class="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px] grid-auto-rows-[minmax(20rem,_1fr)]"
		>
			{#each Array(4) as _, i}
				<div class="bg-gray-300 dark:bg-gray-700 w-full h-[20rem] rounded-3xl animate-pulse"></div>
			{/each}
		</div>
	{:else if activities.length === 0}
		<p class="text-center">No activities found.</p>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{#each activities as activity}
				<div
					class="bg-white/75 backdrop-blur-sm dark:bg-black/10 rounded-3xl shadow p-4 flex flex-col items-center justify-center min-h-[20rem]"
				>
					<h3 class="~text-base/xl font-bold mb-2 p-6 text-center">{activity.name}</h3>
					<p class="mb-4 p-6 ~text-sm/base text-pretty">{activity.description}</p>

					<a
						class="font-bold absolute bottom-4 right-5"
						href={activity.map_link}
						target="_blank"
						rel="noopener noreferrer"
					>
						View on Map ↗
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
