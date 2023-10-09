import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../src/server";
import Calc from "../../src/models/Calc";

beforeEach(async () => {
  await Calc.deleteMany();
  await Calc.create(
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    },
    {
      param1: 1,
      param2: 2,
      answer: 3,
    }
  );
});

afterAll(async () => {
  await Calc.deleteMany();
});

describe("API routes", () => {
  test("~/api/calc/<invalid-route> should return 'not found' for invalid routes", async () => {
    request(app).get("/api/cada").expect(404, {
      error: "Not Found",
    });
  });

  it("~/api/calc/history should return all calculations history items.", async () => {
    const items = await Calc.find();
    request(app).get("/api/calc/history").expect(200, items);
  });

  it("~/api/calc/history/clear should clear calculation history", async () => {
    request(app).get("/api/calc/history/clear").expect(200);

    request(app).get("/api/calc/history").expect(200, []);
  });

  it("~/api/calc/run/add return the correct sum and save the history", async () => {
    const operation = {
      param1: 8,
      param2: 7
    };
    const res = await request(app).post("/api/calc/run/add").send(operation);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThanOrEqual(299);

    const { answer }: { answer: number } = res.body.calculation;
    expect(answer).toEqual("15");

    expect((await Calc.find()).length).toEqual(11);
  });

  it("~/api/calc/run/sub return the correct difference and save the history", async () => {
    const operation = {
      param1: 8,
      param2: 18,
    };
    const res = await request(app).post("/api/calc/run/sub").send(operation);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThanOrEqual(299);

    const { answer }: { answer: number } = res.body.calculation;
    expect(answer).toEqual("-10");

    expect((await Calc.find()).length).toEqual(11);
  });

  it("~/api/calc/run/mul return the correct multiplication and save the history", async () => {
    const operation = {
      param1: 8,
      param2: 100,
    };
    const res = await request(app).post("/api/calc/run/mul").send(operation);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThanOrEqual(299);

    const { answer }: { answer: number } = res.body.calculation;
    expect(answer).toEqual("800");

    expect((await Calc.find()).length).toEqual(11);
  });

  it("~/api/calc/run/div return the correct division and save the history", async () => {
    const operation = {
      param1: 10000,
      param2: 0,
    };
    const res = await request(app).post("/api/calc/run/div").send(operation);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThanOrEqual(299);

    const { answer }: { answer: number } = res.body.calculation;
    expect(answer).toEqual("E");

    expect((await Calc.find()).length).toEqual(11);

    const operation2 = {
      param1: 10000,
      param2: 100000,
    };
    const res2 = await request(app).post("/api/calc/run/div").send(operation2);

    expect(res2.status).toBeGreaterThanOrEqual(200);
    expect(res2.status).toBeLessThanOrEqual(299);

    const { answer: answer2 }: { answer: number } = res2.body.calculation;
    expect(answer2).toEqual("0.1");

    expect((await Calc.find()).length).toEqual(12);
  });
});
