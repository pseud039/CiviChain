import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/",(registerUser));
router.post("/login",(loginUser));
router.post("/logoutUser",(logoutUser),verifyJWT);

export default router;
