type BookOffering = "bet365" | "betfair" | "betmgm" | "betway" | "bovada" | "caesars" | "draftkings" | "fanduel" | "pointsbet" | "unibet" | "williamhill";
type MatchupBooks = BookOffering | "datagolf" 

interface OddsEntry extends Record<BookOffering, string> {
	dg_id?: number;
	datagolf?: {
		baseline?: null | string;
		baseline_history_fit?: string;
	};
	player_name?: string;
}

interface MatchupTieEntry {
	odds: {
		bet365: {
			p1: number;
			p2: number;
			tie: number;
		},
		datagolf: {
			p1: number;
			p2: number;
			tie: number;
		}
	},
	p1_dg_id: number;
	p1_player_name: string;
	p2_dg_id: number;
	p2_player_name: string;
	ties: string;
}

interface MatchupEntry extends Record<MatchupBooks, {p1:string, p2: string}> {
	odds: {
		MatchupBooks?: {
			p1: string;
			p2: string;
		}
	},
	p1_dg_id: number;
	p1_player_name: string;
	p2_dg_id: number;
	p2_player_name: string;
	ties: string;
}

interface Threeball {
		p1: number;
		p2: number;
		p3: number;
}

interface ThreeballOddsEntry {
	odds: {	
		bet_365?: { type: Threeball }
		bovada?: { type: Threeball }
		datagolf: { type: Threeball }
		draftkings?: { type: Threeball }
		fanduel?: { type: Threeball }
	}
	p1_dg_id: number;
	p1_player_name: string;
	p2_dg_id: number;
	p2_player_name: string;
	p3_dg_id: number;
	p3_player_name: string;
	ties: string;
}

interface TourEntry {
	course: string;
	course_key: string;
	event_id: number;
	event_name: string;
	latitude: number;
	location: string;
	longitude: number;
	start_date: string;
	tour?: string;
}

export interface ScheduleResponse {
	current_season: string;
	schedule: TourEntry[];
	tour: string;
}


export interface MatchUpResponse {
	event_name: string;
	last_updated: string;
	market: string;
	match_list?: string | MatchupEntry[] | MatchupTieEntry[] ;
}

export interface ThreeballResponse {
	event_name: string;
	last_updated: string;
	market: string;
	round_num: number;
	match_list?: string | ThreeballOddsEntry[];
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

