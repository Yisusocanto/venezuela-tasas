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
import type { AllRates, ExchangeRate } from "@/types/Rate";
import { useEffect, useState } from "react";
import { RefreshCcwDot, Repeat, TrendingUp } from "lucide-react";
import { NumericFormat } from "react-number-format";
import Big from "big.js";

const Schema = z.object({
  currency: z.coerce.number(),
  bolivar: z.coerce.number(),
});

interface CalculatorProps {
  exchangeRates: AllRates;
}

function Calculator({ exchangeRates }: CalculatorProps) {
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof AllRates>("dolar");

  const currentRate = exchangeRates?.[selectedCurrency]?.exchangeRate ?? "0";

  const { setValue, reset, watch } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      bolivar: Number(exchangeRates?.dolar?.exchangeRate ?? 0),
      currency: 1,
    },
  });

  useEffect(() => {
    if (exchangeRates && exchangeRates.dolar) {
      reset({
        bolivar: Number(exchangeRates.dolar.exchangeRate),
        currency: 1,
      });
    }
  }, [exchangeRates, reset]);

  const bolivarValue = watch("bolivar") as number;
  const currencyValue = watch("currency") as number;

  const resetForm = () => {
    if (exchangeRates && exchangeRates.dolar) {
      reset({
        bolivar: Number(exchangeRates.dolar.exchangeRate),
        currency: 1,
      });
    }
    setSelectedCurrency("dolar");
  };

  const handleSelectCurrencyChange = (value: Key) => {
    const currencyKey = value as keyof AllRates;
    setSelectedCurrency(currencyKey);
    const newRate = exchangeRates?.[currencyKey]?.exchangeRate ?? "0";
    // Update currency amount based on current bolivars
    setValue("bolivar", Number(newRate));
    setValue("currency", 1);
  };

  const calculator = (
    exchangeRate: string,
    currencyValue: number,
    method: "divide" | "multiply",
  ) => {
    const rate = Number(exchangeRate) || 1;
    return method === "divide"
      ? Big(currencyValue).div(rate)
      : Big(currencyValue).times(rate);
  };

  const onBolivarInputChange = (v: number | undefined) => {
    if (v === undefined) {
      setValue("bolivar", "" as unknown as number);
      setValue("currency", "" as unknown as number);
      return;
    }

    const newValue = calculator(currentRate, v, "divide");
    setValue("bolivar", v);
    setValue("currency", Number(newValue.toFixed(2)));
  };

  const onCurrencyInputChange = (v: number | undefined) => {
    if (v === undefined) {
      setValue("currency", "" as unknown as number);
      setValue("bolivar", "" as unknown as number);
      return;
    }
    const newValue = calculator(currentRate, v, "multiply");
    setValue("currency", v);
    setValue("bolivar", Number(newValue.toFixed(2)));
  };

  return (
    <Card className="w-full p-4 md:p-8 border">
      <Card.Title className="text-xl md:text-3xl font-bold flex gap-2 items-center">
        <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
          <RefreshCcwDot size={20} className="text-accent" />
        </span>
        Calculadora de Divisas
      </Card.Title>
      <div className="">
        <Form className="flex flex-col md:flex-row gap-2 items-center">
          <div className="w-full flex-1 min-w-[200px] bg-background p-4 rounded-2xl">
            <TextField>
              <Label>Monto en Bolívares (VES)</Label>
              <NumericFormat
                customInput={Input}
                thousandSeparator
                allowNegative={false}
                className="border border-accent-soft bg-background"
                value={bolivarValue}
                onValueChange={(v, x) =>
                  !!x.event ? onBolivarInputChange(v.floatValue) : null
                }
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

          <div className="w-full flex-1 flex flex-col md:flex-row gap-4 bg-background p-4 rounded-2xl items-stretch md:items-center overflow-hidden min-w-0">
            <div className="shrink-0">
              <Select
                className={"w-full md:w-fit"}
                placeholder="Seleccionar divisa"
                selectedKey={selectedCurrency}
                onSelectionChange={(key) =>
                  handleSelectCurrencyChange(key as Key)
                }
              >
                <Label>Seleccionar Divisa</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className={"border"}>
                  <ListBox>
                    {Object.entries(exchangeRates || {}).map(([key, rate]) => (
                      <ListBox.Item
                        key={key}
                        id={key}
                        textValue={rate.currency?.code ?? key}
                      >
                        {rate.currency?.code ?? key} - ({rate.currency?.name ?? ""})
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <TextField>
                <Label>Monto en {exchangeRates?.[selectedCurrency]?.currency?.code ?? selectedCurrency}</Label>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator
                  prefix="$"
                  allowNegative={false}
                  className="border border-accent-soft bg-background"
                  value={currencyValue}
                  onValueChange={(v, x) =>
                    !!x.event ? onCurrencyInputChange(v.floatValue) : null
                  }
                />
              </TextField>
            </div>
          </div>
        </Form>
        <div className="mt-6 p-4 bg-background/50 rounded-lg">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Tasa de cambio actual
          </h2>
          <div className="text-2xl font-bold flex items-center gap-2 mt-1">
            <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </span>
            <span className="text-primary text-xl">1 {exchangeRates?.[selectedCurrency]?.currency?.code ?? selectedCurrency}</span>
            <span className="text-muted-foreground text-lg">=</span>
            <span className="text-accent text-2xl">
              {currentRate} BS
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Calculator;
