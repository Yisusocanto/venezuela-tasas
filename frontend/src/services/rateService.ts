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
