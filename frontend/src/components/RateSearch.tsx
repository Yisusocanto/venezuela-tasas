"use client";

import {
  Button,
  Card,
  DateField,
  DateInputGroup,
  Label,
  ListBox,
  Select,
  Separator,
} from "@heroui/react";
import type { AllRates, Rate } from "@/types/Rate";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRateForCertainDate } from "@/hooks/useRates";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const Schema = z.object({
  currencyName: z.string("La divisa es requerida."),
  date: z.iso.date({
    error: (issue) =>
      issue.input === undefined ? "La fecha es requerida." : "Fecha invalida.",
  }),
});

interface RateSearchProps {
  AllRates: AllRates;
  setRates: (rates: Rate[] | null) => void;
  setError: (error: string | null) => void;
}

function RateSearch({ AllRates, setRates, setError }: RateSearchProps) {
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "onChange",
  });

  const currencySelectValue = watch("currencyName");
  const dateValue = watch("date");

  const { data, isLoading, isError, error, status } = useRateForCertainDate(
    currencySelectValue,
    dateValue,
    shouldFetch,
  );

  useEffect(() => {
    if (shouldFetch && !isLoading) {
      if (isError && error) {
        // If the error is 404, it means no results found, so we clean the rates and error
        if (
          error.message.includes("404") ||
          error.message.includes("Not Found")
        ) {
          setRates([]);
          setError(null);
        } else {
          setError(error.message);
          setRates(null);
        }
        setShouldFetch(false);
        return;
      }

      setRates(data?.rates ?? null);
      setError(null);
      setShouldFetch(false);
    }
  }, [
    shouldFetch,
    isLoading,
    status,
    data,
    isError,
    error,
    setRates,
    setError,
  ]);

  const onSubmit = handleSubmit(() => {
    setShouldFetch(true);
  });

  return (
    <Card className="p-8 gap-6 border">
      <Card.Title className="text-3xl font-bold flex flex-row items-center gap-2">
        <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
          <Search size={20} className="text-accent" />
        </span>
        Busqueda avanzada
      </Card.Title>
      <Separator />
      <Card.Content>
        <form
          onSubmit={onSubmit}
          className="flex flex-row justify-between items-center gap-4"
        >
          {/* currency selector */}
          <div className="w-full flex flex-col gap-1">
            <Select
              fullWidth
              value={currencySelectValue}
              isInvalid={!!errors.currencyName}
              onChange={(value) =>
                setValue("currencyName", value as string, {
                  shouldValidate: true,
                })
              }
            >
              <Label>Divisa</Label>
              <Select.Trigger className={"bg-surface-secondary"}>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {Object.entries(AllRates).map(([key, rate]) => (
                    <ListBox.Item
                      key={rate.name}
                      id={rate.name}
                      textValue={rate.name}
                    >
                      {rate.currencyCode} - ({rate.name})
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            {errors.currencyName ? (
              <span className="text-tiny text-danger">
                {errors.currencyName.message}
              </span>
            ) : (
              <span className="text-tiny text-default-500">
                Selecciona la divisa
              </span>
            )}
          </div>

          {/* date input */}
          <div className="w-full flex flex-col gap-1">
            <DateField
              fullWidth
              isInvalid={!!errors.date}
              onChange={(value) => {
                setValue("date", value?.toString() ?? "", {
                  shouldValidate: true,
                });
              }}
            >
              <Label>Fecha</Label>
              <DateInputGroup>
                <DateInputGroup.Input className={"bg-surface-secondary"}>
                  {(segment) => <DateInputGroup.Segment segment={segment} />}
                </DateInputGroup.Input>
              </DateInputGroup>
            </DateField>
            {errors.date ? (
              <span className="text-tiny text-danger">
                {errors.date.message}
              </span>
            ) : (
              <span className="text-tiny text-default-500">
                Selecciona la fecha
              </span>
            )}
          </div>
          {/* search button */}
          <Button fullWidth type="submit" isDisabled={isLoading}>
            {isLoading ? "Buscando..." : "Buscar Tasa"}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}

export default RateSearch;
