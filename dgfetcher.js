//@ts-check

import { devig } from "./devigger.js";
import { win } from "./examplewin.js";
import { top5 } from "./exampletop5.js";
import { top10 } from "./exampletop10.js";
import { top20 } from "./exampletop20.js";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";
import { config } from "dotenv";

config();

//one array of golfers with IDs corresponding to each of the odds
/** @typedef {import('./d.ts').DatagolfResponse} DatagolfResponse
/** @type {DatagolfResponse} */
//one array for all golf tournaments, organized by outright placement
let pgawin = {};
let pgatop5 = {};
let pgatop10 = {};
let pgatop20 = {};
let winev = [];
let top5ev = [];
let top10ev = [];
let top20ev = [];

//push key:value pairs into pgawin array
//devig, push plays above ev threshold to winev array
//output array to discord
//FIXME: function keeps pushing same golfers to evarray after each slash command call
//add check statement to only devig if anything changed
//FIXME: Seperate pgaEv into different functions
async function pgaEv(tour, market) {
  let golfarray = pgawin;
  let evarray = winev;
  if (tour.toLowerCase() === "pga") {
    if (market.toLowerCase() === "win") {
      golfarray = pgawin;
      evarray = winev;
    }
    if (market.toLowerCase() === "top5") {
      golfarray = pgatop5;
      evarray = top5ev;
    }
    if (market.toLowerCase() === "top10") {
      golfarray = pgatop10;
      evarray = top10ev;
    }
    if (market.toLowerCase() === "top20") {
      golfarray = pgatop20;
      evarray = top20ev;
    }
  }
  if (tour.toLowerCase() === "euro") {
    if (market.toLowerCase() === "win") {
    }
    if (market.toLowerCase() === "top5") {
    }
    if (market.toLowerCase() === "top10") {
    }
    if (market.toLowerCase() === "top20") {
    }
  }
  if (tour.toLowerCase() === "kft") {
    if (market.toLowerCase() === "win") {
    }
    if (market.toLowerCase() === "top5") {
    }
    if (market.toLowerCase() === "top10") {
    }
    if (market.toLowerCase() === "top20") {
    }
  }

  //push key:value pairs to array
  //eventually will need to check if key : value pair exists
  if (market === "win") {
    for (let key in win) {
      if (Array.isArray(win[key])) {
        golfarray[`${key}`] = [];
        for (let i = 0; i < win[key].length; i++) {
          golfarray[`${key}`][i] = win[key][i];
        }
      } else golfarray[`${key}`] = win[key];
    }
  }

  if (market === "top5") {
    for (let key in top5) {
      if (Array.isArray(top5[key])) {
        golfarray[`${key}`] = [];
        for (let i = 0; i < top5[key].length; i++) {
          golfarray[`${key}`][i] = top5[key][i];
        }
      } else golfarray[`${key}`] = top5[key];
    }
  }

  if (market === "top10") {
    for (let key in top10) {
      if (Array.isArray(top10[key])) {
        golfarray[`${key}`] = [];
        for (let i = 0; i < top10[key].length; i++) {
          golfarray[`${key}`][i] = top10[key][i];
        }
      } else golfarray[`${key}`] = top10[key];
    }
  }

  if (market === "top20") {
    for (let key in top20) {
      if (Array.isArray(top20[key])) {
        golfarray[`${key}`] = [];
        for (let i = 0; i < top20[key].length; i++) {
          golfarray[`${key}`][i] = top20[key][i];
        }
      } else golfarray[`${key}`] = top20[key];
    }
  }
  //pass arrays to devig function
  await devig(golfarray, evarray);
}

export { pgaEv };

//refactor json response local array?  json clone?

export {
  win,
  top5,
  top10,
  top20,
  pgawin,
  pgatop5,
  pgatop10,
  pgatop20,
  winev,
  top5ev,
  top10ev,
  top20ev,
};
