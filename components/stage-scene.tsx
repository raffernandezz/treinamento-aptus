export function StageMark({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
      <span className="rounded bg-[#fff1f1] px-1.5 py-0.5 text-ftd">{index}</span>
      <span>{label}</span>
    </div>
  );
}
