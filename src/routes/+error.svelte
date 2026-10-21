<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	// Unknown file in the OS metaphor. Same window chrome as the app windows,
	// but a plain card is fine here since the layout still paints it on the
	// desktop background.
	function goHome() {
		void goto(resolve('/'));
	}
</script>

<svelte:head>
	<title>File not found — ProDeh</title>
</svelte:head>

<div class="pointer-events-none fixed inset-0 flex items-center justify-center">
	<div class="pointer-events-auto card bg-base-100 w-96 border border-base-300 shadow-xl">
		<div class="title-bar bg-base-300 flex h-10 w-full cursor-default items-center px-2">
			<h1 class="text-sm">system-error.log</h1>
		</div>
		<div class="card-body gap-3">
			<p class="text-2xl">
				File not found ({$page.status ?? 404})
			</p>
			<p>
				The requested path <code class="bg-base-300 rounded px-1">{$page.url.pathname}</code>
				couldn't be found on this disk. It may have been deleted, or moved to the recycle bin.
			</p>
			<div class="card-actions justify-end">
				<button class="btn btn-primary btn-sm" onclick={goHome}>Back to desktop</button>
			</div>
		</div>
	</div>
</div>
