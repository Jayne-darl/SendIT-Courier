import express from "express";
import userController from "../controllers/userController";

let router = express.Router();
router.use(express.json());

router.post("/create", userController.create);
router.post("/login", userController.login);

export default router;
