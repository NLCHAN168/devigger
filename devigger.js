import { generate, builder } from "./querybuilder.js";

const printer = (Final) => {
  console.log("Final Odds: " + Final.Odds);
  console.log("Fair Value: " + Final.FairValue);
  console.log("EV Percentage: " + Final.EV_Percentage * 100);
  console.log("Full Kelly: " + Final.Kelly_Full);
  console.log("Half Kelly: " + Final.Kelly_Full / 2);
  console.log("Quarter Kelly: " + Final.Kelly_Full / 4);
  console.log("Eighth Kelly: " + Final.Kelly_Full / 8);
};

/**
 * --------------------------------------------------------
 * THIS IS AN EXAMPLE OF HOW TO USE AN ARRAY TO BUILD THE QUERIES
 */
let list = [];
export const exampleFunction = async (list) => {
  const baseUrl =
    "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
  const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";
  let queryString = baseUrl + generate(builder(...list)) + endUrl;
  await fetch(queryString)
    .then((res) => res.json())
    .then((data) => printer(data.Final));
};
// --------------------------------------------------------

//WORST-CASE DEVIG
async function devig(marketName, legOdds, finalOdds, devigBook) {
  let newOdds = useRegex(legOdds);
  const response = await fetch(
    `http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&LegOdds=${newOdds}&FinalOdds=${finalOdds}&DevigMethod=4&Args=ev_p,fo_o,kelly,dm`
  );
  const data = await response.json();
  console.log(marketName + "\n");
  printer(data.Final);
  console.log("\n" + devigBook);
}

function useRegex(input) {
  let regex = input;
  regex = regex.replace(/\s/g, "");
  regex = regex.replace(/\-/g, "%2D");
  regex = regex.replace(/\//g, "%2F");
  regex = regex.replace(/\+/g, "%2B");
  regex = regex.replace(/\,/g, "%2C");
  return regex;
}
