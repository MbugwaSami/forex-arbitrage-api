import { Express } from "express";

//local imports
import ArbitageRoute from "./arbitage";
import CurrencyRoute from "./currency";

class Routes {
  static initializeRoutes(app: Express): void {
    const apiPrefix = "/api";
    app.use(apiPrefix, ArbitageRoute);
    app.use(apiPrefix, CurrencyRoute);
  }
}

export default Routes;
