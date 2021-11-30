import { Response, Request } from "express";

//local imports
import ArbitageHelper from "../helpers/arbitrageHelper";

class ArbitageController {
  static async getArbitages(req: Request, res: Response) {
    try {
      const { base } = req.query;
      if (!base) {
        return res.status(400).send({
          message: "Please provide base currency",
        });
      }
      const baseCurrency = base.toString().toUpperCase();
      const arbitrage = ArbitageHelper.getMaxPath(baseCurrency);
      return res.status(200).send({
        ...arbitrage,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        message: error.message,
      });
    }
  }
}

export default ArbitageController;
