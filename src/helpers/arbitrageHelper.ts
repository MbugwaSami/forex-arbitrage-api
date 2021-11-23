import axios, { AxiosRequestConfig } from "axios";

//local imports
import {
  ArbitagePath,
  ExchangeResponse,
  PathValue,
} from "../interfaces/arbitage";

class ArbitageHelper {
  static async getMaxPath(
    baseCurrency: string,
    currentCurrency: string,
    currentArbitage: number,
    maxArbitage: number,
    currentPath: Array<PathValue>,
    maxPath: Array<PathValue>,
    currentSringPath: string,
    maxStringPath: string,
    currencyMapper: { [key: string]: { [key: string]: any } }
  ): Promise<ArbitagePath> {
    const associateCurrency = currencyMapper?.[currentCurrency];
    if(!associateCurrency){
      throw new Error(`currency ${currentCurrency} was not found`)
    }
    const possibleExchanges = Object.keys(associateCurrency).filter((key) => {
      return !currentPath.find(
        (current) => current.currency.toLowerCase() === key.toLowerCase()
      );
    });
    if (possibleExchanges.length === 0) {
      return { pathArray: maxPath, stringPath: maxStringPath };
    }

    //loop all possible currency computing new arbitage values
    const allRecursed = possibleExchanges?.map(async (associateCurrency) => {
      const newStringPath =
        currentSringPath +
        `=> ${currencyMapper[currentCurrency][associateCurrency]} ${associateCurrency}`;
      const newArbitage =
        currentArbitage * currencyMapper[currentCurrency][associateCurrency];
      const newPath = [
        ...currentPath,
        {
          currency: associateCurrency,
          rate: currencyMapper[currentCurrency][associateCurrency],
        },
      ];
      const changeMaxValues = this.changeMaxValues(
        maxArbitage,
        newArbitage * currencyMapper[associateCurrency][baseCurrency]
      );
      if (changeMaxValues) {
        maxArbitage =
          newArbitage * currencyMapper[associateCurrency][baseCurrency];
        maxPath = [
          ...newPath,
          {
            currency: baseCurrency,
            rate: currencyMapper[associateCurrency][baseCurrency],
          },
        ];
        maxStringPath =
        newStringPath +`=> ${currencyMapper[associateCurrency][baseCurrency]}${baseCurrency}`;

      }

      //call function recursively to get values associted to the current currency
      const arbitagePath = await this.getMaxPath(
        baseCurrency,
        associateCurrency,
        newArbitage,
        maxArbitage,
        newPath,
        maxPath,
        newStringPath,
        maxStringPath,
        currencyMapper
      );
      return arbitagePath;
    });
    const allRecured = await Promise.all(allRecursed);
    if (allRecured) {
      return { pathArray: maxPath, stringPath: maxStringPath };
    }
  }

  static async getCurrencyMap(
    baseCurrency: string
  ): Promise<{ [key: string]: { [key: string]: any } }> {
    let axiosConfigs = {
      params: {
        base: baseCurrency,
        access_key: process.env.ACCESS_KEY,
      },
    };
    const mapper: { [key: string]: any } = {};

    //get exchange rates for base currency
    const { data } = await this.currencyExchanges(axiosConfigs);
    if (data) {
      mapper[data?.base] = data?.rates;

      //get exchange rates for all other currency associated to base
      const mapAssociated = Object.keys(data?.rates)?.map(async (base) => {
        axiosConfigs = {
          ...axiosConfigs,
          params: { ...axiosConfigs.params, base },
        };
        const { data: chidrenData } = await this.currencyExchanges(
          axiosConfigs
        );
        if (chidrenData) {
          mapper[chidrenData?.base] = chidrenData?.rates;
        }
        return chidrenData;
      });
      const allMaped = await Promise.all(mapAssociated);
      if (allMaped) {
        return mapper;
      }
    }
  }

  static async currencyExchanges(axiosConfigs: AxiosRequestConfig) {
    const res = await axios.get<ExchangeResponse>(
      "https://data.fixer.io/api/latest",
      axiosConfigs
    );
    if (!res.data?.success) {
      throw new Error(res.data?.error?.info);
    }
    return res;
  }

  static changeMaxValues(maxArbitage: number, latestArbitage: number) {
    return latestArbitage > maxArbitage;
  }
}

export default ArbitageHelper;
