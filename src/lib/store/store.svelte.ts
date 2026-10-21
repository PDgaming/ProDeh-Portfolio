import backgroundImage1 from '../../assets/images/background_image1.webp';
import backgroundImage2 from '../../assets/images/background_image2.webp';
import backgroundImage3 from '../../assets/images/background_image3.webp';
import backgroundImage4 from '../../assets/images/background_image4.webp';
import backgroundImage5 from '../../assets/images/background_image5.webp';
import { ref } from './helper.svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { tick } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

export type WindowState = 'open' | 'minimized' | 'maximized';

export const appsList = ref([
	{
		name: 'About Me',
		iconColor: '#2b7fff',
		route: 'about-me',
		svg: '<svg fill="currentColor" width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>'
	},
	{
		name: 'Terminal',
		iconColor: '#00a63e',
		route: 'terminal',
		svg: `<svg fill="none" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 8L11 12L6 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M7 18H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>`
	},
	{
		name: 'Projects',
		iconColor: '#ad46ff',
		route: 'projects',
		svg: '<svg fill="currentColor" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 5V3H7v2H1v16h22V5zM8 4h8v1H8zm14 16H2V10h20zm0-11H2V6h20z"/><path fill="none" d="M0 0h24v24H0z"/></svg>'
	},
	{
		name: 'Skills',
		iconColor: '#00c951',
		route: 'skills',
		svg: `<svg fill="currentColor" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.5 13.187h-7.5v-12.187l-7.5 17.813h7.5v12.187l7.5-17.813z"></path>
            </svg>`
	},
	{
		name: 'Settings',
		iconColor: '#6a7282',
		route: 'settings',
		svg: `<svg fill="currentColor" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224Z" fill="#000000"/>
            <path d="M15.5227 12C15.5227 13.6569 14.1694 15 12.4999 15C10.8304 15 9.47705 13.6569 9.47705 12C9.47705 10.3431 10.8304 9 12.4999 9C14.1694 9 15.5227 10.3431 15.5227 12Z" fill="#1C274C"/>
            </svg>`
	},
	{
		name: 'Contact',
		iconColor: '#fb2c36',
		route: 'contact',
		svg: '<svg fill="currentColor" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4,21a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H5A1,1,0,0,0,4,3ZM12,7.5a2,2,0,1,1-2,2A2,2,0,0,1,12,7.5ZM8.211,16.215a4,4,0,0,1,7.578,0A.993.993,0,0,1,14.83,17.5H9.18A1,1,0,0,1,8.211,16.215Z"/></svg>'
	}
]);
export const theme = ref('light');

/**
 * Flip the theme with a circular reveal from the control that triggered it
 * (View Transitions API): the old page is snapshotted frozen while the new
 * theme opens outward — the `::view-transition-new(root)` keyframes in
 * layout.css read the `--vt-origin-*` vars set here. Reduced motion, no
 * origin point, or no API support fall back to the plain instant flip.
 */
export function setTheme(next: string, origin?: { x: number; y: number }) {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reducedMotion || !origin || typeof document.startViewTransition !== 'function') {
		theme.value = next;
		return;
	}
	// Set OUTSIDE the update callback so the frozen old snapshot and the
	// reveal keyframe share the same origin from the very first frame.
	document.documentElement.style.setProperty('--vt-origin-x', `${origin.x}px`);
	document.documentElement.style.setProperty('--vt-origin-y', `${origin.y}px`);
	document.startViewTransition(async () => {
		theme.value = next; // the layout's data-theme effect applies on the next flush
		await tick(); // the "after" snapshot waits until the attribute is really applied
	});
}

/**
 * Multi-window model (phase 12): one window per app, so the record key's
 * presence is "open" and its absence is "closed". `windowOrder` is
 * append-on-open/raise; the last open, non-minimized entry is the FOCUSED
 * (topmost) window and layout renders windows in this order so DOM stacking
 * follows focus. Windows deliberately do NOT survive a reload — a fresh visit
 * starts with the bare desktop.
 */
export const windows = ref<Record<string, WindowState>>({});
export const windowOrder = ref<string[]>([]);

/** The focused app: last open, non-minimized entry of `windowOrder` ('' if none). */
export function focusedApp(): string {
	const order = windowOrder.value;
	for (let i = order.length - 1; i >= 0; i--) {
		const name = order[i];
		const state = windows.value[name];
		if (state && state !== 'minimized') return name;
	}
	return '';
}

/** Per-window state; closed (missing) slots read as `open` for rendering. */
export function windowStateOf(name: string): WindowState {
	return windows.value[name] ?? 'open';
}

/** Open ↕ maximized toggle for one window's title bar button. */
export function toggleMaximize(appName: string) {
	const current = windowStateOf(appName);
	if (current === 'maximized') {
		// Restore in place — no focus change.
		windows.value = { ...windows.value, [appName]: 'open' };
		return;
	}
	// Maximize also FOCUSES: a maximized window should never end up hidden
	// behind others. Raise first (raises + URL deep link); openWindow keeps an
	// existing `maximized` state instead of resetting it.
	windows.value = { ...windows.value, [appName]: 'maximized' };
	openApp(appName);
}

