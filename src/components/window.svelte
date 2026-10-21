<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import TitleBar from './titleBar.svelte';

	let { children } = $props();
</script>

<div class="window absolute" use:draggable={{ bounds: 'body', handle: '.title-bar' }}>
	<div class="w-full flex h-full flex-col items-center">
		<div class="title-bar w-full">
			<TitleBar />
		</div>
		<div class="window-content h-full w-full">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.window {
		height: 70%;
		width: 60%;
		top: 8%;
		left: 21%;
	}
</style>
