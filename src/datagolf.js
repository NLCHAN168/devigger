import { config } from "dotenv";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";

config();

export const outrightOdds = async (list) => {
  const baseUrl = "https://feeds.datagolf.com/betting-tools/outrights?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString =
    baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
  return await fetch(queryString).then((res) => {
    return res.json();
  });
};

export const matchup3ballOdds = async (list) => {
  const baseUrl = "https://feeds.datagolf.com/betting-tools/matchups?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString =
    baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
  return await fetch(queryString).then((res) => {
    return res.json();
  });
};

export const allPairings = async (list) => {
  const baseUrl =
    "https://feeds.datagolf.com/betting-tools/matchups-all-pairings?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString =
    baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
  return await fetch(queryString).then((res) => {
    return res.json();
  });
};

// allPairings(list);
