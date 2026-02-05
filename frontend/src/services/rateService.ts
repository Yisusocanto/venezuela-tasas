import { customFetch } from "@/lib/api";
import type { AllRates } from "@/types/Rate";

export const getAllRates = async (): Promise<AllRates> => {
  const data = await customFetch<AllRates>("/api/v1/rates", {
    next: { revalidate: 60 },
  });
  return data;
};
