import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { GeminiActivity } from '$lib/types';

const apiKey = GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const cache = new Map<string, { data: GeminiActivity[]; expires: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export const POST: RequestHandler = async ({ request }) => {
	const { city, tempMax, tempMin, humidity, wind, rain } = await request.json();

	if (!apiKey) {
		return json({ error: 'API key not found' }, { status: 500 });
	}

	const cacheKey = `${city}-${tempMax}-${tempMin}-${humidity}-${wind}-${rain}`;

	const cached = cache.get(cacheKey);
	if (cached && Date.now() < cached.expires) {
		console.log(`Returning from cache for ${city}`);
		return json(cached.data);
	}

	const prompt = `Using the current weather data for ${city} (including details such as max temperature: ${tempMax}, min temperature ${tempMin}, humidity ${humidity}, wind speed ${wind}, precipitation probability ${rain}), please generate a list of engaging, locally-relevant activities that would be ideal for today. Consider whether the weather favors outdoor adventures, cultural or indoor experiences, and include any local events or attractions that align with the current climate.
    Return only 4 (FOUR) activities.
	For each activity, generate a valid Google Maps link in the format:
"https://www.google.com/maps/search/{Activity+Name}+in+{City}"
Return a pure JSON with this schema:
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "description": { "type": "string" },
      "map_link": { "type": "string", "format": "uri" }
    }
  }
}`;

	try {
		const result = await model.generateContent({
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			generationConfig: { temperature: 0.5 }
		});

		let textResponse = result.response.text();

		textResponse = textResponse
			.replace(/^```json\s*/, '')
			.replace(/```$/, '')
			.replace(/\u0000/g, '')
			.replace(/\r/g, '')
			.replace(/\t/g, ' ')
			.trim();
		console.log(textResponse);

		let output: GeminiActivity[];
		try {
			output = JSON.parse(textResponse);
		} catch (err) {
			return json({ error: 'Invalid JSON returned from Gemini' }, { status: 500 });
		}

		cache.set(cacheKey, { data: output, expires: Date.now() + CACHE_DURATION });
		console.log(`Updating cache for ${city}`);

		return json(output);
	} catch (error) {
		console.error('❌ Error calling Gemini:', error);
		return json({ error: 'Error calling Gemini' }, { status: 500 });
	}
};
