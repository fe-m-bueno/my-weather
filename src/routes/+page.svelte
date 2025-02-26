<script lang="ts">
	import { onMount } from 'svelte';
	import type { WeatherData } from '$lib/types';
	import Search from '../lib/components/Search.svelte';
	import WeatherInfoCard from '../lib/components/WeatherInfoCard.svelte';
	import WeatherChart from '../lib/components/WeatherChart.svelte';
	import GeminiActivities from '../lib/components/GeminiActivities.svelte';
	import WeatherMainCard from '../lib/components/WeatherMainCard.svelte';
	import '../app.css';

	let weatherData: WeatherData | null = null;
	let loading = false;
	let unit: 'C' | 'F' = 'C';

	async function fetchWeather(location: string) {
		console.log('Fetching weather for:', location);
		loading = true;
		try {
			const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
			weatherData = await res.json();
		} catch (error) {
			console.error('Error fetching weather data:', error);
		} finally {
			loading = false;
		}
	}

	const weatherThemes: Record<number, string> = {
		1000: 'bg-gradient-to-b from-blue-400 to-blue-900 dark:bg-gradient-to-b dark:from-blue-900 dark:to-blue-400',
		1003: 'bg-gradient-to-b from-blue-300 to-blue-800 dark:bg-gradient-to-b dark:from-blue-800 dark:to-blue-300',
		1006: 'bg-gradient-to-b from-blue-200 to-blue-700 dark:bg-gradient-to-b dark:from-blue-700 dark:to-blue-200',
		1009: 'bg-gradient-to-b from-gray-300 to-gray-800 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-300',

		1030: 'bg-gradient-to-b from-gray-400 to-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-400',
		1063: 'bg-gradient-to-b from-gray-500 to-gray-800 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-500',
		1066: 'bg-gradient-to-b from-gray-600 to-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-600',
		1072: 'bg-gradient-to-b from-gray-600 to-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-600',

		1087: 'bg-gradient-to-b from-gray-700 to-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-70	0',
		1114: 'bg-gradient-to-b from-gray-700 to-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-700',
		1195: 'bg-gradient-to-b from-gray-800 to-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-800',
		1276: 'bg-gradient-to-b from-gray-900 to-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900'
	};

	let themeClass =
		'bg-gradient-to-b from-blue-400 to-blue-900 dark:bg-gradient-to-b dark:from-blue-900 dark:to-blue-400';

	function toggleUnit() {
		unit = unit === 'C' ? 'F' : 'C';
	}

	onMount(async () => {
		await fetchWeather('auto:ip');
	});

	let isDaytime = false;

	$: if (weatherData) {
		const [date, time] = weatherData.location.localtime.split(' ');
		const [hour] = time.split(':').map(Number);

		isDaytime = hour >= 6 && hour <= 18;

		themeClass =
			weatherThemes[weatherData?.current.condition.code] ||
			'bg-gradient-to-b from-gray-500 to-gray-800 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-500';

		document.documentElement.setAttribute('data-mode', isDaytime ? 'light' : 'dark');
	}
</script>

<svelte:head>
	<title>{weatherData ? `Weather in ${weatherData.location.name}` : 'Weather App'}</title>
	<meta
		name="description"
		content={weatherData
			? `Current weather in ${weatherData.location.name}, ${weatherData.location.country}. Temperature: ${weatherData.current.temp_c}°C, ${weatherData.current.condition.text}.`
			: 'Check the latest weather updates in your location!'}
	/>
	<meta
		name="keywords"
		content="weather, forecast, climate, temperature, humidity, wind, rain, sunshine, meteorology"
	/>
	<meta name="author" content="Felipe Bueno" />

	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<meta
		property="og:title"
		content={weatherData ? `Weather in ${weatherData.location.name}` : 'Weather App'}
	/>
	<meta
		property="og:description"
		content={weatherData
			? `Current temperature: ${weatherData.current.temp_c}°C in ${weatherData.location.name}.`
			: 'Check the latest weather updates!'}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/weather-thumbnail.jpg" />
	<meta property="og:url" content="https://weatherat.vercel.app" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content={weatherData ? `Weather in ${weatherData.location.name}` : 'Weather App'}
	/>
	<meta
		name="twitter:description"
		content={weatherData
			? `Current temperature: ${weatherData.current.temp_c}°C in ${weatherData.location.name}.`
			: 'Check the latest weather updates!'}
	/>
	<meta name="twitter:image" content="/weather-thumbnail.jpg" />
