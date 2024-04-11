import t5json from "../data/exampletop5.json" assert { type: "json" };
import examplet5 from "../data/examplet5.json" assert { type: "json" };
import devigt5 from "../data/devigt5.json" assert { type: "json" };
import { top5ev } from "./dgfetcher.js";
import { describe, it, expect } from "vitest";
// import t5json from "data/exampletop5.json";
import { devig } from "./devigger.js";

//TODO: Actually hit the API
const baseUrl =
  "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";

const datagolfResponse = t5json;

describe("Devigger tester", () => {
  it("fetch returns valid JSON", () => {
    expect(datagolfResponse.books_offering[0]).toBe("bet365");
  });
});

await devig(examplet5, top5ev);
describe("Devigs odds from datagolf json response", () => {
  it("returns a object with attribute obj.devig that holds a Final object if passed a json response", async () => {
    expect(top5ev[0].devig).toStrictEqual({
      "Leg#1": { Odds: "-1102", MarketJuice: 0, FairValue: 0.916805324459235 },
      Final: {
        Odds: "+100",
        FairValue: 0.916805324459235,
        FairValue_Odds: -1102,
        EV_Percentage: 0.833610648918469,
        Kelly_Full: 83.3610648918469,
        DevigMethod: "wc:m",
      },
    });
  });
});
