import { Input } from "@/components/input";
import GridPageLayout from "@/components/grid-page/grid-page-layout";
import { Card } from "@/components/ui/card";
import React from "react";

export default function BrowsePage() {
  return (
    <GridPageLayout>
      <div className="container mx-auto mt-4">
        <div className="flex flex-col gap-2">
          <Input className="md:text-xl" />
          <Card></Card>
        </div>
      </div>
    </GridPageLayout>
  );
}
