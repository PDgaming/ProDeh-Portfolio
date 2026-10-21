<script lang="ts">
	import { appsList, currentApp, windowState, openApp, closeApp } from '$lib/store/store.svelte';
	import { onMount } from 'svelte';

	function onTaskbarAppClick(name: string) {
		// Clicking a running app's taskbar icon closes it; otherwise open/restore.
		if (currentApp.value === name && windowState.value !== 'minimized') {
			closeApp();
		} else {
			openApp(name);
		}
	}

	let date = $state(new Date());
	let hour: number = $derived(date.getHours());
	let minute = $derived(date.getMinutes());
	let second = $derived(date.getSeconds());

	let today = $derived(date.getDate());
	let month = $derived(date.getMonth());
	let year = $derived(date.getFullYear());

	// Padded, no-jitter clock. `getHours() >= 12` fixes the noon→AM bug;
	// `month + 1` fixes the showing of the zero-based index as a date.
	let timeLine = $derived(
		`${String(hour % 12 || 12).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
	);
	let dayOrNight = $derived(hour >= 12 ? 'PM' : 'AM');
	let dateLine = $derived(
		`${String(today).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`
	);

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div
	class="task-bar absolute right-0 bottom-0 left-0 z-100 flex h-12 w-full items-center justify-center gap-3 overflow-hidden p-1"
>
	<div class="apps flex gap-3">
		<button
			class="app"
			title="Home"
			onclick={() => {
				closeApp();
			}}
			aria-label="Home"
		>
			<div
				class="flex h-full w-10 items-center justify-center rounded-md bg-base-100 text-base-content"
			>
				<svg
					width="30px"
					height="30px"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</button>
		{#each appsList.value as app (app.name)}
			<button
				class="app flex h-10 w-10 items-center justify-center rounded-md"
				class:taskbar-open={currentApp.value === app.name && windowState.value !== 'minimized'}
				class:taskbar-minimized={currentApp.value === app.name && windowState.value === 'minimized'}
				title={app.name}
				onclick={() => {
					onTaskbarAppClick(app.name);
				}}
				aria-label={app.name}
				style="background-color: {app.iconColor}"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party static SVG strings from the store -->
				{@html app.svg}
			</button>
		{/each}
	</div>
	<div class="system-tray absolute right-0 p-4">
		<div class="clock flex flex-col items-center justify-center font-mono text-xs tabular-nums">
			<div class="time">
				<p>{timeLine} {dayOrNight}</p>
			</div>
			<div class="date">
				<p>{dateLine}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.task-bar {
		background-color: var(--base-300);
		backdrop-filter: blur(10px);
	}
	.app {
		transition: transform 0.2s ease-in-out;
	}
	.app:hover {
		transform: scale(1.1);
	}
</style>
