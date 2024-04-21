//@ts-check
import { devig, devigKFT, devig3ball } from "./devigger.js";
import { outrightOdds, tBallOdds } from "./datagolf.js";
import { config } from "dotenv";

config();

//Array that stores all the outrights above EV threshold for all markets

//devig, push plays above ev threshold to winev array
//output array to discord
//add check statement to only devig if anything changed
async function findEV(tour, market) {
  let evarray = [];
  let list = ["tour", tour, "market", market];
  let dgresponse = await outrightOdds(list);
  if (tour === "kft") {
    await devigKFT(dgresponse, evarray);
  } else await devig(dgresponse, evarray);
  return evarray;
}

async function tBallEV(tour) {
  let evarray = [];
  let list = ["tour", tour, "market", "3_balls"];
  let dgresponse = await tBallOdds(list);
  await devig3ball(dgresponse, evarray);
  return evarray;
}
export { findEV, tBallEV };
