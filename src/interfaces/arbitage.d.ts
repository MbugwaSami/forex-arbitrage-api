export interface Arbitrage {
  arbitrage: number;
  path: Array<Path>;
}

export interface Path {
  srcCurr: string;
  destCurr: string;
  arbitrage: number;
  rate: number;
}

export interface ArbitrageRes {
  max: Arbitrage;
  arbitrages: Array<Arbitrage>;
}

export interface PathValue {
  currency: string;
  rate: number;
}
export interface ExchangeResponse {
  success: boolean;
  base: string;
  rates: { [key: string]: number };
  error: {
    code: number;
    info: string;
  };
}
