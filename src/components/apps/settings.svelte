<script lang="ts">
	import { theme, currentBackgroundImage, backgroundImages } from '$lib/store/store.svelte';
	import { onMount } from 'svelte';

	// Read localStorage only in onMount so this component stays SSR-safe.
	let selectedTheme = $state<'light' | 'business'>('light');

	onMount(() => {
		selectedTheme = localStorage.getItem('Theme') === 'business' ? 'business' : 'light';
	});

	function onThemeToggle() {
		selectedTheme = selectedTheme === 'business' ? 'light' : 'business';
		theme.value = selectedTheme;
		localStorage.setItem('Theme', selectedTheme);
	}
</script>

<div class="settings app-scroll bg-base-100 flex h-full w-full flex-col gap-3 px-3 pt-3 pb-6">
	<div class="theme-selector">
		<h2 class="font-display text-xl">Theme</h2>
		<label class="flex cursor-pointer gap-2">
			<span class="label-text">Corporate</span>
			<input
				type="checkbox"
				value="business"
				class="theme-controller toggle"
				checked={selectedTheme === 'business'}
				onchange={onThemeToggle}
			/>
			<span class="label-text">Business</span>
		</label>
	</div>
	<div class="background-image">
		<h2 class="font-display text-xl">Background Image</h2>
		<div class="all-images flex flex-row flex-wrap justify-center gap-5 p-2">
			{#each backgroundImages.value as backgroundImage (backgroundImage.name)}
				<div class="image-option flex flex-col items-center justify-center gap-1">
					<button
						class={`rounded-2xl border-4 transition-colors ${
							backgroundImage.name.split('.')[0] == currentBackgroundImage.value
								? 'border-primary'
								: 'border-transparent hover:border-primary/30'
						}`}
						aria-pressed={backgroundImage.name.split('.')[0] == currentBackgroundImage.value}
						onclick={() => {
							currentBackgroundImage.value = backgroundImage.name.split('.')[0];
							localStorage.setItem('BackgroundImage', backgroundImage.name);
						}}
					>
						<img
							src={backgroundImage.src}
							alt={backgroundImage.name.split('.')[0].replaceAll('_', ' ')}
							class={`h-28 w-28 rounded-xl border-2 border-base-300 ${backgroundImage.name.split('.')[0] != currentBackgroundImage.value ? 'hover:scale-105' : ''}`}
						/>
					</button>
					<span class="text-sm">
						{backgroundImage.name.split('.')[0].replaceAll('_', ' ').replace('image', 'image ')}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
