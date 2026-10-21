<script lang="ts">
	import { contactLinks } from '$lib/store/store.svelte';
</script>

<div class="contact bg-base-100 flex h-full w-full flex-col items-center gap-3 p-4">
	<h1 class="text-3xl">Contact Me</h1>
	<div class="card bg-base-300 w-96 max-sm:w-full shadow-sm">
		<div class="card-body flex flex-col gap-2">
			<h2 class="card-title text-xl">Find me at</h2>
			<ul class="flex flex-col gap-2">
				{#each contactLinks.value as link (link.href)}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
						<a class="link" href={link.href} target="_blank" rel="noopener">{link.label}</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="card bg-base-300 w-96 max-sm:w-full shadow-sm">
		<div class="card-body flex-row items-center justify-between gap-2">
			<span>Want the whole thing on paper?</span>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- static asset, not a route -->
			<a class="btn btn-primary btn-sm" href="/resume.pdf" download>Download resume</a>
		</div>
	</div>
</div>
