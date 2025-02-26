import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { WEATHER_API_KEY } from '$env/static/private';
import type { SearchResult } from '$lib/types';

const cache = new Map<string, { data: SearchResult[]; expires: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q');
	if (!query) return json([]);

	const cacheKey = `search-${query}`;

	const cached = cache.get(cacheKey);
	if (cached && Date.now() < cached.expires) {
		console.log(`Returning from cache for query: "${query}"`);
		return json(cached.data);
	}

	const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${query}`;
	const res = await fetch(apiUrl);

	if (res.ok) {
		const data: SearchResult[] = await res.json();

		cache.set(cacheKey, { data, expires: Date.now() + CACHE_DURATION });
		console.log(`Updating cache for query: "${query}"`);

		return json(data);
	}

	return json({ error: 'Error fetching search suggestions' }, { status: res.status });
};
