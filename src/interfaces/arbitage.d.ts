export interface ArbitagePath {
  maxPath: string;
  pathArray: Array<PathValue>;
}
export interface PathValue {
  currency: string;
  rate: string;
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

