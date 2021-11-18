import express, { Router } from "express";
import ArbitageController from "../controllers/arbitage";

class UserRoutes {
  public arbitageRouter: Router;

  constructor() {
    this.arbitageRouter = express.Router();
    this.callRoutes();
  }

  private callRoutes() {
    this.arbitageRouter.get("/arbitage", ArbitageController.getArbitages);
  }
}

export default new UserRoutes().arbitageRouter;
