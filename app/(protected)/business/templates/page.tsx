import React from "react";
import AddTemplate from "./_components/add-template";
import TemplatesDataContainer from "./_components/templates-data-container";
import { LocaleProvider } from "@/lib/client-only/providers/locale";
import { getLocale } from "@/lib/server-only/headers/get-locale";
import TemplateDataProvider from "@/lib/client-only/providers/template-data-provider";
import TemplateProviderContainer from "./_components/templates-provider-container";

export default function Page() {
  const locale = getLocale();

  return (
    <LocaleProvider locale={locale}>
      <div>
        <div className="w-full flex items-center justify-between">
          <h1 className="truncate text-2xl font-semibold md:text-3xl">
            Templates
          </h1>
          <AddTemplate />
        </div>
        <TemplateProviderContainer />
      </div>
    </LocaleProvider>
  );
}
