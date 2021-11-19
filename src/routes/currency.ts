import express, { Router } from "express";
import CurrencyController from "../controllers/currencies";

class CurrencyRoutes {
  public currencyRouter: Router;

  constructor() {
    this.currencyRouter = express.Router();
    this.callRoutes();
  }

  private callRoutes() {
    this.currencyRouter.get("/currencies", CurrencyController.getCurrencies);
  }
}

export default new CurrencyRoutes().currencyRouter;
