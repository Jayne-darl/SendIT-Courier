import express from "express";
import parcelController from "../controllers/parcelController";
import Auth from "../middleware/auth";

let router = express.Router();
router.use(express.json());

router.post("/", Auth.verifyToken, parcelController.create);
router.get("/", Auth.verifyToken, parcelController.getAll);
router.get("/:id", Auth.verifyToken, parcelController.getOne);
router.patch("/cancel/:id", Auth.verifyToken, parcelController.cancel);
router.patch("/:id", Auth.verifyToken, parcelController.update);

export default router;
