<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import TitleBar from './titleBar.svelte';
	import { windowStateOf, closeApp, openApp, focusedApp } from '$lib/store/store.svelte';

	// One window instance per component (phase 12): the layout renders this
	// once per entry of `windowOrder`, passing the app it belongs to.
	let { appName, children } = $props();

	let appState = $derived(windowStateOf(appName));
	let isFocused = $derived(focusedApp() === appName);

	// Close plays an exit animation first (window-close keyframe in
	// layout.css); the store-driven close (taskbar tap) stays instant. When
	// the store file is free of terminal-churn, add an onClosing hook there so
	// every close path can animate.
	let closing = $state(false);

	function requestClose() {
		if (closing) return;
		closing = true;
		// 140ms — matches the window-close keyframe duration.
		setTimeout(() => closeApp(appName), 140);
	}

	// Escape closes the FOCUSED window only — every instance listens, but all
	// but the focused one ignore the key. Inputs keep Escape for themselves
	// (the terminal app owns it).
	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape' || !isFocused) return;
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		) {
			return;
		}
		requestClose();
	}

	// Clicking a background window raises it, like a real window manager does.
	// Already-focused windows no-op (openApp skips an identical navigation).
	function onWindowClick() {
		if (!isFocused) openApp(appName);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<!-- eslint-disable-next-line svelte/a11y-click-events-have-key-events, svelte/a11y-no-static-element-interactions -- keyboard raise exists via taskbar/desktop buttons; Escape is handled window-level -->
<div
	class="window absolute"
	class:maximized={appState === 'maximized'}
	onclick={onWindowClick}
	use:draggable={{
		bounds: 'body',
		handle: '.title-bar',
		disabled: appState === 'maximized'
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
