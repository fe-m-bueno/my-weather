export interface WeatherData {
	location: {
		name: string;
		region: string;
		country: string;
		localtime: string;
	};
	current: {
		temp_c: number;
		temp_f: number;
		condition: {
			code: number;
			text: string;
			icon: string;
		};
		feelslike_c: number;
		feelslike_f: number;
		uv: number;
		wind_kph: number;
		wind_mph: number;
		humidity: number;
	};
	forecast: {
		forecastday: {
			date: string;
			day: {
				maxtemp_c: number;
				mintemp_c: number;
				daily_chance_of_rain: number;
				totalprecip_mm: number;
			};
			astro: {
				sunrise: string;
				sunset: string;
				moon_phase: string;
			};
			hour: {
				time: string;
				temp_c: number;
				temp_f: number;
				chance_of_rain: number;
				gust_kph: number;
				gust_mph: number;
				feelslike_c: number;
				feelslike_f: number;
				humidity: number;
				uv: number;
			}[];
		}[];
	};
}

export interface SearchResult {
	name: string;
	region: string;
	country: string;
}

export interface GeminiActivity {
	name: string;
	description: string;
	image_link: string;
	map_link: string;
}
