//@ts-check
import { devig, devigKFT, devig3ball, devigMU } from "./devigger.js";
import { outrightOdds, tBallOdds, muOdds } from "./datagolf.js";
import { config } from "dotenv";

config();

//Array that stores all the outrights above EV threshold for all markets

//devig, push plays above ev threshold to winev array
//output array to discord
//add check statement to only devig if anything changed
async function findEV(tour, market, evthreshold) {
  let evarray = [];
  let list = ["tour", tour, "market", market];
  let dgresponse = await outrightOdds(list);
  if (tour === "kft") {
    await devigKFT(dgresponse, evarray, evthreshold);
  } else await devig(dgresponse, evarray, evthreshold);
  return evarray;
}

async function tBallEV(tour, evthreshold) {
  let evarray = [];
  let list = ["tour", tour, "market", "3_balls"];
  let dgresponse = await tBallOdds(list);
  await devig3ball(dgresponse, evarray, evthreshold);
  return evarray;
}

async function muEV(tour, market, evthreshold) {
  let evarray = [];
  let list = ["tour", tour, "market", market];
  let dgresponse = await muOdds(list);
  await devigMU(dgresponse, evarray, evthreshold);
  return evarray;
}
export { findEV, tBallEV, muEV };
