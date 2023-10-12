import { describe, expect } from "@jest/globals";
import { subtract, sum, multiply, divide } from "../../src/core/calc";

describe("Core logic", () => {
  it("should add numbers", async () => {
    expect(sum([3, 4, 5])).toEqual(12);
    expect(sum([3, 4])).toEqual(7);
    expect(sum([3, -5])).toEqual(-2);
  }, 3000);

  it("should find the difference between numbers", async () => {
    expect(subtract(10, [3, 4, 5])).toEqual(-2);
    expect(subtract(100, [3, 4])).toEqual(93);
    expect(subtract(0, [3, -5])).toEqual(2);
  }, 3000);

  it("should multiply numbers", async () => {
    expect(multiply([10, 0, 4, 5])).toEqual(0);
    expect(multiply([100, 5, 2])).toEqual(1000);
  }, 3000);

  it("should divide numbers", async () => {
    expect(divide(10, [0, 4, 5])).toEqual("E");
    expect(divide(100, [5, 2])).toEqual(10);
  }, 3000);
});
