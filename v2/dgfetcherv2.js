//@ts-check

import { devig } from "./deviggerv2.js";
import { outrightOdds } from "./datagolfv2.js";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilderv2.js";
import { config } from "dotenv";

config();

//Array that stores all the outrights above EV threshold for all markets
let evarray = [];

//devig, push plays above ev threshold to winev array
//output array to discord
//add check statement to only devig if anything changed
async function findEV(tour, market) {
  if (tour.toLowerCase() === "pga") {
    if (market.toLowerCase() === "win") {
      let list = ["tour", tour, "market", market];
      let dgresponse = await outrightOdds(list);
      await devig(dgresponse, evarray);
      if (evarray.length > 0) return evarray;
      else return "NO EV";
    }
    if (market.toLowerCase() === "top5") {
      let list = ["tour", tour, "market", market];
    }
    if (market.toLowerCase() === "top10") {
    }
    if (market.toLowerCase() === "top20") {
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
  //pass arrays to devig function
}

export { findEV };

//refactor json response local array?  json clone?
