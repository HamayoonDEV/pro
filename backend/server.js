import express from "express";
import { PORT } from "./config/index.js";
import connectDb from "./database/index.js";
import router from "./routes/index.js";
import errorHandler from "./middleWare/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const corsOption = {
  credentials: true,
  origin: ["http://localhost:3000"],
};
const app = express();
app.use(cors(corsOption));
app.use(cookieParser());
connectDb();
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.listen(PORT, console.log(`server is runing on PORT:${PORT}`));
