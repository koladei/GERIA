import * as CalcController from "../../src/controllers/calc";
import Calc from "../../src/models/Calc";
import { connect, disconnect } from "../../__helper__/mongodb.memory.test.helper";

beforeAll(connect);

beforeEach(async () => {
  return Calc.deleteMany();
});

afterAll(disconnect);

describe("Calc controller", () => {
  it("should handle requests correctly", async () => {
    // Create mock request and response objects.
    const mockRequest: any = {
      params: {
        operator: "add",
      },
      body: {
        param1: 1,
        param2: 2,
      },
    };

    let responseObject = { body: { history: [], calculation: { answer: null } }, status: -1 };
    const mockResponse: any = {
      status: jest.fn().mockImplementation((status) => {
        responseObject = { ...responseObject, status };
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((body) => {
        responseObject = { ...responseObject, body };
        return mockResponse;
      }),
    };

    // Create a mock next function.
    const mockNext = jest.fn();

    await CalcController.runCalc(mockRequest, mockResponse, mockNext);
    const {
      body: {
        history,
        calculation: { answer },
      },
    } = responseObject;
    expect(history.length).toEqual(1);
    expect(answer).toEqual("3");
  });
});
