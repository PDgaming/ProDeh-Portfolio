<script lang="ts">
	import Navbar from '@components/navbar.svelte';
	import { appsList, currentApp, openApp } from '$lib/store/store.svelte';
</script>

<div class="desktop flex p-2">
	<div class="apps flex flex-col gap-1.5">
		{#each appsList.value as app (app.name)}
			<button
				class="app flex w-20 flex-col items-center gap-1 rounded-md bg-base-100/70 p-1.5 transition-colors hover:bg-base-100"
				class:app-open={currentApp.value === app.name}
				title={app.name}
				onclick={() => {
					openApp(app.name);
				}}
			>
				<div class="flex h-10 w-16 items-center justify-center">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party static SVG strings from the store -->
					{@html app.svg}
				</div>
				<span
					class="app-label w-full truncate text-center font-mono text-[11px] leading-tight text-base-content/80"
				>
					{app.name}
				</span>
			</button>
		{/each}
	</div>

	<Navbar />
</div>
