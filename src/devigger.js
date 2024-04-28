// import { TextBasedChannelMixin } from "discord.js";
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

/**
 *
 * @param {import("./datagolf.js").ThreeballResponse} response
 * @param {*} evarray
 */
//FIXME: Finish function
async function devig3ball(response, evarray) {
  console.log(response);
  if (Array.isArray(response.match_list)) {
    let eventName = response.event_name;
    let market = response.market;
    let roundNum = response.round_num;
    let p1Name = response.match_list.p1_player_name;
    let p2Name = response.match_list.p2_player_name;
    let p3Name = response.match_list.p3_player_name;
    for (let i = 0; i < response.match_list.length; i++) {
      if (
        response.match_list[0].odds.hasOwnProperty("fanduel") &&
        response.match_list[0].odds.hasOwnProperty("datagolf")
      ) {
        console.log(response.match_list[i].odds);
        let dgp1 = datagolf.p1;
        let dgp2 = datagolf.p2;
        let dgp3 = datagolf.p3;
        let tBall = match_list[i];
        //if FD and DG properties exist, devig and build custom object to add to evarray
        let list = ["LegOdds", dgp1, "FinalOdds", match_list[i].fanduel.p1];
        let queryString =
          baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
        await fetch(queryString)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            tBall.p1_devig = data;
            if (tBall.p1_devig.Final.EV_Percentage > 0.1) {
              tBall.player_name = p1Name;
              tBall.event_name = eventName;
              tBall.market = market;
              tBall.round_num = roundNum;
              tBall.final_odds = match_list[i].fanduel.p1;
              tBall.fair_value_odds = match_list[i].datagolf.p1;
              evarray.push(tBall);
            }
          })
          .then(async () => {
            let list = ["LegOdds", dgp2, "FinalOdds", match_list[i].fanduel.p2];
            let queryString =
              baseUrl +
              generateDeviggerUrl(arrayToObjectBuilder(...list) + endUrl);
            return fetch(queryString)
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                tBall.p2_devig = data;
                if (tBall.p2.devig.Final.EV_Percentage > 0.1) {
                  tBall.player_name = p2Name;
                  tBall.event_name = eventName;
                  tBall.market = market;
                  tBall.round_num = roundNum;
                  tBall.final_odds = match_list[i].fanduel.p2;
                  tBall.fair_value_odds = match_list[i].datagolf.p2;
                  evarray.push(tBall);
                }
              });
          })
          .then(async () => {
            let list = ["LegOdds", dgp3, "FinalOdds", match_list[i].fanduel.p3];
            let queryString =
              baseUrl +
              generateDeviggerUrl(arrayToObjectBuilder(...list)) +
              endUrl;
            return fetch(queryString)
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                tBall.p3_devig = data;
                if (tBall.p3.devig.Final.EV_Percentage > 0.1) {
                  tBall.player_name = p3Name;
                  tBall.event_name = eventName;
                  tBall.market = market;
                  tBall.round_num = roundNum;
                  tBall.final_odds = match_list[i].fanduel.p3;
                  tBall.fair_value_odds = match_list[i].datagolf.p3;
                  evarray.push(tBall);
                }
              });
          });
      }
    }
  }
}

export { devig, devigKFT, devig3ball };
