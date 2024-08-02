import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import TemplateContainer from "./_components/template-container";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <Link href={"/business/templates"}>
        <ChevronLeft className="mr-2 inline-block h-5 w-5" />
        Templates
      </Link>
      <TemplateContainer id={id} />
    </div>
  );
}
