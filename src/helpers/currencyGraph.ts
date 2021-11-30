export default class CurrencyGraph {
  currencies;
  currenciesRates: Array<CurrencyRate>;
  constructor() {
    this.currencies = new Set();
    this.currenciesRates = [];
  }

  addCurrenciesRates(fromCurr: string, toCurr: string, rate: number) {
    if (!this.currencies.has(fromCurr)) return;
    if (!this.currencies.has(toCurr)) return;

    const newRate = new CurrencyRate(fromCurr, toCurr, rate);
    this.currenciesRates.push(newRate);
  }

  addCurrency(currency: string) {
    if (currency) this.currencies.add(currency);
  }
}

export class CurrencyRate {
  fromCurr;
  toCurr;
  rate;
  constructor(fromCurr: string, toCurr: string, rate: number) {
    this.fromCurr = fromCurr;
    this.toCurr = toCurr;
    this.rate = rate;
  }
}
