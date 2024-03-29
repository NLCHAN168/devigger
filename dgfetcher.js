import { win } from "./examplewin.js";
import { top5 } from "./exampletop5.js";
import { top10 } from "./exampletop10.js";
import { top20 } from "./exampletop20.js";
import { generate, builder } from "./querybuilder.js";
import { config } from "dotenv";

config();

//one array of golfers with IDs corresponding to each of the odds
let pgawin = [];
let pgatop5 = [];
let pgatop10 = [];
let pgatop20 = [];
let winev = [];
let top5ev = [];
let top10ev = [];
let top20ev = [];

//push key:value pairs into pgawin array
//devig, push plays above ev threshold to winev array
//output array to discord
const pgaEv = (market, golfarray, evarray) => {
  let baseUrl =
    "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
  let endUrl = `DevigMethod=4&Args=ev_p,fo_o,kelly,dm`;
  //push key:value pairs to array
  //eventually will need to check if key : value pair exists
  if (market === "win") {
    for (let key in win) {
      if (Array.isArray(win[key])) {
        let arr = [];
        for (let i = 0; i < win[key].length; i++) {
          arr.push(win[key][i]);
        }
        golfarray.push({ [key]: arr });
      } else golfarray.push({ [key]: win[key] });
    }
  }

  if (market === "top5") {
    for (let key in top5) {
      if (Array.isArray(top5[key])) {
        let arr = [];
        for (let i = 0; i < top5[key].length; i++) {
          arr.push(top5[key][i]);
        }
        golfarray.push({ [key]: arr });
      } else golfarray.push({ [key]: top5[key] });
    }
  }

  if (market === "top10") {
    for (let key in top10) {
      if (Array.isArray(top10[key])) {
        let arr = [];
        for (let i = 0; i < top10[key].length; i++) {
          arr.push(top10[key][i]);
        }
        golfarray.push({ [key]: arr });
      } else golfarray.push({ [key]: top10[key] });
    }
  }

  if (market === "top20") {
    for (let key in top20) {
      if (Array.isArray(top20[key])) {
        let arr = [];
        for (let i = 0; i < top20[key].length; i++) {
          arr.push(top20[key][i]);
        }
        golfarray.push({ [key]: arr });
      } else golfarray.push({ [key]: top20[key] });
    }
  }
  // console.log(pgawin);
  //devig all objects inside pgawin.odds
  //compare()? pgawin(oldarray) to new data - devigS
  for (let obj of golfarray[5].odds) {
    //calls devig for golfer if odds exist for DG AND FD
    if (obj.fanduel != null && obj.datagolf.baseline_history_fit != null) {
      let list = [
        "LegOdds",
        obj.datagolf.baseline_history_fit,
        "FinalOdds",
        obj.fanduel,
      ];
      let queryString = baseUrl + generate(builder(...list)) + endUrl;
      fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          obj.devig = data;
          //assess EV, if above threshold, push to evarray
          if (obj.devig.Final.EV_Percentage > 0.1 && obj.pinged != true) {
            evarray.push(obj);
            obj.pinged = true;
            console.log(evarray);
          }
        });
    }
  }
};
export { pgaEv };

//refactor json response local array?  json clone?
//pgawin[5].odds is AIDS

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
