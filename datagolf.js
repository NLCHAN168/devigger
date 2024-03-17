import { config } from "dotenv";
import { generate, builder } from "./querybuilder.js";

config();

let list = ["tour", "pga", "market", "win"];
export const outrightOdds = async (list) => {
  const baseUrl = "https://feeds.datagolf.com/betting-tools/outrights?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString = baseUrl + generate(builder(...list)) + endUrl;
  await fetch(queryString)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
};

// outrightOdds(list);

//need to key into data.match_list.odds per key
list = ["tour", "pga", "market", "round_matchups"];
export const matchup3ballOdds = async (list) => {
  const baseUrl = "https://feeds.datagolf.com/betting-tools/matchups?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString = baseUrl + generate(builder(...list)) + endUrl;
  await fetch(queryString)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      //   for (let odds in data.match_list) {
      //     console.log(data.match_list[odds]);
      //   }
    });
};

// matchup3ballOdds(list);

list = ["tour", "pga"];
export const allPairings = async (list) => {
  const baseUrl =
    "https://feeds.datagolf.com/betting-tools/matchups-all-pairings?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString = baseUrl + generate(builder(...list)) + endUrl;
  await fetch(queryString)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
};

// allPairings(list);
