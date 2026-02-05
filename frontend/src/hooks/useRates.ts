import { getAllRates } from "@/services/rateService";
import { useQuery } from "@tanstack/react-query";

export const useAllRates = () => {
  return useQuery({
    queryKey: ["allRates"],
    queryFn: getAllRates,
  });
};
