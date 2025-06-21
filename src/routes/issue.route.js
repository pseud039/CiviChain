import { Router } from "express";
import { Issues } from "../controllers/issue.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/issues").post(upload.fields([{
    name:"IssueImg",
    maxCount:1
}]),
Issues)


export default router;