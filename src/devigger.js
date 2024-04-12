import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";

const baseUrl =
  "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";

//devig all objects inside array.odds
async function devig(response, evarray) {
  for (let golfer of response.odds) {
    //add event name to each obj
    golfer.event_name = response.event_name;
    golfer.market = response.market;
    //calls devig for golfer if odds exist for DG AND FD
    if (
      golfer.fanduel !== null &&
      golfer.datagolf.baseline_history_fit != null
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
          golfer.devig = data;
          golfer.event_name = response.event_name;
          golfer.market = response.market;
          //assess EV, if above threshold, push to evarray
          // TODO: Add edge case for pings that become higher EV
          if (obj.devig.Final.EV_Percentage > 0.1 && obj.pinged !== true) {
            evarray.push(obj);
            golfer.pinged = true;
            console.log("EV: " + obj.devig.Final.EV_Percentage);
            console.log("finalodds for fd: " + obj.fanduel);
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
export { devig };
