import { InferSchemaType, Schema, model, models } from "mongoose";

const calcSchema = new Schema(
  {
    param1: { type: Number, require: true },
    param2: { type: Number, require: true },
    operator: { type: String, require: true },
    answer: { type: String, require: true },
  },
  { timestamps: true }
);

export default models["Calc"] || model("Calc", calcSchema);

type CalcType = InferSchemaType<typeof models["Calc"]["schema"]>;
