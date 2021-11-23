export interface ArbitagePath {
  stringPath: string;
  pathArray: Array<PathValue>;
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

