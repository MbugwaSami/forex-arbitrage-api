import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cron from "node-cron";

import Database from "./database";

import AppRoutes from "./routes";

const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
Database.addData();
cron.schedule("*/5 * * * *", () => {
  Database.addData();
});
app.use(express.json());
AppRoutes.initializeRoutes(app);
export default app;
