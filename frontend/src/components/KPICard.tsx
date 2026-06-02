import { Card } from "@heroui/react";


interface KPICardProps {
  currencyCode: string;
  currencyName?: string;
  exchangeRate: string;
  logo: React.ReactNode;
}

function KPICard({ currencyCode, exchangeRate, logo }: KPICardProps) {
  return (
    <Card className="w-full flex flex-col border p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent-soft-hover rounded-xl">{logo}</div>
          <h1 className="text-2xl font-bold">{currencyCode}</h1>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg text-muted">
          <strong className="text-4xl text-foreground">{exchangeRate}</strong>{" "}
          Bs
        </span>
        <span className="text-muted">Tasa oficial del BCV</span>
      </div>
    </Card>
  );
}

export default KPICard;
