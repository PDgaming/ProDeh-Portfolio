<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import {
		theme,
		windows,
		windowOrder,
		focusedApp,
		openWindow,
		closeApp,
		currentBackgroundImage,
		backgroundImages,
		appsList,
		isMobile,
		initDeviceDetection
	} from '$lib/store/store.svelte';
	import { onMount, untrack, type Component } from 'svelte';
	import Desktop from '@components/Desktop.svelte';
	import Phone from '@components/Phone.svelte';
	import AboutMe from '@components/apps/aboutMe.svelte';
	import Projects from '@components/apps/projects.svelte';
	import Settings from '@components/apps/settings.svelte';
	import Skills from '@components/apps/skills.svelte';
	import Contact from '@components/apps/contact.svelte';
	import Terminal from '@components/apps/terminal.svelte';
	import Window from '@components/window.svelte';

	const title = 'ProDeh — Full Stack Developer';
	const description =
		'Portfolio of ProDeh, a full-stack developer working with SvelteKit, TypeScript, Python and Go. Rendered as a tiny desktop OS in your browser.';

	let { children } = $props();

	// Wallpaper crossfade state: the outgoing layer keeps rendering under the
	// current one until its fade window elapses (see the onMount effect).
	let shownBg = $state<string | undefined>(undefined);
	let leavingBg = $state<string | undefined>(undefined);
	let leaveTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	const appComponents: Record<string, Component> = {
		'About Me': AboutMe,
		Projects: Projects,
		Settings: Settings,
		Skills: Skills,
		Contact: Contact,
		Terminal: Terminal
	};
	let bgSrc = $derived(
		backgroundImages.value.find((b) => b.name.startsWith(currentBackgroundImage.value))?.src
	);
	// Resolved URLs for head tags. The first image is preloaded so the
	// wallpaper paints immediately instead of appearing after hydration.
	let firstBgSrc = $derived(backgroundImages.value[0]?.src);
	let ogImage = $derived($page.url.origin ? $page.url.origin + '/og.png' : '');

	onMount(() => {
		// Device switch (desktop vs phone branch)
		initDeviceDetection();

		// Theme
		const storedTheme = localStorage.getItem('Theme');
		if (storedTheme) {
			theme.value = storedTheme;
		}
		$effect(() => {
			document.documentElement.setAttribute('data-theme', theme.value);
		});

		// Background Image
		if (localStorage.getItem('BackgroundImage')) {
			let localBackground = localStorage
				.getItem('BackgroundImage')
				?.replace(/\.(jpg|png|webp)$/, '');

			if (localBackground) {
				currentBackgroundImage.value = localBackground;
			}
		}

		// Wallpaper crossfade bookkeeping: on change the outgoing layer lingers
		// underneath while the new one fades in and settles; the old one is
		// dropped once its recede is done (650ms > artwork 420ms).
		$effect(() => {
			const src = bgSrc;
			untrack(() => {
				if (!src || shownBg === src) return;
				leavingBg = shownBg;
				shownBg = src;
				clearTimeout(leaveTimer);
				leaveTimer = setTimeout(() => (leavingBg = undefined), 650);
			});
			return () => clearTimeout(leaveTimer);
		});

		// URL drives the FOCUSED window only; background windows just exist.
		// Unknown paths leave the state alone — +error.svelte handles those views.
		// State writes are untracked: this effect must re-run ONLY when the URL
		// changes. (Before, reading currentApp here made any set from an app
		// click re-run the effect while the URL was still '/' — closeApp then
		// cancelled the in-flight deep-link navigation, so clicks did nothing.)
		//
		// The close-on-'/' rule keys off the PREVIOUS path, not the focused
		// app: "back" closes the window whose URL you just left. Keying off
		// the focused window broke once minimize started navigating home —
		// that goto('/') would have closed the next background window.
		let lastPath = '';
		$effect(() => {
			const path = $page.url.pathname;
			const name = appsList.value.find((app) => `/${app.route}` === path)?.name;
			untrack(() => {
				if (path === '/') {
					// Bare URL — the browser just left a deep link (initial
					// load, back button, or minimize-to-home): close the
					// window that URL belonged to. Animated, like every
					// other close; minimized windows stay in the taskbar,
					// background windows survive.
					const fromApp = appsList.value.find((app) => `/${app.route}` === lastPath)?.name;
					const fromState = fromApp ? windows.value[fromApp] : undefined;
					if (fromApp && fromState && fromState !== 'minimized') closeApp(fromApp);
				} else if (name) {
					openWindow(name);
				}
			});
			lastPath = path;
		});
	});

	// One Escape listener for all windows (moved out of the per-window
	// component in phase 12): closes the FOCUSED window only. Inputs keep
	// Escape for themselves (the terminal app owns it).
	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		) {
			return;
		}
		const app = focusedApp();
		if (app) closeApp(app);
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f5f7fa" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1f2937" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin + '/'} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={ogImage} />
	{/if}
	{#if firstBgSrc}
		<link rel="preload" as="image" href={firstBgSrc} />
	{/if}
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<div class="main-content border-base-300 flex h-screen w-screen flex-col overflow-hidden">
	{#if isMobile.value}
		<Phone />
		<!-- App route pages exist only to make the URLs real; the layout above -->
		<!-- opens the window from the pathname. Error pages render independently -->
		<!-- of the device branch, so keep the children slot outside the {#if}. -->
		{@render children()}
	{:else}
		<div class="background relative h-full w-full">
			<!-- Wallpaper stack: outgoing layer rests under the top one while it
			     fades in and settles, drifting wider underneath so changing
			     wallpapers is a depth crossfade, not a hard cut. -->
			{#if leavingBg}
				<div
					class="wallpaper-layer wallpaper-leave absolute inset-0"
					style="background-image: url({leavingBg})"
					aria-hidden="true"
				></div>
			{/if}
			{#key shownBg}
				{#if shownBg}
					<div
						class="wallpaper-layer wallpaper-enter absolute inset-0"
						style="background-image: url({shownBg})"
						aria-hidden="true"
					></div>
				{/if}
			{/key}
			<!-- Theme-aware veil: keeps desktop labels, taskbar and windows
			     readable over any photo, in either theme. -->
			<div class="wallpaper-scrim absolute inset-0" aria-hidden="true"></div>
			<div class="desktop">
				<Desktop />
			</div>
			<!-- One window per open app, rendered in `windowOrder` so DOM order
			     stacks them by focus: the last entry paints on top. -->
			{#each windowOrder.value as appName (appName)}
				{#if windows.value[appName] && windows.value[appName] !== 'minimized'}
					{@const AppComp = appComponents[appName]}
					{#if AppComp}
						<Window {appName}>
							<AppComp />
						</Window>
					{/if}
				{/if}
			{/each}
			<!-- App route pages exist only to make the URLs real; the layout above -->
			<!-- opens the window from the pathname. -->
			{@render children()}
		</div>
	{/if}
</div>

<style>
	/* Wallpaper layers + scrim live in layout.css (shared primitives); the
	 * container just needs stacking context right, which `relative` above
	 * provides. */
</style>
