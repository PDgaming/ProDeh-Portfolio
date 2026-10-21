<script lang="ts">
	import { draggable, type DragEventData } from '@neodrag/svelte';
	import TitleBar from './titleBar.svelte';
	import { windowStateOf, closeApp, openApp, focusedApp } from '$lib/store/store.svelte';

	// One window instance per component (phase 12): the layout renders this
	// once per entry of `windowOrder`, passing the app it belongs to.
	let { appName, children } = $props();

	let appState = $derived(windowStateOf(appName));
	let isFocused = $derived(focusedApp() === appName);

	/**
	 * Controlled drag position (neodrag `position`). New windows cascade: a
	 * small random offset keeps consecutive windows from pixel-stacking.
	 * (Offsets reset when a window unmounts — minimizing forgets position.)
	 */
	type Offset = { x: number; y: number };
	function cascadeOffset(): Offset {
		return { x: 16 + Math.random() * 104, y: Math.random() * 64 };
	}
	let position = $state<Offset>(cascadeOffset());

	// Maximize must return the window to its DEFAULT position — a dragged
	// offset would otherwise maximize at the wrong place. The pre-maximize
	// offset comes back on restore.
	let preMaximized = $state<Offset | null>(null);
	$effect(() => {
		if (appState === 'maximized') {
			if (!preMaximized) preMaximized = { ...position };
			position = { x: 0, y: 0 };
		} else if (preMaximized) {
			position = preMaximized;
			preMaximized = null;
		}
	});

	// neodrag is controlled here: dragging reports offsets and we store them,
	// which is what lets maximize/restore own the position.
	function onDrag(data: DragEventData) {
		position = { x: data.offsetX, y: data.offsetY };
	}

	// Interactive resize via the bottom-right grip. `size` stays empty until
	// the visitor resizes, so the CSS defaults govern; it is not applied while
	// maximized (and survives a maximize/restore cycle).
	const MIN_SIZE = { w: 280, h: 180 };
	let size = $state<{ w?: number; h?: number }>({});
	let windowEl = $state<HTMLDivElement | null>(null);

	let windowSizeStyle = $derived.by(() => {
		if (appState === 'maximized') return '';
		const rules: string[] = [];
		if (size.w) rules.push(`width: ${size.w}px`);
		if (size.h) rules.push(`height: ${size.h}px`);
		return rules.join('; ');
	});

	function onResizeStart(e: PointerEvent) {
		if (appState === 'maximized' || !windowEl) return;
		e.preventDefault();
		const startW = windowEl.offsetWidth;
		const startH = windowEl.offsetHeight;
		const startX = e.clientX;
		const startY = e.clientY;
		const onMove = (ev: PointerEvent) => {
			size = {
				w: Math.min(Math.max(startW + ev.clientX - startX, MIN_SIZE.w), window.innerWidth),
				h: Math.min(Math.max(startH + ev.clientY - startY, MIN_SIZE.h), window.innerHeight)
			};
		};
		const onUp = () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}

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
	// Clicks originating in the title bar are EXCLUDED: the min/max/close
	// buttons act first in their own handlers, and re-raising in the bubble
	// phase would resurrect a window that was just closed (that was the
	// double-click-to-close bug).
	function onWindowClick(e: MouseEvent) {
		if (e.target instanceof Element && e.target.closest('.title-bar')) return;
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
	bind:this={windowEl}
	style={windowSizeStyle}
	use:draggable={{
		bounds: 'body',
		handle: '.title-bar',
		disabled: appState === 'maximized',
		position,
		onDrag
	}}
>
	<div class="window-inner" class:closing>
		<div class="title-bar w-full">
			<TitleBar {appName} />
		</div>
		<div class="window-content h-full w-full">
			{@render children()}
		</div>
	</div>
	<!-- Resize grip: bottom-right corner. Hidden while maximized (CSS). -->
	<div
		class="resize-handle"
		role="presentation"
		aria-hidden="true"
		onpointerdown={onResizeStart}
	></div>
</div>
