<script lang="ts">
	import * as d3 from 'd3';
	import type { WeatherData } from '$lib/types';
	import { CloudSun, Sun, Wind, Droplet, Thermometer, Waves } from 'lucide-svelte';
	import Select from './Select.svelte';

	export let hourlyData: WeatherData['forecast']['forecastday'][0]['hour'] = [];
	export let unit: 'C' | 'F' = 'C';
	export let width = 640;
	export let height = 400;
	export let marginTop = 20;
	export let marginRight = 20;
	export let marginBottom = 30;
	let marginLeft = 40;
	interface MetricOption {
		value: string;
		label: string;
		icon: typeof CloudSun;
	}
	const options: MetricOption[] = [
		{ value: 'temperature', label: 'Temperature', icon: CloudSun },
		{ value: 'feels_like', label: 'Feels Like', icon: Thermometer },
		{ value: 'uv', label: 'UV Index', icon: Sun },
		{ value: 'wind_gust', label: 'Wind Gust', icon: Wind },
		{ value: 'rain_chance', label: 'Rain Chance', icon: Waves },
		{ value: 'humidity', label: 'Humidity', icon: Droplet }
	];

	let selectedMetric: string = options[0].value;

	let gx: SVGGElement | null = null;
	let gy: SVGGElement | null = null;

	const metricDomain: Record<string, [number, number]> = {
		temperature: [10, 30],
		feels_like: [10, 30],
		uv: [0, 12],
		wind_gust: [0, 100],
		rain_chance: [0, 100],
		humidity: [0, 100]
	};

	const metricColorScales: Record<string, d3.ScaleLinear<string, string>> = {
		temperature: d3
			.scaleLinear<string>()
			.domain(metricDomain['temperature'])
			.range(['lightblue', 'orange'])
			.clamp(true),
		uv: d3.scaleLinear<string>().domain(metricDomain['uv']).range(['green', 'red']).clamp(true),
		wind_gust: d3
			.scaleLinear<string>()
			.domain(metricDomain['wind_gust'])
			.range(['blue', 'lightblue'])
			.clamp(true),
		rain_chance: d3
			.scaleLinear<string>()
			.domain(metricDomain['rain_chance'])
			.range(['navy', 'darkblue'])
			.clamp(true),
		feels_like: d3
			.scaleLinear<string>()
			.domain(metricDomain['feels_like'])
			.range(['blue', 'orange'])
			.clamp(true),
		humidity: d3
			.scaleLinear<string>()
			.domain(metricDomain['humidity'])
			.range(['green', 'purple'])
			.clamp(true)
	};

	$: data = hourlyData.map((d) => {
		switch (selectedMetric) {
			case 'temperature':
				return unit === 'C' ? d.temp_c : d.temp_f;
			case 'feels_like':
				return unit === 'C' ? d.feelslike_c : d.feelslike_f;
			case 'uv':
				return d.uv;
			case 'wind_gust':
				return d.gust_kph;
			case 'rain_chance':
				return d.chance_of_rain;
			case 'humidity':
				return d.humidity;
			default:
				return 0;
		}
	});

	$: x = d3
		.scaleLinear()
		.domain([0, data.length - 1])
		.range([marginLeft, width - marginRight]);
	$: y = d3
		.scaleLinear()
		.domain(d3.extent(data) as [number, number])
		.nice()
		.range([height - marginBottom, marginTop]);

	$: line = d3
		.line<number>()
		.x((_, i) => x(i))
		.y(y)
		.curve(d3.curveCatmullRom);

	function formatYAxisTick(value: d3.NumberValue, _index: number): string {
		const numValue = +value;
		switch (selectedMetric) {
			case 'temperature':
			case 'feels_like':
				return `${numValue}°${unit}`;
			case 'uv':
				return `${numValue}`;
			case 'wind_gust':
				return `${numValue}${unit === 'C' ? 'km/h' : 'mph'}`;
			case 'rain_chance':
				return `${numValue}%`;
			case 'humidity':
				return `${numValue}%`;
			default:
				return `${numValue}`;
		}
	}

	$: if (gx) d3.select(gx).call(d3.axisBottom(x));
	$: if (gy) d3.select(gy).call(d3.axisLeft(y).tickFormat(formatYAxisTick));

	$: gradientColors = [
		metricColorScales[selectedMetric](metricDomain[selectedMetric][0]),
		metricColorScales[selectedMetric](metricDomain[selectedMetric][1])
	];

	let hoverX: number | null = null;
	let hoverValue: number | null = null;

	function handleMouseMove(event: MouseEvent) {
		const [mx] = d3.pointer(event);
		const clampedX = Math.max(marginLeft, Math.min(mx, width - marginRight));
		hoverX = clampedX;
		const index = Math.round(x.invert(clampedX));
		hoverValue = data[index];
	}

	function handleMouseOut() {
		hoverX = null;
		hoverValue = null;
	}
