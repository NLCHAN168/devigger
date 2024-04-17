import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";

const baseUrl =
  "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";

//devig all objects inside array.odds
async function devig(response, evarray) {
  //calls devig for golfer if odds exist for FD
  for (let golfer of response.odds) {
    golfer.event_name = response.event_name;
    golfer.market = response.market;
    if (
      golfer.hasOwnProperty("fanduel") &&
      golfer.datagolf.baseline_history_fit !== null
    ) {
      let list = [
        "LegOdds",
        golfer.datagolf.baseline_history_fit,
        "FinalOdds",
        golfer.fanduel,
      ];
      let queryString =
        baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
      await fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          golfer.devig = data;
          golfer.event_name = response.event_name;
          golfer.market = response.market;
          //assess EV, if above threshold, push to evarray
          // TODO: Add edge case for pings that become higher EV
          if (
            golfer.devig.Final.EV_Percentage > 0.1 &&
            golfer.pinged !== true
          ) {
            evarray.push(golfer);
            golfer.pinged = true;
            console.log("EV: " + golfer.devig.Final.EV_Percentage);
            console.log("finalodds for fd: " + golfer.fanduel);
          }
          //if fair value odds is positive, add "+" to value
          if (golfer.devig.Final.FairValue_Odds > 0) {
            golfer.devig.Final.FairValue_Odds =
              "+" + golfer.devig.Final.FairValue_Odds;
          }
        });
    }
  }
}

async function devigKFT(response, evarray) {
  for (let golfer of response.odds) {
    golfer.event_name = response.event_name;
    golfer.market = response.market;
    if (golfer.datagolf.baseline !== null && golfer.hasOwnProperty("fanduel")) {
      //add event name to each golfer ob
      let list = [
        "LegOdds",
        golfer.datagolf.baseline,
        "FinalOdds",
        golfer.fanduel,
      ];
      let queryString =
        baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
      await fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          golfer.devig = data;
          golfer.event_name = response.event_name;
          golfer.market = response.market;
          if (
            golfer.devig.Final.EV_Percentage > 0.1 &&
            golfer.pinged !== true
          ) {
            evarray.push(golfer);
            golfer.pinged = true;
            console.log("EV: " + golfer.devig.Final.EV_Percentage);
            console.log("finalodds for fd: " + golfer.fanduel);
          }
          //if fair value odds is positive, add "+" to value
          if (golfer.devig.Final.FairValue_Odds > 0) {
            golfer.devig.Final.FairValue_Odds =
              "+" + golfer.devig.Final.FairValue_Odds;
          }
        });
    }
    if (
      golfer.datagolf.baseline !== null &&
      !golfer.hasOwnProperty("fanduel") &&
      golfer.hasOwnProperty("draftkings")
    ) {
      let list = [
        "LegOdds",
        golfer.datagolf.baseline,
        "FinalOdds",
        golfer.draftkings,
      ];
      let queryString =
        baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
      await fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          golfer.devig = data;
          golfer.event_name = response.event_name;
          golfer.market = response.market;
          if (
            golfer.devig.Final.EV_Percentage > 0.1 &&
            golfer.pinged !== true
          ) {
            evarray.push(golfer);
            golfer.pinged = true;
            console.log("EV: " + golfer.devig.Final.EV_Percentage);
            console.log("finalodds for dk: " + golfer.draftkings);
          }
          //if fair value odds is positive, add "+" to value
          if (golfer.devig.Final.FairValue_Odds > 0) {
            golfer.devig.Final.FairValue_Odds =
              "+" + golfer.devig.Final.FairValue_Odds;
          }
        });
    }
  }
}

export { devig, devigKFT };
