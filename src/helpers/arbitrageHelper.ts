import axios, { AxiosRequestConfig } from "axios";

//local imports
import { ArbitagePath, ExchangeResponse } from "../interfaces/arbitage";

class ArbitageHelper {
  static async getMaxPath(
    baseCurrency: string,
    currentCurrency: string,
    currentArbitage: number,
    maxArbitage: number,
    currentPath: Array<string>,
    maxPath: Array<string>,
    currencyMapper: { [key: string]: { [key: string]: any } }
  ): Promise<ArbitagePath> {
    //Get currency mapper for base currency and it's associated currency

    const associateCurrency = currencyMapper?.[currentCurrency];
    const possibleExchanges = Object.keys(associateCurrency).filter((key) => {
      return !currentPath.includes(key);
    });

    //loop all possible currency computing new arbitage values
    const allRecursed = possibleExchanges?.map(async (associateCurrency) => {
      const newArbitage =
        currentArbitage * currencyMapper[currentCurrency][associateCurrency];
      const newPath = [...currentPath, associateCurrency];
      const changeMaxValues = this.changeMaxValues(
        maxArbitage,
        newArbitage * currencyMapper[associateCurrency][baseCurrency]
      );
      if (changeMaxValues) {
        maxArbitage =
          newArbitage * currencyMapper[associateCurrency][baseCurrency];
        maxPath = [...newPath, baseCurrency];
      }

      //call function recursively to get values associted to the current currency
      const arbitagePath = await this.getMaxPath(
        baseCurrency,
        associateCurrency,
        newArbitage,
        maxArbitage,
        newPath,
        maxPath,
        currencyMapper
      );
      return arbitagePath;
    });
    const allRecured = await Promise.all(allRecursed);
    if (allRecured) {
      return {} as ArbitagePath;
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

  static async currencyExchanges(axiosConfigs: AxiosRequestConfig, retry = 3) {
    try {
      const data = await axios.get<ExchangeResponse>(
        "https://data.fixer.io/api/latest",
        axiosConfigs
      );
      return data;
    } catch (error) {
      if (retry > 0) {
        setTimeout(() => this.currencyExchanges(axiosConfigs, retry - 1), 2000);
      } else {
        throw new Error("fails here");
      }
    }
  }

  static changeMaxValues(maxArbitage: number, latestArbitage: number) {
    return latestArbitage > maxArbitage;
  }
}

export default ArbitageHelper;
