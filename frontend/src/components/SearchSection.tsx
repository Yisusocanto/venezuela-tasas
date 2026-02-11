"use client";

import { AllRates, Rate } from "@/types/Rate";
import { useState } from "react";
import RateSearch from "./RateSearch";
import RateResultsTable from "./RateResultsTable";

interface SearchSectionProps {
  allRates: AllRates;
  withChart?: boolean;
  forRange?: boolean;
}

function SearchSection({ allRates, forRange = false }: SearchSectionProps) {
  const [rates, setRates] = useState<Rate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <RateSearch
        allRates={allRates}
        setRates={setRates}
        setError={setError}
        forRange={forRange}
      />
      {(rates || error) && <RateResultsTable rates={rates} error={error} />}
    </div>
  );
}

export default SearchSection;
