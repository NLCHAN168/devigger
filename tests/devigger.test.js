import { describe, it, expect } from "vitest";
import topThreeData from "data/exampletop5.json";

//TODO: Actually hit the API
const baseUrl =
    "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";

const datagolfResponse = topThreeData;

describe('Devigger tester', () => {
    it('fetch returns valid JSON', () => {
        expect(datagolfResponse.books_offering[0]).toBe("bet365");
    });
});