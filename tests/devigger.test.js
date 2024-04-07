import t5json from "../data/exampletop5.json" assert { type: "json" };
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

describe("Devigs odds from datagolf json response", () => {
  it("returns a object with attribute obj.devig that holds a Final object if passed a json response", async () => {
    expect(await devig(t5json, top5ev)).toStrictEqual(devigt5);
  }, 1000000);
});
