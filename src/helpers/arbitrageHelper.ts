//local imports
import { ArbitrageRes, Arbitrage } from "../interfaces/arbitage";
import Database from "../database";
import CurrencyGraph, { CurrencyRate } from "./currencyGraph";
import { Path } from "../interfaces/arbitage";

class ArbitageHelper {
  static getMaxPath(baseCurrency: string): ArbitrageRes {
    //create graph to represent our problem
    //represent w1*w2*w3 as sum by => log(w1*w2*w3)= log(w1) +log(w2)+log(w3)
    const currencyGraph = new CurrencyGraph();
    const currencyRates = Database.getData();

    //add graph vertices(unique currencies)
    for (let key in currencyRates) {
      currencyGraph.addCurrency(key);
    }

    //add graph edges(exchange rates between two currency)
    for (let key in currencyRates) {
      const srcCurrency = key;
      for (let relKey in currencyRates[key]) {
        const destCurrency = relKey;

        //Get log to convert our problem to a graph problem(graph work with sums) and
        //Multiply each value with -1 =>Transforma positive cycle to negative cycle.
        const currencyRate = -Math.log(
          currencyRates[srcCurrency][destCurrency]
        );
        currencyGraph.addCurrenciesRates(
          srcCurrency,
          destCurrency,
          currencyRate
        );
      }
    }

    //get arbitrages and calculate their values
    const arbitrages = this.getArbitrages(currencyGraph, baseCurrency);
    let max = { arbitrage: 1 } as Arbitrage;
    const arbitageCalcs = arbitrages.map((arb) => {
      let arbitrage = 1;
      let path: Array<Path> = [];
      arb.path?.forEach((curr, index) => {
        if (index < arb.path.length - 1) {
          arbitrage = arbitrage * currencyRates[curr][arb.path[index + 1]];
          path.push({
            srcCurr: curr,
            destCurr: arb.path[index + 1],
            arbitrage,
            rate: currencyRates[curr][arb.path[index + 1]]
          });
        }
      });
      if (arbitrage > max.arbitrage) {
        max = { ...max, arbitrage, path: path };
      }
      return { arbitrage, path: path};
    });

    return { arbitrages: arbitageCalcs, max: max };
    //get currency arbitrage
  }

  //use Bellman algorithim to get the different negative cycles
  static getArbitrages(graph: CurrencyGraph, sourceCurrency: string) {
    const { currencies, currenciesRates } = graph;

    // Initialize rate from base
    // to all other currencies as max number apart from itself
    const totalDistance: { [key: string]: any } = {};
    let currenciesValues = currencies.values();
    for (let i = 0; i < currencies.size; i++) {
      const nextCurr = currenciesValues.next().value;
      totalDistance[nextCurr] = {};
      totalDistance[nextCurr]["value"] = Number.MAX_VALUE;
      totalDistance[nextCurr]["prev"] = "";
      totalDistance[nextCurr];
    }
    totalDistance[sourceCurrency]["value"] = 0;

    //Visit each edge(currency rate between two currencies) for N-1 times }N is number of currencies
    //Relax the distance between the edges
    currenciesValues = currencies.values();
    for (let i = 1; i <= currencies.size; i++) {
      for (let j = 0; j < currenciesRates.length; j++) {
        const { fromCurr, toCurr, rate } = currenciesRates[j];
        if (
          totalDistance[fromCurr]["value"] != Number.MAX_VALUE &&
          totalDistance[fromCurr]["value"] + rate <
            totalDistance[toCurr]["value"]
        ) {
          totalDistance[toCurr]["value"] =
            totalDistance[fromCurr]["value"] + rate;
          totalDistance[toCurr]["prev"] = fromCurr;
        }
      }
    }

    //perform one more iteration to get negative cycles
    const arbitrages = [];
    for (let j = 0; j < currenciesRates.length; j++) {
      const { fromCurr, toCurr, rate } = currenciesRates[j];
      //arbitrage found
      if (
        totalDistance[fromCurr]["value"] != Number.MAX_VALUE &&
        totalDistance[fromCurr]["value"] + rate < totalDistance[toCurr]["value"]
      ) {
        totalDistance[toCurr]["value"] =
          totalDistance[fromCurr]["value"] + rate;
        totalDistance[toCurr]["prev"] = fromCurr;
        const weight = totalDistance[fromCurr]["value"] + rate;
        if (toCurr === sourceCurrency) {
          //create path to arbitrages
          const path: Array<string> = [];
          let current = toCurr;
          while (current.length && !path.includes(current)) {
            path.unshift(current);
            current = totalDistance[current]["prev"];
          }
          path.unshift(toCurr);
          arbitrages.push({ path, weight });
        }
      }
    }
    return arbitrages;
  }
}

export default ArbitageHelper;
