"use client";

import TemplateDataProvider from "@/lib/client-only/providers/template-data-provider";
import React from "react";
import TemplatesDataContainer from "./templates-data-container";

const TemplateProviderContainer = () => {
  return (
    <TemplateDataProvider>
      <TemplatesDataContainer />
    </TemplateDataProvider>
  );
};

export default TemplateProviderContainer;
