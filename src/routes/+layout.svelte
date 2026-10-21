<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import {
		theme,
		currentApp,
		windowState,
		currentBackgroundImage,
		backgroundImages,
		appsList
	} from '$lib/store/store.svelte';
	import { onMount, untrack, type Component } from 'svelte';
	import Desktop from '@components/Desktop.svelte';
	import AboutMe from '@components/apps/aboutMe.svelte';
	import Projects from '@components/apps/projects.svelte';
	import Settings from '@components/apps/settings.svelte';
	import Skills from '@components/apps/skills.svelte';
	import Contact from '@components/apps/contact.svelte';
	import Window from '@components/window.svelte';

	const title = 'ProDeh — Full Stack Developer';
	const description =
		'Portfolio of ProDeh, a full-stack developer working with SvelteKit, TypeScript, Python and Go. Rendered as a tiny desktop OS in your browser.';

	let { children } = $props();
	const appComponents: Record<string, Component> = {
		'About Me': AboutMe,
		Projects: Projects,
		Settings: Settings,
		Skills: Skills,
		Contact: Contact
	};
	let App = $derived(appComponents[currentApp.value]);
	let bgStyle = $derived(
		`background-image: url(${
			backgroundImages.value.find((b) => b.name.startsWith(currentBackgroundImage.value))?.src
		})`
	);
	// Resolved URLs for head tags. The first image is preloaded so the
	// wallpaper paints immediately instead of appearing after hydration.
	let firstBgSrc = $derived(backgroundImages.value[0]?.src);
	let ogImage = $derived($page.url.origin ? $page.url.origin + '/og.png' : '');

	onMount(() => {
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

		// URL decides which window is open; localStorage is no longer consulted.
		// Unknown paths leave the state alone — +error.svelte handles those views.
		// State writes are untracked: this effect must re-run ONLY when the URL
		// changes. (Before, reading currentApp here made any set from an app
		// click re-run the effect while the URL was still '/' — closeApp then
		// cancelled the in-flight deep-link navigation, so clicks did nothing.)
		$effect(() => {
			const path = $page.url.pathname;
			const name = appsList.value.find((app) => `/${app.route}` === path)?.name;
			untrack(() => {
				if (path === '/') {
					// Bare URL — nothing open (applies to the initial load and to
					// the browser's back button).
					currentApp.value = '';
					windowState.value = 'open';
				} else if (name) {
					currentApp.value = name;
					windowState.value = 'open';
				}
			});
		});
	});
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

<div class="main-content border-base-300 flex h-screen w-screen flex-col overflow-hidden">
	<div class="background h-full w-full" id="background-image" style={bgStyle}>
		<div class="desktop">
			<Desktop />
		</div>
		{#if currentApp.value && windowState.value !== 'minimized'}
			<Window>
				<App />
			</Window>
		{/if}
		<!-- App route pages exist only to make the URLs real; the layout above -->
		<!-- opens the window from the pathname. -->
		{@render children()}
	</div>
</div>

<style>
	.background {
		background-size: cover;
	}
</style>
