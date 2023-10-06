import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(env.PORT, () => {
      console.log("Server running on port %d", env.PORT);
    });
  })
  .catch(console.error);
