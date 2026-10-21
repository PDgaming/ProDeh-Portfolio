<script lang="ts">
	import type { Repo } from '$lib/types/types';

	const MAX_CARDS = 12;
	const PINNED = {
		name: 'PD Enterprise',
		url: 'https://github.com/pd-enterprise/',
		description: 'An open source project of applications aimed at helping students'
	};

	// Fetched once per page load, not once per app open — the promise is cached
	// at module level so re-opening the app doesn't re-hit the rate-limited API.
	let cachedFetch: Promise<Repo[]> | null = null;

	function fetchRepos(clearCache: boolean): Promise<Repo[]> {
		if (!clearCache && cachedFetch) return cachedFetch;
		cachedFetch = fetch('https://api.github.com/users/PDgaming/repos?per_page=100').then(
			async (response): Promise<Repo[]> => {
				if (!response.ok) {
					throw new Error(
						response.status === 403 || response.status === 429
							? 'GitHub API rate limit reached. Try again in a minute.'
							: `GitHub API error ${response.status}`
					);
				}
				return (await response.json()) as Repo[];
			}
		);
		return cachedFetch;
	}

	// Keyed by attempt so the retry button can re-run the pipeline; attempt 0
	// reuses the cache.
	let attempt = $state(0);
	let reposPromise = $derived(
		fetchRepos(attempt > 0).then((repos) =>
			repos
				.filter((repo) => !repo.fork && !repo.archived && !repo.disabled)
				.sort(
					(a, b) =>
						(b.stargazers_count ?? 0) - (a.stargazers_count ?? 0) ||
						(b.pushed_at ?? '').localeCompare(a.pushed_at ?? '')
				)
				.slice(0, MAX_CARDS)
		)
	);

	function retry() {
		cachedFetch = null;
		attempt += 1;
	}
</script>

<div class="repositories bg-base-100 flex h-full w-full flex-col items-center gap-3">
	<h1 class="text-3xl">Projects I have worked on:</h1>
	{#await reposPromise}
		<p>Loading repositories...</p>
	{:then repos}
		<div class="project-list flex flex-wrap justify-center gap-3 overflow-y-scroll">
			<div class="card bg-base-300 h-45 w-80 shadow-sm">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
				<a class="card-body" href={PINNED.url} target="_blank" rel="noopener">
					<h2 class="card-title">{PINNED.name}</h2>
					<p>{PINNED.description}</p>
				</a>
			</div>
			{#each repos as repo (repo.id)}
				<div class="card bg-base-300 h-45 w-80 shadow-sm">
					<div class="card-body flex flex-col gap-2">
						<h2 class="card-title">
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
							<a href={repo.html_url} target="_blank" rel="noopener">{repo.name}</a>
						</h2>
						<p>{repo.description ?? 'No description yet.'}</p>
						<div class="card-actions justify-end">
							{#if repo.language}
								<div class="badge badge-outline">{repo.language}</div>
							{/if}
							{#if repo.stargazers_count}
								<div class="badge badge-ghost">★ {repo.stargazers_count}</div>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<div class="card bg-base-300 w-80 shadow-sm">
					<div class="card-body">
						<p>No public repositories yet — check back later.</p>
					</div>
				</div>
			{/each}
		</div>
	{:catch error}
		<div class="card bg-error/10 border-error/40 m-4 w-96 border shadow-sm">
			<div class="card-body">
				<h2 class="card-title text-error">Couldn't load repositories</h2>
				<p>{error instanceof Error ? error.message : 'Something went wrong.'}</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary btn-sm" onclick={retry}>Retry</button>
				</div>
			</div>
		</div>
	{/await}
</div>
