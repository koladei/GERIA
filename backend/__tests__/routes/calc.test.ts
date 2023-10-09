import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../src/server";
import Calc from "../../src/models/Calc";

beforeAll(async () => {
  await Calc.deleteMany();
});

afterAll(async () => {
  await Calc.deleteMany();
});

describe("Test API routes", () => {
  test("Catch-all route", async () => {
    const res = await request(app).get("/api/cada");
    expect(res.body).toEqual({
      error: "Not Found",
    });
  });

  it("Should return the history previous calculations", async () => {
    const record1 = await new Calc({
      param1: 1,
      param2: 2,
      answer: 3,
    }).save();

    const record2 = await new Calc({
      param1: 1,
      param2: 2,
      answer: 3,
    }).save();

    request(app).get("/api/calc/history").expect(200, [record1, record2]);

    request(app).get("/api/calc/history/clear").expect(200);

    request(app).get("/api/calc/history").expect(200, [record1, record2]);
  });
});
