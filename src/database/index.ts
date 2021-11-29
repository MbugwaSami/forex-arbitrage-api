import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";
import path from "path";
import { ExchangeResponse } from "../interfaces/arbitage";
//function to query data after every 5 mins

class Database {
  static async currencyExchanges(axiosConfigs: AxiosRequestConfig) {
    const res = await axios.get<ExchangeResponse>(
      "https://data.fixer.io/api/latest",
      axiosConfigs
    );
    if (!res.data?.success) {
      throw new Error(res.data.error.info);
    }
    return res;
  }

  static async addData() {
    try {
      const destPath = "../database/data.json";
      const mapper: { [key: string]: any } = {};
      let axiosConfigs = {
        params: {
          base: "",
          access_key: process.env.ACCESS_KEY,
        },
      };
      const { data } = await this.currencyExchanges(axiosConfigs);
      if (data && data.success) {
        mapper[data?.base] = data?.rates;
        const relatedExchanges = Object.keys(data?.rates).map(async (key) => {
          axiosConfigs = {
            params: {
              base: key,
              access_key: process.env.ACCESS_KEY,
            },
          };

          if (key !== data?.base) {
            const { data: related } = await this.currencyExchanges(
              axiosConfigs
            );
            if (related) {
              mapper[related?.base] = related?.rates;
              return related;
            }
          }
        });
        const allAdded = await Promise.all(relatedExchanges);
        if (allAdded) {
          const dataPath = path.join(__dirname, "./data.json");
          fs.writeFileSync(dataPath, JSON.stringify(mapper));
          console.log("All data retrieved");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  static getData() {
    try {
      const dataPath = path.join(__dirname, "./data.json");
      const data = fs.readFileSync(dataPath);
      //@ts-ignore
      return JSON.parse(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default Database;
