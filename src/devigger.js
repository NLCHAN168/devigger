// import { TextBasedChannelMixin } from "discord.js";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";

const baseUrl =
  "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";

//devig all objects inside array.odds
async function devig(response, evarray, evthreshold) {
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
          golfer.lastUpdate = response.last_updated;
          //assess EV, if above threshold, push to evarray
          if (
            golfer.devig.Final.EV_Percentage > evthreshold &&
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

async function devigKFT(response, evarray, evthreshold) {
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
          golfer.lastUpdate = response.last_updated;
          golfer.market = response.market;
          if (
            golfer.devig.Final.EV_Percentage > evthreshold &&
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
          golfer.lastUpdate = response.last_updated;
          golfer.market = response.market;
          if (
            golfer.devig.Final.EV_Percentage > evthreshold &&
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

/**
 *
 * @param {import("./datagolf.js").ThreeballResponse} response
 * @param {*} evarray
 */
//FIXME: Finish function
//TODO: Test function using 3ball.json
async function devig3ball(response, evarray, evthreshold) {
  // console.log(response);
  if (Array.isArray(response.match_list)) {
    let eventName = response.event_name;
    let market = response.market;
    let roundNum = response.round_num;
    let lastUpdate = response.last_updated;
    let p1Name = response.match_list.p1_player_name;
    let p2Name = response.match_list.p2_player_name;
    let p3Name = response.match_list.p3_player_name;
    for (let i = 0; i < response.match_list.length; i++) {
      if (
        response.match_list[i].odds.hasOwnProperty("fanduel") &&
        response.match_list[i].odds.hasOwnProperty("datagolf")
      ) {
        let dgp1 = response.match_list[i].odds.datagolf.p1;
        let dgp2 = response.match_list[i].odds.datagolf.p2;
        let dgp3 = response.match_list[i].odds.datagolf.p3;
        // console.log(response.match_list[i].odds);
        let tBall = response.match_list[i];
        //if FD and DG properties exist, devig and build custom object to add to evarray
        let list1 = [
          "LegOdds",
          dgp1,
          "FinalOdds",
          response.match_list[i].odds.fanduel.p1,
        ];
        let queryString =
          baseUrl +
          generateDeviggerUrl(arrayToObjectBuilder(...list1)) +
          endUrl;
        await fetch(queryString)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            tBall.p1_devig = data;
            if (tBall.p1_devig.Final.EV_Percentage > evthreshold) {
              tBall.player_name = p1Name;
              tBall.event_name = eventName;
              tBall.market = market;
              tBall.lastUpdate = lastUpdate;
              tBall.round_num = roundNum;
              tBall.final_odds = match_list[i].fanduel.p1;
              tBall.fair_value_odds = match_list[i].datagolf.p1;
              tBall.devig = data;
              evarray.push(tBall);
            }
          })
          .then(async () => {
            let list2 = [
              "LegOdds",
              dgp2,
              "FinalOdds",
              response.match_list[i].odds.fanduel.p2,
            ];
            let queryString =
              baseUrl +
              generateDeviggerUrl(arrayToObjectBuilder(...list2)) +
              endUrl;
            return fetch(queryString)
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                tBall.p2_devig = data;
                if (tBall.p2_devig.Final.EV_Percentage > evthreshold) {
                  tBall.player_name = p2Name;
                  tBall.event_name = eventName;
                  tBall.lastUpdate = lastUpdate;
                  tBall.market = market;
                  tBall.round_num = roundNum;
                  tBall.final_odds = response.match_list[i].fanduel.p2;
                  tBall.fair_value_odds = response.match_list[i].datagolf.p2;
                  tBall.devig = data;
                  evarray.push(tBall);
                }
              });
          })
          .then(async () => {
            let list3 = [
              "LegOdds",
              dgp3,
              "FinalOdds",
              response.match_list[i].odds.fanduel.p3,
            ];

            let queryString =
              baseUrl +
              generateDeviggerUrl(arrayToObjectBuilder(...list3)) +
              endUrl;
            return fetch(queryString)
              .then((res) => res.json())
              .then((data) => {
                // console.log(data);
                tBall.p3_devig = data;
                if (tBall.p3_devig.Final.EV_Percentage > evthreshold) {
                  tBall.player_name = p3Name;
                  tBall.event_name = eventName;
                  tBall.date = lastUpdate;
                  tBall.market = market;
                  tBall.round_num = roundNum;
                  tBall.final_odds = response.match_list[i].fanduel.p3;
                  tBall.fair_value_odds = response.match_list[i].datagolf.p3;
                  tBall.devig = data;
                  evarray.push(tBall);
                }
              });
          });
      }
    }
  }
}

export { devig, devigKFT, devig3ball };
