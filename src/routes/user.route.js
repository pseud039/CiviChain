import express from "express";
import { verifyJWT } from "../middlewares/auth/user.auth.js";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { getAllIssues } from "../controllers/issue.controller.js";

const router = express.Router();

router.post("/register",(registerUser));
router.post("/login",(loginUser));
router.post("/logout",(logoutUser),verifyJWT);
router.get("/Allissues",getAllIssues);

export default router;
