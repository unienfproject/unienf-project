"use client";

import { TrendingUp } from "lucide-react";

import type { RegistrationStats } from "@/app/_lib/actions/dashboard";

type RegistrationBarChartProps = {
  data?: RegistrationStats[];
  emptyMessage?: string;
  heightClassName?: string;
};

export default function RegistrationBarChart({
  data = [],
  emptyMessage = "Sem dados no período",
  heightClassName = "h-52",
}: RegistrationBarChartProps) {
  const maxRegistrations = Math.max(...data.map((item) => item.count), 1);

  if (!data.length) {
    return (
      <div className={`bg-muted/30 flex ${heightClassName} items-center justify-center rounded-xl`}>
        <div className="text-center">
          <TrendingUp className="text-primary mx-auto mb-3 h-12 w-12" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
      <div className={`relative ${heightClassName}`}>
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-t border-dashed border-slate-200" />
          ))}
        </div>
        <div
          className="relative grid h-full items-end gap-3"
          style={{
            gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
          }}
        >
          {data.map((item) => {
            const heightPct = (item.count / maxRegistrations) * 100;

            return (
              <div
                key={item.label}
                className="group relative flex h-full items-end"
              >
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full min-h-[10px] rounded-t-xl bg-gradient-to-t from-sky-600 to-sky-400 shadow-sm transition-all duration-200 group-hover:from-sky-700 group-hover:to-sky-500"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                      {item.count} alunos
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="mt-4 grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
        }}
      >
        {data.map((item) => (
          <span
            key={`${item.label}-label`}
            className="text-center text-xs font-medium whitespace-nowrap text-slate-600"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
