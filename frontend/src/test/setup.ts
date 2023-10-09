import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { graphql, rest } from "msw";

const posts = [
  {
    param1: 1,
    param2: 2,
    operator: "add",
    answer: 3,
  },
  {
    param1: 4,
    param2: 5,
    operator: "add",
    answer: 9,
  },
  {
    param1: 10,
    param2: 11,
    operator: "add",
    answer: 21,
  },
];

export const restHandlers = [
  rest.get(`${process.env.HOST}:${process.env.PORT || "8080"}/api/calc/history`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts));
  }),

  rest.get(`${process.env.HOST}:${process.env.PORT || "8080"}/api/calc/history/clear`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts));
  }),
];

const graphqlHandlers = [
  graphql.query("https://graphql-endpoint.example/api/v1/posts", (req, res, ctx) => {
    return res(ctx.data(posts));
  }),
];

const server = setupServer(...restHandlers, ...graphqlHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
