import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";

const baseUrl =
  "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";

//devig all objects inside array.odds
async function devig(response, evarray) {
  for (let obj of response.odds) {
    //calls devig for golfer if odds exist for DG AND FD
    if (obj.fanduel !== null && obj.datagolf.baseline_history_fit != null) {
      let list = [
        "LegOdds",
        obj.datagolf.baseline_history_fit,
        "FinalOdds",
        obj.fanduel,
      ];
      let queryString =
        baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
      await fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          obj.devig = data;
          obj.event_name = response.event_name;
          obj.market = response.market;
          //assess EV, if above threshold, push to evarray
          // TODO: Add edge case for pings that become higher EV
          if (obj.devig.Final.EV_Percentage > 0.1 && obj.pinged !== true) {
            evarray.push(obj);
            obj.pinged = true;
            console.log("EV: " + obj.devig.Final.EV_Percentage);
            console.log("finalodds for fd: " + obj.fanduel);
          }
          //if fair value odds is positive, add "+" to value
          if (obj.devig.Final.FairValue_Odds > 0) {
            obj.devig.Final.FairValue_Odds =
              "+" + obj.devig.Final.FairValue_Odds;
          }
        });
    }
  }
}
export { devig };
