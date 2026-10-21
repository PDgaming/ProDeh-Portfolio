<script lang="ts">
	import { setTheme, currentBackgroundImage, backgroundImages } from '$lib/store/store.svelte';
	import { onMount } from 'svelte';

	// Read localStorage only in onMount so this component stays SSR-safe.
	let selectedTheme = $state<'light' | 'business'>('light');

	onMount(() => {
		selectedTheme = localStorage.getItem('Theme') === 'business' ? 'business' : 'light';
	});

	function onThemeToggle(e: Event) {
		selectedTheme = selectedTheme === 'business' ? 'light' : 'business';
		localStorage.setItem('Theme', selectedTheme);
		// The theme reveal blooms from the control that triggered it.
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		setTheme(selectedTheme, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
	}
</script>

<div class="settings app-scroll bg-base-100 flex h-full w-full flex-col gap-3 px-3 pt-3 pb-6">
	<div class="theme-selector">
		<h2 class="font-display text-xl">Theme</h2>
		<label class="flex cursor-pointer gap-2">
			<span class="label-text">Corporate</span>
			<!-- No `theme-controller` class on purpose: daisyUI's :has() wiring
			     repaints the page before the theme-reveal snapshot would capture
			     the old state, which would erase the animation. Theming is owned
			     by the store's data-theme effect; this input only reports state. -->
			<input
				type="checkbox"
				value="business"
				class="toggle"
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
