import express, { Response, Request } from "express";

//local imports
import ArbitageHelper from "../helpers/arbitrageHelper";

class ArbitageController {
  static async getArbitages(req: Request, res: Response) {
    try {
      const { base } = req.query;
      if (!base) {
        return res.status(400).send({
          message: "please provide base currency",
        });
      }
      const maxPath = [base as string];
      const baseCurrency = base.toString().toUpperCase();
      const maxArbitage = 1;
      const currencyMapper = await ArbitageHelper.getCurrencyMap(baseCurrency);

      if (currencyMapper) {
        const arbitagePath = await ArbitageHelper.getMaxPath(
          baseCurrency,
          baseCurrency,
          maxArbitage,
          maxArbitage,
          maxPath,
          maxPath,
          currencyMapper
        );
        return res.status(200).send({
          arbitages: arbitagePath,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  }
}

export default ArbitageController;
