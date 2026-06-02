export interface AllRates {
  dolar: ExchangeRate;
  euro: ExchangeRate;
  lira: ExchangeRate;
  rublo: ExchangeRate;
}

export interface ExchangeRate {
  exchangeRate: string;
  creationDate: string;
  currency?: Currency;
}

export interface Currency {
  code: string;
  name: string;
}
