"use client";

import { useRateHistory } from "@/hooks/useRates";
import { Card } from "@heroui/react";
import dayjs from "dayjs";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  TooltipContentProps,
} from "recharts";

function Chart() {
  const { data, isLoading, isError, error } = useRateHistory();

  if (isLoading) {
    return (
      <Card className="w-full h-[500px] p-8 border flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </Card>
    );
  }

  if (isError && error) {
    return (
      <Card className="w-full h-[500px] p-8 border flex items-center justify-center text-danger">
        Error loading the chart: {error.message}
      </Card>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipContentProps<string | number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-content1/90 border border-border p-4 rounded-xl shadow-xl backdrop-blur-md min-w-[150px]">
          <p className="text-default-500 text-sm mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {Number(payload[0].value).toFixed(2)}
            </span>
            <span className="text-default-500 text-sm font-medium">VES</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-emerald-500 text-xs font-medium">+0.85%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-fit p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Tendencia del Dólar
            </h2>
            <p className="text-sm text-muted">USD vs VES (Último mes)</p>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data?.rates}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#27272a"
              opacity={0.2}
            />
            <XAxis
              dataKey={(data) => dayjs(data.date).format("MMM DD")}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
              dy={10}
              minTickGap={30}
            />
            <YAxis
              dataKey={(data) => data.rate + 200}
              hide={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{
                stroke: "#27272a",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default Chart;
