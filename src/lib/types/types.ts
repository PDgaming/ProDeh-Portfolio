export interface Skill {
	name: string;
	svg: string;
}

export interface Repo {
	id: number;
	name: string;
	html_url: string;
	description?: string | null;
	language?: string | null;
	stargazers_count?: number;
	fork?: boolean;
	archived?: boolean;
	disabled?: boolean;
	pushed_at?: string | null;
	homepage?: string | null;
}
