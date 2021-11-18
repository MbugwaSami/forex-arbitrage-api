import { Express } from "express";

//local imports
import ArbitageRoute from "./arbitage";

class Routes {
  static initializeRoutes(app: Express): void {
    const apiPrefix = "/api";
    app.use(apiPrefix, ArbitageRoute);
  }
}

export default Routes;
