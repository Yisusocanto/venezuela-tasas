export interface Rate {
  id: number;
  name: string;
  rate: number;
  date: string;
  currencyCode: string;
}

export interface AllRates {
  dolar: Rate;
  euro: Rate;
  lira: Rate;
  rublo: Rate;
}
