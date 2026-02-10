"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextField,
  Select,
  ListBox,
  Key,
} from "@heroui/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AllRates, Rate } from "@/types/Rate";
import { useEffect, useState } from "react";
import { RefreshCcwDot, Repeat, TrendingUp } from "lucide-react";

const Schema = z.object({
  currency: z.coerce.number(),
  bolivar: z.coerce.number(),
});

interface CalculatorProps {
  rates: AllRates;
}

function Calculator({ rates }: CalculatorProps) {
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof AllRates>("dolar");

  const currentRate = rates[selectedCurrency].rate;

  const { setValue, reset, watch } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      bolivar: rates.dolar.rate,
      currency: 1,
    },
  });

  useEffect(() => {
    if (rates) {
      reset({
        bolivar: rates.dolar.rate,
        currency: 1,
      });
    }
  }, [rates, reset]);

  const bolivarValue = watch("bolivar") as number;
  const currencyValue = watch("currency") as number;

  const resetForm = () => {
    reset({
      bolivar: rates.dolar.rate,
      currency: 1,
    });
    setSelectedCurrency("dolar");
  };

  const handleSelectCurrencyChange = (value: Key) => {
    const currencyKey = value as keyof AllRates;
    setSelectedCurrency(currencyKey);
    const newRate = rates[currencyKey].rate;
    // Update currency amount based on current bolivars
    setValue("bolivar", newRate);
    setValue("currency", 1);
  };

  const onBolivarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 1 : Number(e.target.value);
    setValue("bolivar", value);
    setValue("currency", Number((value / currentRate).toFixed(2)));
  };

  const onCurrencyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setValue("currency", value);
    setValue("bolivar", Number((value * currentRate).toFixed(2)));
  };

  return (
    <Card className="w-full p-8 border" variant="secondary">
      <Card.Title className="text-3xl font-bold flex gap-2 items-center">
        <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
          <RefreshCcwDot size={20} className="text-accent" />
        </span>
        Calculadora de Divisas
      </Card.Title>
      <div className="p-4">
        <Form className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px] bg-overlay p-4 rounded-2xl">
            <TextField>
              <Label>Monto en Bolívares (VES)</Label>
              <Input
                className="border border-accent-soft"
                type="number"
                step="any"
                value={typeof bolivarValue === "number" ? bolivarValue : ""}
                min={1}
                onChange={onBolivarInputChange}
              />
            </TextField>
          </div>

          <div className="flex-none">
            <Button
              onPress={resetForm}
              isIconOnly
              variant="secondary"
              className="bg-overlay border"
              size="lg"
            >
              <Repeat />
            </Button>
          </div>

          <div className="flex-2 flex gap-4  bg-overlay p-4 rounded-2xl items-center">
            <div className="flex-1 w-fit ">
              <Select
                selectedKey={selectedCurrency}
                onSelectionChange={(key) =>
                  handleSelectCurrencyChange(key as Key)
                }
              >
                <Label>Seleccionar Divisa</Label>
                <Select.Trigger className={"bg-accent-soft"}>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className={"border"}>
                  <ListBox>
                    {Object.entries(rates).map(([key, rate]) => (
                      <ListBox.Item
                        key={key}
                        id={key}
                        textValue={rate.currencyCode}
                      >
                        {rate.currencyCode} - ({rate.name})
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex-3 min-w-[200px]">
              <TextField>
                <Label>Monto en {selectedCurrency}</Label>
                <Input
                  className="border border-accent-soft"
                  type="number"
                  step="any"
                  value={typeof currencyValue === "number" ? currencyValue : ""}
                  min={1}
                  onChange={onCurrencyInputChange}
                />
              </TextField>
            </div>
          </div>
        </Form>
        <div className="mt-6 p-4 bg-overlay/50 rounded-lg">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Tasa de cambio actual
          </h2>
          <div className="text-2xl font-bold flex items-center gap-2 mt-1">
            <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </span>
            <span className="text-primary text-xl">1 {selectedCurrency}</span>
            <span className="text-muted-foreground text-lg">=</span>
            <span className="text-accent text-2xl">
              {currentRate.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
              VES
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Calculator;
