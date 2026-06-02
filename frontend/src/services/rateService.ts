import { customFetch } from "@/lib/api";
import type { AllRates, ExchangeRate } from "@/types/Rate";

export const getAllExchangeRates = async (): Promise<AllRates> => {
	const data = await customFetch<AllRates>("/api/v1/rates", {
		next: { revalidate: 60 },
	});
	return data;
};

export const getExchangeRateOnACertainDate = async (
	currencyName: string,
	date: string,
): Promise<{ rates: ExchangeRate[] }> => {
	const data = await customFetch<{ rates: ExchangeRate[] }>(
		`/api/v1/rates/${currencyName}/history/${date}`,
	);
	return data;
};

export const getExchangeRateHistoryForDateRange = async (
	currencyName: string,
	startDate: string,
	endDate: string,
): Promise<{ rates: ExchangeRate[] }> => {
	const data = await customFetch<{ rates: ExchangeRate[] }>(
		`/api/v1/rates/${currencyName}/history/date_range`,
		{ params: { start_date: startDate, end_date: endDate } },
	);
	return data;
};

export const getExchangeRateHistory = async (
	currencyName: string = "dolar",
): Promise<{ rates: ExchangeRate[] }> => {
	const data = await customFetch<{ rates: ExchangeRate[] }>(
		`/api/v1/rates/${currencyName}/history`,
	);
	return data;
};
