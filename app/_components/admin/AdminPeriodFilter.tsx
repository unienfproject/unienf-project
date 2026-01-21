"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PeriodRangeButton from "./PeriodRangeButton";

export default function AdminPeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <PeriodRangeButton
      onApply={({ from, to }) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("from", from.toISOString());
        params.set("to", to.toISOString());
        params.delete("year");
        params.delete("month");
        router.push(`?${params.toString()}`);
      }}
    />
  );
}