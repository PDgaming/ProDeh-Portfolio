<script lang="ts">
	import Navbar from '@components/navbar.svelte';
	import { appsList, windows, focusedApp, openApp } from '$lib/store/store.svelte';
</script>

<div class="desktop flex p-2">
	<div class="apps flex flex-col gap-1.5">
		{#each appsList.value as app, i (app.name)}
			{@const state = windows.value[app.name]}
			{@const focused = focusedApp() === app.name}
			<button
				class="app desktop-icon group flex w-20 flex-col items-center gap-1 p-1"
				style="animation-delay: {i * 55}ms"
				title={app.name}
				onclick={() => {
					openApp(app.name);
				}}
			>
				<!-- Ring levels: focused = primary (app-focused), merely open =
				     subtle (app-open), minimized = no ring at all. -->
				<div
					class="desktop-icon-chip liquid-glass flex h-12 w-16 items-center justify-center rounded-xl transition-colors duration-150"
					class:app-focused={focused}
					class:app-open={!!state && state !== 'minimized' && !focused}
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
