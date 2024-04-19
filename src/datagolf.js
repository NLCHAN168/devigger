import { config } from "dotenv";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";
/** @typedef {import('./d.ts').DatagolfResponse} DatagolfResponse*/
/** @typedef {import('./d.ts').ThreeballResponse} ThreeballResponse */

config();

/**
 *
 * @param {*} list
 * @returns {Promise<DatagolfResponse>}
 */
export const outrightOdds = async (list) => {
  const baseUrl = "https://feeds.datagolf.com/betting-tools/outrights?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString =
    baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
  return fetch(queryString).then((res) => {
    return res.json();
  });
};

/**
 *
 * @param {*} list
 * @returns {Promise<ThreeballResponse>}
 */
export const matchup3ballOdds = async (list) => {
  const baseUrl = "https://feeds.datagolf.com/betting-tools/matchups?";
  const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
  const queryString =
    baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
  return fetch(queryString).then((res) => {
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
