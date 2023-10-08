import { InferSchemaType, Schema, model } from "mongoose";

const calcSchema = new Schema(
  {
    param1: { type: Number, require: true },
    param2: { type: Number, require: true },
    operator: { type: String, require: true },
    answer: { type: String, require: true },
  },
  { timestamps: true }
);

type Calc = InferSchemaType<typeof calcSchema>;

export default model<Calc>("Calc", calcSchema);
