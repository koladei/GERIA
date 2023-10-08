import { Request, RequestHandler, Response } from "express";
import CalcModel from "../models/calc";
import { divide, multiply, subtract, sum } from "../core/calc";

export const getHistory: RequestHandler = async (req, res, next) => {
  try {
    const history = await CalcModel.find().exec();
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

interface IOperationParameters {
  param1: number;
  param2: number;
  [paramX: string]: number;
}
export const runCalc: RequestHandler<{ operator: string }, unknown, IOperationParameters, unknown> = async (req, res, next) => {
  try {
    // run the calculation
    const operator = req.params.operator;
    const { param1, param2, ...paramX } = req.body;
    let answer: string | number = 0;

    switch (operator) {
      case "sum":
      case "add": {
        answer = sum([param1, param2, ...Object.values(paramX)]);
        break;
      }
      case "subtract":
      case "sub": {
        answer = subtract(param1, [param2, ...Object.values(paramX)]);
        break;
      }
      case "multiply":
      case "mul": {
        answer = multiply([param1, param2, ...Object.values(paramX)]);
        break;
      }
      case "divide":
      case "div": {
        answer = divide(param1, [param2, ...Object.values(paramX)]);
        break;
      }
      default: {
        throw Error("Operation not supported");
      }
    }

    // save the result to the database
    const calc = await CalcModel.create({
      param1,
      param2,
      operator,
      answer,
    });

    // return the result and history to the client
    const history = await CalcModel.find().sort("-createdAt").limit(10).exec();
    res.status(201).json({
      calculation: calc,
      history,
    });
  } catch (error) {
    next(error);
  }
};
