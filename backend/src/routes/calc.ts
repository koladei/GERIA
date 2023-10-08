import express from "express";
import * as CalcController from "../controllers/calc";

const router = express.Router();
router.get("/history", CalcController.getHistory);
router.get("/history/clear", CalcController.clearHistory);
router.post("/run/:operator", CalcController.runCalc);

export default router;
