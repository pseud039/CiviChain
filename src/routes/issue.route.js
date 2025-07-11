import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { issues, getAllIssues, getSortedIssues } from "../controllers/issue.controller.js";

const router = express.Router();
const POST_FIELD= { name: "issueImg", maxCount:1};

router.post("/",upload.fields([POST_FIELD]),issues);
router.get("/",getAllIssues);
router.get("/sort",getSortedIssues);

export default router;
