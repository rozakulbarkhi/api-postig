import express from "express";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.resolve();
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { userRouter } from "../routes/user-route.js";
import { postRouter } from "../routes/post-route.js";

export const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(cors());

app.use(userRouter);
app.use(postRouter);
app.use(errorMiddleware);
