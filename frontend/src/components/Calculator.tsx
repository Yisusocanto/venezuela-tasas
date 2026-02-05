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
import { AllRates } from "@/types/Rate";
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
  const [selectedCurrency, setSelectedCurrency] = useState<Key>("USD");

  const currentRate =
    selectedCurrency === "USD" ? rates.dolar.rate : rates.euro.rate;

  const { setValue, reset, watch } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      bolivar: 1,
      currency: rates.dolar.rate,
    },
  });

  // Ensure form is reset when rates arrive or change
  useEffect(() => {
    if (rates) {
      reset({
        bolivar: 1,
        currency: rates.dolar.rate,
      });
    }
  }, [rates, reset]);

  const bolivarValue = watch("bolivar") as number;
  const currencyValue = watch("currency") as number;

  const resetForm = () => {
    reset({
      bolivar: 1,
      currency: rates.dolar.rate,
    });
    setSelectedCurrency("USD");
  };

  const handleSelectCurrencyChange = (value: Key) => {
    setSelectedCurrency(value);
    const newRate = value === "USD" ? rates.dolar.rate : rates.euro.rate;
    // Update currency amount based on current bolivars
    setValue("currency", Number((bolivarValue / newRate).toFixed(2)));
  };

  const onBolivarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number(e.target.value);
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
        <div className="rounded-full bg-accent-soft p-2">
          <RefreshCcwDot size={20} className="text-accent" />
        </div>
        Calculadora de Divisas
      </Card.Title>
      <div className="p-4">
        <Form className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px] bg-accent-soft p-4 rounded-2xl">
            <TextField>
              <Label>Monto en Bolívares (VES)</Label>
              <Input
                className="bg-overlay"
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

          <div className="flex-2 flex gap-4  bg-accent-soft p-4 rounded-2xl items-center">
            <div className="flex-1 w-fit ">
              <Select
                selectedKey={selectedCurrency}
                onSelectionChange={(key) =>
                  handleSelectCurrencyChange(key as Key)
                }
              >
                <Label>Seleccionar Divisa</Label>
                <Select.Trigger className="bg-overlay">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-overlay">
                  <ListBox className="bg-overlay">
                    <ListBox.Item id="USD" textValue="USD">
                      USD
                    </ListBox.Item>
                    <ListBox.Item id="EUR" textValue="EUR">
                      EUR
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex-3 min-w-[200px]">
              <TextField>
                <Label>Monto en {selectedCurrency}</Label>
                <Input
                  className="bg-overlay"
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
            <div className="rounded-full bg-accent-soft p-2">
              <TrendingUp size={20} className="text-accent" />
            </div>
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
