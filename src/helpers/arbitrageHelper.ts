import axios from "axios";
//local imports
import { ArbitagePath } from "../interfaces/arbitage";

class ArbitageHelper {
  static async getMaxPath(baseCurrency: string): Promise<ArbitagePath> {
    const params = {
      base: baseCurrency,
      access_key: process.env.ACCESS_KEY,
    };

    const currencyExchanges = axios.get("http://data.fixer.io/api/latest", {
      params,
    });
    return {} as ArbitagePath;
  }
}

export default ArbitageHelper;
