import express from "express";
import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Mongoose connected");

    if (!process.env["VITE"]) {
      const frontendFiles = process.cwd() + "/dist";

      console.log("frontendFiles", frontendFiles);
      app.use(express.static(frontendFiles));
      app.get("/*", (_, res) => {
        res.send(frontendFiles + "/index.html");
      });
      app.listen(env.PORT, () => {
        console.log("Server running on port %d", env.PORT);
      });
    }
  })
  .catch(console.error);

export { app };
export default app;
