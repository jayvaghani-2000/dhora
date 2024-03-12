import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { Input } from "../ui/input";
import clsx from "clsx";
import { FormField, FormItem, FormMessage, FormControl } from "../ui/form";

type propType = {
  value: string;
  onChange: (value: string) => void;
  form: any;
  defaultValue?: string;
  fieldName: string;
  placeholder?: string;
};

function PlacesAutocompleteInput({
  value,
  onChange,
  form,
  defaultValue,
  fieldName,
  placeholder = "Address",
}: propType): React.ReactNode {
  const [isTouched, setIsTouched] = useState(false);

  return (
    <PlacesAutocomplete
      value={value}
      onChange={e => {
        setIsTouched(true);
        onChange(e);
      }}
      onSelect={e => {
        form.setValue(fieldName, e);
        onChange(e);
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        const inputDefaultValue = isTouched ? "" : defaultValue;
        return (
          <div className="w-full">
            <FormField
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      className="h-9 disabled:opacity-100"
                      {...getInputProps({
                        placeholder: placeholder,
                      })}
                      value={getInputProps().value || inputDefaultValue}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5" />
                </FormItem>
              )}
            />
            <div
              className={clsx({
                "bg-background rounded-md": true,
                "border  border-input p-1": loading || suggestions.length > 0,
              })}
            >
              {loading && <div className="px-3 py-1">Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "bg-accent text-white px-3 py-1 rounded-md"
                  : "bg-transparent px-3 py-1 rounded-md";

                const style = {
                  cursor: "pointer",
                };

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={suggestion.placeId}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
}

export default PlacesAutocompleteInput;
