/**
 * Terminal command registry — the seam between the framework
 * (src/components/apps/terminal.svelte) and YOUR shell logic.
 *
 * Adding a command means adding ONE object here. The framework handles
 * prompt rendering, history, unknown-command errors, and the terminal
 * UI; a command only decides what happens to its argv.
 */
export interface Command {
	name: string;
	help?: string;
	/** Framework wipes the transcript before invoking these. */
	clears?: boolean;
	/**
	 * argv[0] is the (lowercased) command name, the rest are arguments.
	 * Return a string (may contain "\n") to print, or nothing to print nothing.
	 */
	run: (argv: string[]) => string | void | Promise<string | void>;
}

export const prompt = 'visitor@prodeh:~$';

function help(argv: string[]): string {
	void argv;
	const entries = Object.values(commands);
	return [
		'Available commands:',
		...entries.map((c) => `  ${c.name.padEnd(10)}${c.help ?? ''}`),
		'',
	].join('\n');
}

/** Reference implementations — replace/extend with real shell logic. */
export const commands: Record<string, Command> = {
	help: {
		name: 'help',
		help: 'list available commands',
		run: help
	},
	echo: {
		name: 'echo',
		help: 'print the arguments back',
		run: (argv) => argv.slice(1).join(' ')
	},
	clear: {
		name: 'clear',
		help: 'wipe the transcript',
		clears: true,
		run: () => {
			// The framework watches `clears`, so the body stays empty.
		}
	}
};
