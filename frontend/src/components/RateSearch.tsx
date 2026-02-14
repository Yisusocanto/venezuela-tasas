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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRateForCertainDate, useRateForDateRange } from "@/hooks/useRates";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const singleDateSchema = z.object({
  currencyName: z.string().min(1, "La divisa es requerida."),
  date: z.string().min(1, "La fecha es requerida."),
  startDate: z.any().optional(),
  endDate: z.any().optional(),
});

const rangeDateSchema = z.object({
  currencyName: z.string().min(1, "La divisa es requerida."),
  date: z.any().optional(),
  startDate: z.string().min(1, "Fecha inicio requerida"),
  endDate: z.string().min(1, "Fecha fin requerida"),
});

interface RateSearchProps {
  allRates: AllRates;
  setRates: (rates: Rate[] | null) => void;
  setError: (error: string | null) => void;
  forRange?: boolean;
}

function RateSearch({
  allRates,
  setRates,
  setError,
  forRange = false,
}: RateSearchProps) {
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forRange ? rangeDateSchema : singleDateSchema),
    mode: "onChange",
    defaultValues: {
      currencyName: "",
      date: "",
      startDate: "",
      endDate: "",
    },
  });

  const currencySelectValue = watch("currencyName");
  const dateValue = watch("date");
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");

  // Single Date Query
  const singleQuery = useRateForCertainDate(
    currencySelectValue,
    dateValue,
    !forRange && shouldFetch,
  );

  // Range Date Query
  const rangeQuery = useRateForDateRange(
    currencySelectValue,
    startDateValue,
    endDateValue,
    forRange && shouldFetch,
  );

  const activeQuery = forRange ? rangeQuery : singleQuery;
  const { data, isLoading, isError, error, status } = activeQuery;

  useEffect(() => {
    if (shouldFetch && !isLoading) {
      if (isError && error) {
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

      if (data?.rates) setError(null);
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
    <Card className="p-4 md:p-8 gap-6 border">
      <Card.Title className="text-3xl font-bold flex flex-row items-center gap-2">
        <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
          <Search size={20} className="text-accent" />
        </span>
        Busqueda avanzada {forRange ? "(Rango)" : "(Fecha)"}
      </Card.Title>
      <Separator />
      <Card.Content>
        <form
          onSubmit={onSubmit}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          {/* currency selector */}
          <div className="w-full flex flex-col gap-1">
            <Controller
              control={control}
              name="currencyName"
              render={({ field }) => (
                <Select
                  fullWidth
                  placeholder="Seleccionar divisa"
                  isInvalid={!!errors.currencyName}
                  selectedKey={field.value}
                  onSelectionChange={(key) => {
                    // Check if key is a valid value (not null) and cast to string
                    if (key) {
                      field.onChange(key.toString());
                    }
                  }}
                >
                  <Label>Divisa</Label>
                  <Select.Trigger className={"bg-background"}>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {Object.entries(allRates).map(([key, rate]) => (
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
              )}
            />
            {errors.currencyName ? (
              <span className="text-tiny text-danger">
                {errors.currencyName.message as string}
              </span>
            ) : (
              <span className="text-tiny text-default-500">
                Selecciona la divisa
              </span>
            )}
          </div>

          {forRange ? (
            // Range Mode
            <>
              {/* Start Date */}
              <div className="w-full flex flex-col gap-1">
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DateField
                      fullWidth
                      isInvalid={!!errors.startDate}
                      // Uncontrolled: NO value prop
                      onChange={(value) => {
                        field.onChange(value?.toString() ?? "");
                      }}
                    >
                      <Label>Desde</Label>
                      <DateInputGroup>
                        <DateInputGroup.Input className={"bg-background"}>
                          {(segment) => (
                            <DateInputGroup.Segment segment={segment} />
                          )}
                        </DateInputGroup.Input>
                      </DateInputGroup>
                    </DateField>
                  )}
                />
                {errors.startDate ? (
                  <span className="text-tiny text-danger">
                    {errors.startDate.message as string}
                  </span>
                ) : (
                  <span className="text-tiny text-default-500">
                    Fecha de inicio
                  </span>
                )}
              </div>

              {/* End Date */}
              <div className="w-full flex flex-col gap-1">
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DateField
                      fullWidth
                      isInvalid={!!errors.endDate}
                      // Uncontrolled
                      onChange={(value) => {
                        field.onChange(value?.toString() ?? "");
                      }}
                    >
                      <Label>Hasta</Label>
                      <DateInputGroup>
                        <DateInputGroup.Input className={"bg-background"}>
                          {(segment) => (
                            <DateInputGroup.Segment segment={segment} />
                          )}
                        </DateInputGroup.Input>
                      </DateInputGroup>
                    </DateField>
                  )}
                />
                {errors.endDate ? (
                  <span className="text-tiny text-danger">
                    {errors.endDate.message as string}
                  </span>
                ) : (
                  <span className="text-tiny text-default-500">
                    Fecha de fin
                  </span>
                )}
              </div>
            </>
          ) : (
            // Single Mode
            <div className="w-full flex flex-col gap-1">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DateField
                    fullWidth
                    isInvalid={!!errors.date}
                    // Uncontrolled
                    onChange={(value) => {
                      field.onChange(value?.toString() ?? "");
                    }}
                  >
                    <Label>Fecha</Label>
                    <DateInputGroup>
                      <DateInputGroup.Input className={"bg-background"}>
                        {(segment) => (
                          <DateInputGroup.Segment segment={segment} />
                        )}
                      </DateInputGroup.Input>
                    </DateInputGroup>
                  </DateField>
                )}
              />
              {errors.date ? (
                <span className="text-tiny text-danger">
                  {errors.date.message as string}
                </span>
              ) : (
                <span className="text-tiny text-default-500">
                  Selecciona la fecha
                </span>
              )}
            </div>
          )}

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
