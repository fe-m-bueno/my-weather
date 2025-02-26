<script lang="ts">
	import { onMount } from 'svelte';
	import {
		CloudSun,
		Thermometer,
		Sun,
		Wind,
		Waves,
		Droplet,
		Check,
		ChevronDown
	} from 'lucide-svelte';

	interface MetricOption {
		value: string;
		label: string;
		icon: typeof CloudSun;
	}

	export let options: MetricOption[] = [
		{ value: 'temperature', label: 'Temperature', icon: CloudSun },
		{ value: 'feels_like', label: 'Feels Like', icon: Thermometer },
		{ value: 'uv', label: 'UV Index', icon: Sun },
		{ value: 'wind_gust', label: 'Wind Gust', icon: Wind },
		{ value: 'rain_chance', label: 'Rain Chance', icon: Waves },
		{ value: 'humidity', label: 'Humidity', icon: Droplet }
	];

	export let selected: string = options[0].value;
	let isOpen = false;
	let activeIndex = 0;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(option: MetricOption) {
		selected = option.value;
		isOpen = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!isOpen) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = (activeIndex + 1) % options.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = (activeIndex - 1 + options.length) % options.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			selectOption(options[activeIndex]);
		} else if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest('.select-container')) {
			isOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="relative w-48 select-container z-50">
	<button
		onclick={toggleDropdown}
		onkeydown={handleKeyDown}
		class="flex items-center justify-between ~w-12/20 ~px-1/3 ~py-1/2 border rounded-3xl shadow-sm transition-colors
             focus:outline-none hover:bg-gray-200 dark:hover:bg-[#2c60bf] bg-white/75 dark:bg-white/5 backdrop-blur-lg"
	>
		{#each options as option}
			{#if selected === option.value}
				<svelte:component this={option.icon} class="w-6 h-6" />
			{/if}
		{/each}
		<ChevronDown class="w-6 h-6 ml-2" />
	</button>

	{#if isOpen}
		<ul
			role="listbox"
			class="absolute z-50 mt-1 w-full bg-slate-100 dark:bg-[#2551a0] backdrop-blur-lg shadow-lg rounded-lg max-h-80 border"
		>
			{#each options as option, index}
				<li
					role="option"
					class="z-50 flex first:rounded-t-lg last:rounded-b-lg items-center px-4 py-3 cursor-pointer transition-colors duration-150
                   hover:bg-gray-100 dark:hover:bg-[#2c60bf] ~text-sm/base
                   {selected === option.value ? 'font-semibold bg-gray-200 dark:bg-[#1d4080]' : ''}
                   {activeIndex === index ? 'ring-2 ring-gray-400' : ''}"
					onclick={() => selectOption(option)}
					onmouseenter={() => (activeIndex = index)}
				>
					<svelte:component this={option.icon} class="w-5 h-5 mr-2" />
					<span>{option.label}</span>
					{#if selected === option.value}
						<Check class="w-4 h-4 ml-auto" />
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
