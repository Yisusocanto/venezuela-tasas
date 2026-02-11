import { customFetch } from "@/lib/api";
import type { AllRates, Rate } from "@/types/Rate";

export const getAllRates = async (): Promise<AllRates> => {
  const data = await customFetch<AllRates>("/api/v1/rates", {
    next: { revalidate: 60 },
  });
  return data;
};

export const getRateOnCertainDate = async (
  currencyName: string,
  date: string,
): Promise<{ rates: Rate[] }> => {
  const data = await customFetch<{ rates: Rate[] }>(
    `/api/v1/rates/${currencyName}/date/${date}`,
  );
  return data;
};

export const getRateForDateRange = async (
  currencyName: string,
  startDate: string,
  endDate: string,
): Promise<{ history: Rate[]; results: number }> => {
  const data = await customFetch<{ history: Rate[]; results: number }>(
    `/api/v1/rates/${currencyName}/rate_history_for_date_range`,
    {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    },
  );
  return data;
};
