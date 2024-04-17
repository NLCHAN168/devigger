type BookOffering = "bet365" | "betfair" | "betmgm" | "betway" | "bovada" | "caesars" | "draftkings" | "fanduel" | "pointsbet" | "unibet" | "williamhill";

interface OddsEntry extends Record<BookOffering, string> {
	dg_id?: number;
	datagolf?: {
		baseline?: null | string;
		baseline_history_fit?: string;
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

interface Leg {
	Odds: string,
	MarketJuice: number,
	FairValue: number,
}

interface Final {
    Odds: string;
    FairValue: number;
    FairValue_Odds: number;
    EV_Percentage: number;
    Kelly_Full: number;
    FB_Percentage: number;
    DevigMethod: "wc:m";
}

export interface DevigResponse {
	[key: `Leg#${number}`]:  Leg;
	Final: Final;
}

