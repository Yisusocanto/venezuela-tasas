import Calculator from "@/components/Calculator";
import KPICard from "@/components/KPICard";
import { getAllRates } from "@/services/rateService";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Calendar, DollarSign, EuroIcon } from "lucide-react";

dayjs.locale("es");

export default async function Home() {
  let rates;
  try {
    rates = await getAllRates();
  } catch (error) {
    console.error("Error fetching rates in Home:", error);
  }

  if (!rates) {
    return (
      <div className="w-full md:w-3/4 mx-auto text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">
          Error al cargar datos
        </h1>
        <p>
          No se pudieron obtener las tasas de cambio. Por favor, intenta de
          nuevo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4 mx-auto">
      <div className="mb-6 mt-12">
        <h1 className="text-4xl font-bold ">Dolar Venezuela</h1>
        <span className="text-lg text-accent flex items-center gap-2">
          <Calendar size={18} />
          {dayjs().format("D [de] MMMM [del] YYYY")}
        </span>
      </div>
      <Calculator rates={rates} />
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <KPICard
          currencyCode="USD"
          currencyName={rates.dolar?.name || "Dólar"}
          rate={rates.dolar?.rate || 0}
          logo={<DollarSign />}
        />
        <KPICard
          currencyCode="EUR"
          currencyName={rates.euro?.name || "Euro"}
          rate={rates.euro?.rate || 0}
          logo={<EuroIcon />}
        />
      </div>
    </div>
  );
}
