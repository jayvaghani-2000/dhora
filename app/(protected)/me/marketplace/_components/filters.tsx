"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CommandInput, Command } from "@/components/ui/command";
import SelectButton from "./SelectButton";
import { Button } from "@/components/ui/button";
import { LuFilter } from "react-icons/lu";
import { businessTypeEnum } from "@/db/schema";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { filterType } from ".";

type propType = {
  filter: filterType;
  setFilter: React.Dispatch<React.SetStateAction<filterType>>;
};

const Filters = (props: propType) => {
  const { filter, setFilter } = props;
  const SortingData = ["A-Z", "Z-A", "Top Rated"];

  const businessTypeOptions = businessTypeEnum.enumValues;

  const selectFilterValue = (field: keyof filterType, value: string) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      current_page: 1,
      [field]: value,
    }));
  };

  const methods = useForm({
    defaultValues: {
      address: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-start gap-4">
        <div className="flex w-full lg:w-auto gap-2">
          <div className="w-full">
            <Command
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                selectFilterValue("search", e.target.value);
              }}
            >
              <CommandInput placeholder="Search" className="w-full" />
            </Command>
          </div>
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="p-2 gap-1 flex items-center"
                >
                  <LuFilter className="text-gray-500" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <SheetDescription className="flex flex-col gap-2 relative h-full py-2">
                  <SelectButton
                    data={businessTypeOptions}
                    placeHolder="Category"
                    setValue={value => selectFilterValue("category", value)}
                  />
                  <SelectButton
                    data={SortingData}
                    placeHolder="Sort By"
                    setValue={value => selectFilterValue("sort", value)}
                  />
                  <div>
                    <PlacesAutocompleteInput
                      value={filter.city}
                      onChange={value => selectFilterValue("city", value)}
                      form={methods}
                      fieldName="city"
                      placeholder="City"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="absolute bottom-3 w-full"
                  >
                    Apply Filters
                  </Button>
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="hidden lg:flex justify-end w-full lg:w-auto gap-3">
          <SelectButton
            data={businessTypeOptions}
            placeHolder="Category"
            setValue={value => selectFilterValue("category", value)}
          />
          <SelectButton
            data={SortingData}
            placeHolder="Sort By"
            setValue={value => selectFilterValue("sort", value)}
          />
          <div className="max-w-[200px]">
            <PlacesAutocompleteInput
              value={filter.city}
              onChange={value => selectFilterValue("city", value)}
              form={methods}
              fieldName="city"
              placeholder="City"
              popover
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Filters;
