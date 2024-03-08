"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { onBoarding } from "@/actions/(protected)/stripe/onboarding";
import { useRouter } from "next/navigation";
import { profileType } from "@/actions/_utils/types.type";
import CustomDialog from "@/components/shared/custom-dialog";
import UploadLogo from "./upload-logo";
import { Input } from "@/components/ui/input";
import PlacesAutocomplete from "react-places-autocomplete";

type propType = {
  user: profileType;
};

const ConnectToStripe = (props: propType) => {
  const navigate = useRouter();
  const [open, setOpen] = useState(false);
  const { user } = props;
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");

  return (
    <>
      <CustomDialog
        title="Business Details"
        className="w-[720px]"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className="rounded-sm bg-secondary-black p-4 pb-10 mb-5">
          <div className="m-auto flex w-[200px] md:max-w-[300px] items-center">
            <div className="relative flex flex-col gap-1 items-center">
              <span className="bg-white rounded-full h-8 w-8  text-black flex items-center justify-center">
                1
              </span>
              <span className="absolute whitespace-nowrap top-8 text-xs md:text-base">
                Enter Business Detail
              </span>
            </div>
            <div className={"flex-1  border-t border-divider"} />
            <div className="relative  flex flex-col gap-1 items-center">
              <span className="bg-white rounded-full h-8 w-8  text-black flex items-center justify-center">
                2
              </span>
              <span className="absolute whitespace-nowrap top-8 text-xs md:text-base">
                Payment Method
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <UploadLogo file={file} setFile={setFile} user={user} />
          <Input placeholder="Business Contact" />
          <PlacesAutocomplete
            value={address}
            onChange={e => {
              console.log("e", e);
              setAddress(e);
            }}
            onError={(e, b) => {
              console.log(b, e);
            }}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => {
              console.log("loading", suggestions);
              return (
                <div className="w-full">
                  <Input
                    {...getInputProps({
                      placeholder: "Address 1",
                    })}
                    className="w-full"
                  />
                  <div className="bg-background">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? "bg-accent"
                        : "bg-transparent";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? {
                            backgroundColor: "#f1f5f9",
                            cursor: "pointer",
                            color: "#000",
                          }
                        : {
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "#fff",
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

          <Input placeholder="Address 2" />
        </div>
      </CustomDialog>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Connect to Stripe
      </Button>
    </>
  );
};

export default ConnectToStripe;
