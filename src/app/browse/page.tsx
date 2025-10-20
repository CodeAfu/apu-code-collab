import GridPageLayout from "@/components/grid-page/grid-page-layout";
import { Card } from "@/components/ui/card";
import React from "react";
import SearchRepository from "./_components/search-repository";

export default function BrowsePage() {
  return (
    <GridPageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <SearchRepository />
          <Card></Card>
        </div>
      </div>
    </GridPageLayout>
  );
}
