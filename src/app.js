import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// const express = require("express");

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit:"2mb" }));
app.use(express.urlencoded({ extended: true, limit:"1mb"}));
app.use(express.static("public"));
app.use(cookieParser())

export  { app }
