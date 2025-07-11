import express from "express";
import { registerOfficial } from "../controllers/official.controller.js";
import { verifyInviteToken } from "../middlewares/auth/isValidInvite.js";
import { loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth/user.auth.js";

const router = express.Router();

router.post("/register/:token", verifyInviteToken, registerOfficial);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
