import {
  getAllExchangeRates,
  getExchangeRateHistory,
  getExchangeRateHistoryForDateRange,
  getExchangeRateOnACertainDate,
} from "@/services/rateService";
import { useQuery } from "@tanstack/react-query";

export const useAllRates = () => {
  return useQuery({
    queryKey: ["allRates"],
    queryFn: getAllExchangeRates,
  });
};

export const useRateForCertainDate = (
  currencyName: string,
  date: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ["rateCertainDate", currencyName, date],
    queryFn: () => getExchangeRateOnACertainDate(currencyName, date),
    enabled: enabled && !!currencyName && !!date,
  });
};

export const useRateForDateRange = (
  currencyName: string,
  startDate: string,
  endDate: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ["rateDateRange", currencyName, startDate, endDate],
    queryFn: () =>
      getExchangeRateHistoryForDateRange(currencyName, startDate, endDate),
    enabled: enabled && !!currencyName && !!startDate && !!endDate,
  });
};

export const useRateHistory = (currencyName: string = "dolar") => {
  return useQuery({
    queryKey: ["rateHistory", currencyName],
    queryFn: () => getExchangeRateHistory(currencyName),
  });
};
