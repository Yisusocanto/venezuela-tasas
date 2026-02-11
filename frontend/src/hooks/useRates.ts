import {
  getAllRates,
  getRateForDateRange,
  getRateOnCertainDate,
  rateHistory,
} from "@/services/rateService";
import { useQuery } from "@tanstack/react-query";

export const useAllRates = () => {
  return useQuery({
    queryKey: ["allRates"],
    queryFn: getAllRates,
  });
};

export const useRateForCertainDate = (
  currencyName: string,
  date: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ["rateCertainDate", currencyName, date],
    queryFn: () => getRateOnCertainDate(currencyName, date),
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
    queryFn: () => getRateForDateRange(currencyName, startDate, endDate),
    enabled: enabled && !!currencyName && !!startDate && !!endDate,
  });
};

export const useRateHistory = (currencyName: string = "dolar") => {
  return useQuery({
    queryKey: ["rateHistory", currencyName],
    queryFn: () => rateHistory(currencyName),
  });
};
