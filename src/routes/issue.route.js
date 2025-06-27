import { issues, getAllIssues, getSortedIssues } from "../controllers/issue.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import express from "express";

const router = express.Router();
const POST_FIELD= { name: "issueImg", maxCount:1};

router.post("/",upload.fields([POST_FIELD]),issues);
router.get("/",getAllIssues);
router.get("/find",getSortedIssues);

export default router;
