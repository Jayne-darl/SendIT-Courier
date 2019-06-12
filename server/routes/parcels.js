import express from "express";
import parcelController from "../controllers/parcelController";
// import mapController from "../controllers/mapController";

import Auth from "../middleware/auth";
import Validator from "../middleware/validator"

let router = express.Router();
router.use(express.json());

router.post("/", Auth.verifyToken, parcelController.create);
router.get("/all", Auth.verifyToken, parcelController.getAll);
router.get("/:id", Auth.verifyToken, parcelController.getOne);
router.patch("/:id/cancel", Auth.verifyToken, parcelController.cancel);
router.patch("/:id/update", Auth.verifyToken, parcelController.update);
router.patch("/:id/destination", Auth.verifyToken, parcelController.changeDestination)
// router.get("/:id/direction", Auth.verifyToken, mapController.getDirection);
// router.get("/:id/distance", Auth.verifyToken, mapController.getDistance);

export default router;
