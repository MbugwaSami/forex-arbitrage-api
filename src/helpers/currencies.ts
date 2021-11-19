import axios from "axios";

import { SelectOption } from "../interfaces/currency";

class CurrencyHelper {
  static async getAllCurrencies(): Promise<Array<SelectOption>> {
    const response = await axios.get<object>(
      "https://openexchangerates.org/api/currencies.json"
    );
    const { data } = response;
    if (data) {
      const currencyOptions = Object.keys(data).map((key) => {
        return { label: key, value: key };
      });
      return currencyOptions;
    }
  }
}

export default CurrencyHelper;
