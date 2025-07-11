import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//Routes
import userRouter from "./routes/user.route.js";
import issueRouter from "./routes/issue.route.js";
import inviteRouter from "./routes/invite.route.js";
import officialRouter from "./routes/official.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/citizens", userRouter);
app.use("/issues", issueRouter);
app.use("/officials",officialRouter);
app.use("/admins",inviteRouter);

export { app };