/**
 * Raise an app to the front. Closed (missing) and minimized slots become
 * `open`; an already-open or maximized window keeps its state on raise.
 */
export function openWindow(appName: string) {
	if (!appsList.value.some((app) => app.name === appName)) return;
	// An open/raise resurrects an app that is mid-fold in its close animation.
	cancelPendingClose(appName);
	const previous = windows.value[appName];
	// Reorder first (raise), then restore the slot's state.
	windowOrder.value = [...windowOrder.value.filter((name) => name !== appName), appName];
	windows.value = {
		...windows.value,
		[appName]: !previous || previous === 'minimized' ? 'open' : previous
	};
}

/** Close exactly one window; the next topmost open window becomes focused. */
export function closeWindow(appName: string) {
	if (!(appName in windows.value)) return;
	const next = { ...windows.value };
	delete next[appName];
	windows.value = next;
	windowOrder.value = windowOrder.value.filter((name) => name !== appName);
}

/**
 * Windows playing their exit fold: they stay in `windows` (rendered, still
 * raisable-looking) while `.window-inner.closing` animation runs in the
 * Window component.
 */
export const closingApps = new SvelteSet<string>();
/** 140ms — must match the window-close keyframe duration in layout.css. */
const CLOSE_ANIMATION_MS = 140;
/** Live close timers (module state; the reactive half lives in `closingApps`). */
const closingTimers = new SvelteMap<string, ReturnType<typeof setTimeout>>();

/** Cancel an in-flight animated close (an open resurrects the app mid-fold). */
function cancelPendingClose(appName: string) {
	const timer = closingTimers.get(appName);
	if (timer) {
		clearTimeout(timer);
	}
	closingTimers.delete(appName);
	closingApps.delete(appName);
}

/**
 * Fold a window into the taskbar; the focus line-up moves on without it.
 * When the URL points at this app (it was the focused one), the browser
 * heads home instead — minimizing hands focus back to the bare desktop.
 */
export function minimizeWindow(appName: string) {
	if (!(appName in windows.value)) return;
	windows.value = { ...windows.value, [appName]: 'minimized' };
	const route = appsList.value.find((app) => app.name === appName)?.route;
	if (route && get(page).url.pathname === `/${route}`) {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- internal navigation to the bare desktop
		goto('/');
	}
}

/**
 * Open an app by name: raise/restore the window and make the URL its deep
 * link. The goto is skipped when the URL already shows this app — an
 * identical navigation would just push a duplicate history entry.
 */
export function openApp(name: string) {
	openWindow(name);
	const route = appsList.value.find((app) => app.name === name)?.route;
	if (route && get(page).url.pathname !== `/${route}`) {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- internal deep link; resolve()'s route typing doesn't cover these dynamic app routes yet
		goto(`/${route}`);
	}
}

/**
 * Close a window through its exit animation. The window keeps rendering
 * (still in `windows`, flagged in `closingApps`) while the fold plays, then
 * the URL goes home only when it actually pointed at this app — closing a
 * background window never touches the URL. Reduced motion closes the old
 * instant way. Every user-facing close path funnels here, so the animation
 * is uniform (taskbar, Home, Escape, title bar X, browser back button).
 */
export function closeApp(appName: string) {
	if (!appName || !(appName in windows.value)) return;
	if (closingApps.has(appName)) return; // already mid-fold
	const route = appsList.value.find((app) => app.name === appName)?.route;
	const finishClose = () => {
		closeWindow(appName); // no-op if a restore or a URL change beat the timer
		if (route && get(page).url.pathname === `/${route}`) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve -- internal navigation to the bare desktop
			goto('/');
		}
	};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		finishClose();
		return;
	}
	closingApps.add(appName);
	closingTimers.set(
		appName,
		setTimeout(() => {
			closingTimers.delete(appName);
			closingApps.delete(appName);
			finishClose();
		}, CLOSE_ANIMATION_MS)
	);
}

/** The layout swaps to the phone branch under this width. */
export const MOBILE_BREAKPOINT = 768;
export const isMobile = ref(false);

/**
 * Wire the viewport listener. Module-level because matchMedia would break
 * SSR — call it from onMount in the layout.
 */
export function initDeviceDetection() {
	const query = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);
	const apply = () => {
		isMobile.value = !query.matches;
	};
	apply();
	query.addEventListener('change', apply);
}

// Multi-window helpers above replaced the old openApp/closeApp.
// Screen-reader friendly reuse list for contact surfaces (contact app, terminal
// `contact` command later). TODO(ProDeh): replace the placeholders once you have
// a real email/LinkedIn — a wrong mailto bounces silently, so not shipped yet.
export const contactLinks = ref([
	{ label: 'GitHub', href: 'https://github.com/PDgaming' }
	// { label: 'Email', href: 'mailto:prodeh@yourdomain' },
	// { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
]);
export const backgroundImages = ref([
	{ name: 'background_image1.webp', src: backgroundImage1 },
	{ name: 'background_image2.webp', src: backgroundImage2 },
	{ name: 'background_image3.webp', src: backgroundImage3 },
	{ name: 'background_image4.webp', src: backgroundImage4 },
	{ name: 'background_image5.webp', src: backgroundImage5 }
]);
export const currentBackgroundImage = ref('background_image1');
