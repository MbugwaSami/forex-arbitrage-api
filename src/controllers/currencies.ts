import { Response, Request } from "express";

//local imports
import Helper from "../helpers/currencies";

class ArbitageController {
  static async getCurrencies(req: Request, res: Response) {
    const currencies = await Helper.getAllCurrencies();
    return res.status(200).send({
      currencies,
    });
  }
}

export default ArbitageController;