</script>

<div class="h-full z-20">
	<div class="flex flex-row justify-start items-center">
		<h3 class="absolute left-1/2 -translate-x-1/2 ~text-sm/xl font-bold">
			{#if selectedMetric === 'temperature'}
				<span class="mr-2 flex items-center justify-center ~gap-1/3">
					<CloudSun class="~w-4/6 ~h-4/6" />
					Temperature
				</span>
			{:else if selectedMetric === 'feels_like'}
				<span class="mr-2 flex items-center justify-center ~gap-1/3">
					<Thermometer class="~w-4/6 ~h-4/6" />
					Feels Like
				</span>
			{:else if selectedMetric === 'uv'}
				<span class="mr-2 flex items-center justify-center ~gap-1/3">
					<Sun class="~w-4/6 ~h-4/6" />
					UV Index
				</span>
			{:else if selectedMetric === 'wind_gust'}
				<span class="mr-2 flex items-center justify-center ~gap-1/3">
					<Wind class="~w-4/6 ~h-4/6" />
					Wind Gust
				</span>
			{:else if selectedMetric === 'rain_chance'}
				<span class="mr-2 flex items-center justify-center ~gap-1/3">
					<Waves class="~w-4/6 ~h-4/6" />
					Rain Chance
				</span>
			{:else if selectedMetric === 'humidity'}
				<span class="mr-2 flex items-center justify-center ~gap-1/3">
					<Droplet class="~w-4/6 ~h-4/6" />
					Humidity
				</span>
			{/if}
		</h3>

		<Select bind:selected={selectedMetric} />
	</div>

	<svg
		width="100%"
		viewBox={`0 0 ${width} ${height}`}
		class="mx-auto mt-6"
		onmousemove={handleMouseMove}
		onmouseout={handleMouseOut}
		onblur={handleMouseOut}
	>
		{#if data.length}
			<g bind:this={gx} transform={`translate(0, ${height - marginBottom})`} />
			<g bind:this={gy} transform={`translate(${marginLeft}, 0)`} />

			<defs>
				<linearGradient
					id="lineGradient"
					gradientUnits="userSpaceOnUse"
					x1="0"
					x2="0"
					y1={height - marginBottom}
					y2={marginTop}
				>
					<stop offset="0%" stop-color={gradientColors[0]} />
					<stop offset="100%" stop-color={gradientColors[1]} />
				</linearGradient>
			</defs>

			<path
				fill="url(#lineGradient)"
				d={d3
					.area<number>()
					.x((_, i) => x(i))
					.y0(height - marginBottom)
					.y1(y)
					.curve(d3.curveCatmullRom)(data) ?? ''}
				opacity="0.3"
			/>

			<path fill="none" stroke="url(#lineGradient)" stroke-width="4" d={line(data) ?? ''} />

			{#if hoverX !== null && hoverValue !== null}
				<line
					x1={hoverX}
					x2={hoverX}
					y1={marginTop}
					y2={height - marginBottom}
					stroke="black"
					stroke-dasharray="4"
				/>
				<rect x={hoverX + 5} y={marginTop} width="50" height="20" fill="white" stroke="black" />
				<text x={hoverX + 10} y={marginTop + 15} fill="black" font-size="12">
					{hoverValue}{selectedMetric === 'temperature' || selectedMetric === 'feels_like'
						? `°${unit}`
						: ''}
				</text>
			{/if}
		{/if}
	</svg>
</div>
