type BookOffering = "bet365" | "betfair" | "betmgm" | "betway" | "bovada" | "caesars" | "draftkings" | "fanduel" | "pointsbet" | "unibet" | "williamhill";

interface OddsEntry extends Record<BookOffering, string> {
	dg_id?: number;
	datagolf?: {
		baseline: null | string;
		baseline_history_fit: string;
	};
	player_name?: string;
}

export interface DatagolfResponse {
	books_offering?: BookOffering[];
	event_name?: string;
	last_updated?: string; // ISO date string
	market?: string;
	notes?: string;
	odds?: OddsEntry[];
}

//#TODO: create more types