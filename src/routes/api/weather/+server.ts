import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { WEATHER_API_KEY } from '$env/static/private';
import type { WeatherData } from '$lib/types';

const cache = new Map<string, { data: WeatherData; expires: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export const GET: RequestHandler = async ({ url }) => {
	const location = url.searchParams.get('location') || 'auto:ip';
	const days = 3;
	const cacheKey = `${location}-${days}`;
	const cached = cache.get(cacheKey);
	if (cached && Date.now() < cached.expires) {
		console.log(`Returning from cache for ${location}`);
		return json(cached.data);
	}

	const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`;
	const res = await fetch(apiUrl);

	if (res.ok) {
		const data: WeatherData = await res.json();

		cache.set(cacheKey, { data, expires: Date.now() + CACHE_DURATION });
		console.log(`Updating cache for ${location}`);

		return json(data);
	}

	return json({ error: 'Error fetching weather data' }, { status: res.status });
};
