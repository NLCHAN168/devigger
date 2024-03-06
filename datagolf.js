//WORST-CASE DEVIG
async function devig(marketName, legOdds, finalOdds, devigBook) {
  let newOdds = useRegex(legOdds);
  const response = await fetch(
    `http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&LegOdds=${newOdds}&FinalOdds=${finalOdds}&DevigMethod=4&Args=ev_p,fo_o,kelly,dm`
  );
  const data = await response.json();
  // console.log(data);
  console.log(marketName + "\n");
  console.log("Final Odds: " + data.Final.Odds);
  console.log("Fair Value: " + data.Final.FairValue);
  console.log("EV Percentage: " + data.Final.EV_Percentage * 100);
  console.log("Full Kelly: " + data.Final.Kelly_Full);
  console.log("Half Kelly: " + data.Final.Kelly_Full / 2);
  console.log("Quarter Kelly: " + data.Final.Kelly_Full / 4);
  console.log("Eighth Kelly: " + data.Final.Kelly_Full / 8);
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

devig("Draymond Green TD", "+3300", "+8500", "bet365");
