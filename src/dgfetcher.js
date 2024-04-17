//@ts-check

import { devig, devigKFT } from "./devigger.js";
import { outrightOdds } from "./datagolf.js";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";
import { config } from "dotenv";

config();

//Array that stores all the outrights above EV threshold for all markets

//devig, push plays above ev threshold to winev array
//output array to discord
//add check statement to only devig if anything changed
//FIXME: Test functionality for all tours (KFT broken)
async function findEV(tour, market) {
  let evarray = [];
  let list = ["tour", tour, "market", market];
  let dgresponse = await outrightOdds(list);
  if (tour === "kft") {
    await devigKFT(dgresponse, evarray);
  } else await devig(dgresponse, evarray);
  return evarray;
}
export { findEV };
