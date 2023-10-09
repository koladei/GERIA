import Calc from "../src/models/Calc";

beforeAll(async () => {
  await Calc.deleteMany();
});

afterAll(async () => {
  await Calc.deleteMany();
});
