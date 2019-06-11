import express from "express";
import userController from "../controllers/userController";
import Auth from "../middleware/auth";
import Validator from "../middleware/validator"

let router = express.Router();
router.use(express.json());

router.post("/create", userController.create);
router.post("/login", userController.login);
router.post("/mail", Validator.mail, Auth.verifyToken, userController.mail);

export default router;