</svelte:head>

<div
	class={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${themeClass} py-8`}
>
	<nav class="flex flex-row justify-between items-center mb-8 w-full ~px-6/16">
		<span class="~text-lg/4xl font-bold text-white">Weather@</span>
		<h1 class="~text-lg/4xl font-bold text-white lg:absolute lg:left-1/2 lg:translate-x-[-50%]">
			{weatherData
				? `${weatherData?.location.name} - ${weatherData?.location.country}`
				: 'Loading...'}
		</h1>

		<button
			onclick={toggleUnit}
			class="bg-white dark:bg-black ~text-sm/2xl px-2 py-1 rounded-full font-bold ~w-8/16 ~h-8/16 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
		>
			{unit === 'C' ? '°C' : '°F'}
		</button>
	</nav>
	<div class="mx-auto px-4 min-w-[320px] ~w-[16rem]/[72rem]">
		<div class="mb-6">
			<Search onSelect={(location) => fetchWeather(`${location.name}, ${location.country}`)} />
		</div>

		{#if loading || !weatherData}
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-[72rem] mx-auto"
			>
				<div
					class="col-span-3 bg-gray-300 dark:bg-gray-700 h-full aspect-square rounded-3xl animate-pulse"
				></div>
				<div class="col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
					{#each Array(9) as _, i}
						<div
							class="bg-gray-300 dark:bg-gray-700 h-full min-h-[128px] lg:aspect-square rounded-3xl animate-pulse"
						></div>
					{/each}
				</div>
			</div>
			<div
				class="bg-gray-300 dark:bg-gray-700 w-full mx-auto rounded-3xl ~h-[24rem]/[49rem] animate-pulse mt-8"
			></div>
			<div class="max-w-[72rem] mx-auto mt-8">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{#each Array(4) as _, i}
						<div
							class="bg-gray-300 dark:bg-gray-700 w-full h-[20rem] rounded-3xl animate-pulse"
						></div>
					{/each}
				</div>
			</div>
		{:else}
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-[72rem] mx-auto"
			>
				<div class="col-span-3">
					<WeatherMainCard
						title="Current Temperature"
						value={`${unit === 'C' ? weatherData.current.temp_c : weatherData.current.temp_f}°${unit}`}
						icon={weatherData.current.condition.icon}
						text={weatherData.current.condition.text}
					/>
				</div>
				<div class="col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
					<WeatherInfoCard
						title="Feels Like"
						value={`${unit === 'C' ? weatherData.current.feelslike_c : weatherData.current.feelslike_f}°${unit}`}
					/>
					<WeatherInfoCard
						title="Chance of rain"
						value={`${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%`}
					/>
					<WeatherInfoCard title="UV Index" value={`${weatherData.current.uv}`} />
					<WeatherInfoCard
						title="Wind"
						value={`${unit === 'C' ? weatherData.current.wind_kph : weatherData.current.wind_mph}${unit === 'C' ? 'km/h' : 'mph'}`}
					/>
					<WeatherInfoCard
						title="Precipitation"
						value={`${weatherData.forecast.forecastday[0].day.totalprecip_mm}mm`}
					/>
					<WeatherInfoCard
						title="Sunrise"
						value={weatherData.forecast.forecastday[0].astro.sunrise}
					/>
					<WeatherInfoCard
						title="Sunset"
						value={weatherData.forecast.forecastday[0].astro.sunset}
					/>
					<WeatherInfoCard title="Humidity" value={`${weatherData.current.humidity}%`} />
					<WeatherInfoCard
						title="Moon Phase"
						value={weatherData.forecast.forecastday[0].astro.moon_phase}
					/>
				</div>
			</div>

			<div
				class="bg-gradient-to-b from-white/75 to-white backdrop-blur-sm dark:from-black/10 dark:to-black/35 h-fit shadow rounded-3xl ~p-6/12 m-8 max-w-[72rem] min-h-[24rem] mx-auto"
			>
				<WeatherChart hourlyData={weatherData.forecast.forecastday[0].hour} {unit} />
			</div>

			<div class="max-w-[72rem] mx-auto">
				<GeminiActivities {weatherData} />
			</div>
		{/if}
		<footer class="text-center text-sm mt-8">
			&copy; 2025 <a href="https://felipe-bueno.com" class="text-decoration-none">Felipe Bueno</a>
		</footer>
	</div>
</div>
