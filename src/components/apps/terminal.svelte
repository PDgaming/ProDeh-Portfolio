<script lang="ts">
	import { commands, prompt } from '$lib/commands/registry';
	import { onMount, untrack } from 'svelte';

	let outputEl = $state<HTMLElement>();
	let inputEl = $state<HTMLInputElement>();

	// The transcript. Rendered as plain text nodes only — command output is
	// never injected as HTML, so commands can echo arbitrary input safely.
	let lines = $state<string[]>([]);
	let input = $state('');

	// History of executed lines; index -1 means the live input.
	let history = $state<string[]>([]);
	let historyIndex = $state(-1);

	function push(...text: string[]) {
		lines = [...lines, ...text];
	}

	$effect(() => {
		// Depend only on transcript length; the DOM write itself is untracked.
		void lines.length;
		untrack(() => {
			if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
		});
	});

	onMount(() => {
		// TODO(phase 07): make sure the on-screen keyboard opens on the phone
		// layout too, without yanking focus away from the desktop experience.
		inputEl?.focus();
	});

	async function execute(line: string) {
		push(`${prompt} ${line}`);

		// Whitespace parsing is framework work; commands only see argv.
		const argv = line.trim().split(/\s+/);
		const cmd = commands[argv[0].toLowerCase()];

		if (!cmd) {
			push(`${argv[0]}: command not found (try 'help')`);
			return;
		}
		if (cmd.clears) {
			lines = [];
			return;
		}
		const result = await cmd.run(argv);
		if (result !== undefined && result !== '') push(...String(result).split('\n'));
	}

	function submit() {
		const line = input;
		input = '';
		historyIndex = -1;
		if (line.trim()) history = [...history, line];
		void execute(line);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			submit();
		} else if (e.key === 'ArrowUp') {
			// Recall previous entry; stay put at the oldest one.
			if (history.length === 0) return;
			const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
			historyIndex = next;
			input = history[next];
			e.preventDefault();
		} else if (e.key === 'ArrowDown') {
			// Move forward through history; going past the last entry returns
			// to the live input line.
			if (historyIndex === -1) return;
			const next = historyIndex + 1;
			if (next >= history.length) {
				historyIndex = -1;
				input = '';
			} else {
				historyIndex = next;
				input = history[next];
			}
			e.preventDefault();
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- The input below is the real, tab-reachable target; this div just makes
	clicking anywhere in the terminal pull keyboard focus into the shell,
	like a real terminal would. -->
<div
	role="button"
	tabindex="0"
	class="terminal bg-base-300 flex h-full w-full flex-col"
	onclick={() => inputEl?.focus()}
>
	<div bind:this={outputEl} class="min-h-0 flex-1 overflow-y-auto p-3 font-mono text-sm">
		{#each lines as line, i (i)}
			<div class="whitespace-pre-wrap">{line}</div>
		{/each}
	</div>
	<div class="flex items-center gap-2 border-t border-base-100 p-3 font-mono text-sm">
		<span class="text-primary whitespace-nowrap">{prompt}</span>
		<input
			bind:this={inputEl}
			bind:value={input}
			class="w-full flex-1 bg-transparent text-sm outline-none"
			spellcheck="false"
			autocomplete="off"
			aria-label="terminal input"
			onkeydown={onKeydown}
		/>
	</div>
</div>

<style>
	/* Native blinking caret, colored to match the prompt. */
	.terminal input {
		caret-color: var(--color-primary);
	}
</style>
