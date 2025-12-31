type Props = {
  label: string;
  variant: "green" | "yellow" | "blue" | "gray" | "red";
};

export default function StatusBadge({ label, variant }: Props) {
  const classes =
    variant === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : variant === "yellow"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : variant === "blue"
          ? "bg-sky-50 text-sky-700 border-sky-100"
          : variant === "red"
            ? "bg-red-50 text-red-700 border-red-100"
            : "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <span className={`rounded-full border px-2 py-1 text-xs ${classes}`}>
      {label}
    </span>
  );
}
