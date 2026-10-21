<script lang="ts">
	import Navbar from '@components/navbar.svelte';
	import { appsList, currentApp, openApp } from '$lib/store/store.svelte';
</script>

<div class="desktop flex p-2">
	<div class="apps flex flex-col gap-1.5">
		{#each appsList.value as app, i (app.name)}
			<button
				class="app desktop-icon group flex w-20 flex-col items-center gap-1 p-1"
				style="animation-delay: {i * 55}ms"
				title={app.name}
				onclick={() => {
					openApp(app.name);
				}}
			>
				<div
					class="flex h-12 w-16 items-center justify-center rounded-md bg-base-100/70 transition-colors group-hover:bg-base-100"
					class:app-open={currentApp.value === app.name}
					aria-hidden="true"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party static SVG strings from the store -->
					{@html app.svg}
				</div>
				<span
					class="app-label w-full truncate text-center font-mono text-[11px] leading-tight text-base-content/80 drop-shadow-sm"
				>
					{app.name}
				</span>
			</button>
		{/each}
	</div>

	<Navbar />
</div>
