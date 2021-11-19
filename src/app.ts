import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";

import AppRoutes from "./routes";

const app: Express = express();

app.use(cors())
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(express.json());
AppRoutes.initializeRoutes(app);
export default app;
