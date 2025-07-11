import express from "express";
import { createInvite } from "../controllers/invite.controller.js";

const router = express.Router();

router.post("/createInvite", createInvite);

export default router;
