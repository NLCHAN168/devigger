import { describe, it, expect } from "vitest";
import { arrayToObjectBuilder, generateDeviggerUrl } from "../querybuilder.js";

describe("array of key values to objects", () => {
  it("returns an empty object", () => {
    expect(arrayToObjectBuilder([])).toEqual({});
  });
  it("returns an object with 1 key value pair", () => {
    let exampleArray = ["henry", "ford"];
    expect(arrayToObjectBuilder(...exampleArray)).toEqual({ henry: "ford" });
  });
  it("returns an empty object with 2 key value pair", () => {
    let exampleArray = ["henry", "ford", "michael", "jackson"];
    expect(arrayToObjectBuilder(...exampleArray)).toEqual({
      henry: "ford",
      michael: "jackson",
    });
  });
  it("should skip the final key if there is no associated value", () => {
    let exampleArray = ["henry", "ford", "michael", "jackson", "frank"];
    expect(arrayToObjectBuilder(...exampleArray)).toEqual({
      henry: "ford",
      michael: "jackson",
    });
  });
});

//TODO: Add failure cases and come up with error handling
describe("url generator", () => {
  it("generates the correct query parameters for a url", () => {
    let queryParamsArray = ["Legodds", "-110/-110", "FinalOdds", "110"];
    let queryParams = generateDeviggerUrl(
      arrayToObjectBuilder(...queryParamsArray)
    );
    console.log(queryParams);
    expect(queryParams).toBe("Legodds=-110/-110&FinalOdds=110&");
  });
});
