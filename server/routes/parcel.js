import express from "express";
import parcelController from "../controllers/parcelController";

let router = express.Router();
router.use(express.json());

router.post("/", parcelController.create);

export default router;
