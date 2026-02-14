import Chart from "@/components/Chart";
import SearchSection from "@/components/SearchSection";
import { getAllRates } from "@/services/rateService";

async function History() {
  let rates;
  try {
    rates = await getAllRates();
  } catch (error) {
    console.log("error", error);
  }

  if (!rates) {
    return <h1>Sin resultados</h1>;
  }

  return (
    <div className="flex flex-col w-full px-4 md:p-0 md:w-3/4 mx-auto my-12 md:my-20 gap-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Historial de tasa de cambios</h1>
        <p className="text-muted">
          explorar las tasas de cierre oficiales del BCV y las tendencias a lo
          largo del tiempo
        </p>
      </div>
      <SearchSection allRates={rates} forRange />
      <Chart />
    </div>
  );
}

export default History;
