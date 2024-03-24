import { win } from "./examplewin.js";
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
const pgaEv = () => {
  let baseUrl =
    "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
  let endUrl = `DevigMethod=4&Args=ev_p,fo_o,kelly,dm`;
  //push key:value pairs to array
  //eventually will need to check if key : value pair exists
  for (let key in win) {
    if (Array.isArray(win[key])) {
      let arr = [];
      for (let i = 0; i < win[key].length; i++) {
        arr.push(win[key][i]);
      }
      pgawin.push({ [key]: arr });
    } else pgawin.push({ [key]: win[key] });
  }
  console.log(pgawin);
  //devig all objects inside pgawin.odds
  //compare()? pgawin(oldarray) to new data - devigS
  for (let obj of pgawin[5].odds) {
    //calls devig for golfer if odds exist for DG AND FD
    if (obj.fanduel != null && obj.datagolf.baseline_history_fit != null) {
      let list = [
        "LegOdds",
        obj.datagolf.baseline_history_fit,
        "FinalOdds",
        obj.fanduel,
      ];
      let queryString = baseUrl + generate(builder(...list)) + endUrl;
      return fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }
};
export { pgaEv };

//refactor json response local array?  json clone?
//pgawin[5].odds is AIDS
