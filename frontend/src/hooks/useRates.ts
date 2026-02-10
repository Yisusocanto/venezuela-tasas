import { getAllRates, getRateOnCertainDate } from "@/services/rateService";
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
