import { InferSchemaType, Schema, model } from "mongoose";

const historySchema = new Schema(
  {
    param1: { type: Number, require: true },
    param2: { type: Number, require: true },
    operator: { type: String, require: true },
    answer: { type: Number, require: true },
  },
  { timestamps: true }
);

type Calc = InferSchemaType<typeof historySchema>;

export default model<Calc>("Calc", historySchema);
