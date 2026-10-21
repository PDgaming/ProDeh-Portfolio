<script lang="ts">
	import { frameworks, languages, platforms } from '$lib/data/skills';

	const categories = [
		{ name: 'Languages', items: languages },
		{ name: 'Frameworks', items: frameworks },
		{ name: 'Platforms', items: platforms }
	] as const;
</script>

<div
	class="skills app-scroll bg-base-100 flex h-full w-full flex-col items-center gap-3 px-3 pt-3 pb-8"
>
	<h1 class="font-display text-3xl">My Skills</h1>

	<div class="flex w-full max-w-6xl flex-wrap justify-center gap-6">
		{#each categories as cat (cat.name)}
			<div class="card bg-base-300 min-w-64 flex-1 shadow-md">
				<div class="card-body items-center">
					<h2 class="card-title text-xl">{cat.name}</h2>
					<div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
						{#each cat.items as item (item.name)}
							<div
								class="skill-tile hover:bg-base-200/50 flex flex-col items-center gap-2 rounded-2xl p-2 transition-transform hover:scale-105"
							>
								<div class="flex h-16 w-16 items-center justify-center" aria-hidden="true">
									{#if item.svg}
										<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party static SVG strings from the data module -->
										{@html item.svg}
									{:else}
										<!-- No logo data yet: a quiet monogram stand-in, not a fake brand mark. -->
										<div
											class="icon-fallback flex h-12 w-12 items-center justify-center rounded-lg"
										>
											<span class="font-mono text-sm opacity-60">
												{item.name.slice(0, 2).toUpperCase()}
											</span>
										</div>
									{/if}
								</div>
								<span class="badge badge-outline">{item.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	:global(.skill-tile svg) {
		width: 40px;
		height: 40px;
	}
</style>
