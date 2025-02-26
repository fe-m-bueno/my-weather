<script lang="ts">
	import type { SearchResult } from '$lib/types';

	let searchQuery = $state('');
	let searchResults: SearchResult[] = $state([]);
	let debounceTimeout: ReturnType<typeof setTimeout>;

	let { onSelect }: { onSelect?: (location: SearchResult) => void } = $props();

	async function handleInput() {
		clearTimeout(debounceTimeout);
		if (searchQuery.length < 3) {
			searchResults = [];
			return;
		}
		debounceTimeout = setTimeout(async () => {
			const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
			searchResults = await res.json();
		}, 300);
	}

	function selectLocation(location: SearchResult) {
		searchQuery = location.name + ', ' + location.region + ', ' + location.country;
		searchResults = [];
		if (onSelect) onSelect(location);
	}
</script>

<div class="relative max-w-[72rem] mx-auto">
	<input
		type="text"
		bind:value={searchQuery}
		placeholder="Search city..."
		oninput={handleInput}
		class="w-full py-4 px-6 border rounded-2xl bg-white/75 dark:bg-white/5 backdrop-blur-lg"
	/>
	{#if searchResults.length}
		<div
			class="absolute left-0 right-0 bg-white/80 dark:bg-white/10 backdrop-blur-lg border mt-1 rounded-2xl z-10"
		>
			{#each searchResults as result}
				<button
					type="button"
					aria-label={`${result.name}, ${result.region}, ${result.country}`}
					class="w-full text-left py-4 px-6 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:ring-2 first:rounded-t-2xl last:rounded-b-2xl ring-gray-400 cursor-pointer"
					onclick={() => selectLocation(result)}
					onkeydown={(e) => {
						if (e.key === 'Enter') selectLocation(result);
					}}
				>
					{result.name}, {result.region}, {result.country}
				</button>
			{/each}
		</div>
	{/if}
</div>
