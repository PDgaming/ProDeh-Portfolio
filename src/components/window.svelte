<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import TitleBar from './titleBar.svelte';
	import { closeApp, windowState } from '$lib/store/store.svelte';

	let { children } = $props();

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		// Don't hijack Escape inside text inputs (matters for the upcoming
		// terminal app, where Escape belongs to the shell).
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		) {
			return;
		}
		closeApp();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div
	class="window absolute"
	class:maximized={windowState.value === 'maximized'}
	use:draggable={{
		bounds: 'body',
		handle: '.title-bar',
		disabled: windowState.value === 'maximized'
	}}
>
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
	.window.maximized {
		height: calc(100% - 3.5rem);
		width: 100%;
		top: 0;
		left: 0;
	}
</style>
