import { Card } from "@heroui/react";
import { string } from "zod";

interface KPICardProps {
  currencyCode: string;
  currencyName?: string;
  rate: number;
  logo: React.ReactNode;
}

function KPICard({ currencyCode, rate, logo }: KPICardProps) {
  return (
    <Card className="flex flex-col w-xs border p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent-soft-hover rounded-xl">{logo}</div>
          <h1 className="text-2xl font-bold">{currencyCode}</h1>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg text-muted">
          <strong className="text-4xl text-white">{rate}</strong> Bs
        </span>
        <span className="text-muted">Tasa oficial del BCV</span>
      </div>
    </Card>
  );
}

export default KPICard;
