<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import TitleBar from './titleBar.svelte';
	import { closeApp, windowState } from '$lib/store/store.svelte';

	let { children } = $props();

	// Close plays an exit animation first (window-close keyframe in
	// layout.css); the store-driven close (taskbar tap) stays instant. When
	// the store file is free of terminal-churn, add an onClosing hook there so
	// every close path can animate.
	let closing = $state(false);

	function requestClose() {
		if (closing) return;
		closing = true;
		// 140ms — matches the window-close keyframe duration.
		setTimeout(closeApp, 140);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		// Don't hijack Escape inside text inputs (the terminal app owns it).
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		) {
			return;
		}
		requestClose();
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
	<div class="window-inner" class:closing>
		<div class="title-bar w-full">
			<TitleBar />
		</div>
		<div class="window-content h-full w-full">
			{@render children()}
		</div>
	</div>
</div>
