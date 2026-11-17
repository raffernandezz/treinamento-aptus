import Image from "next/image";

export function BrandLogo({
  className,
  size = 44,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={["inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black", className]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/ftd-logo.webp"
        alt="FTD Educação"
        width={size}
        height={size}
        className="h-full w-full object-contain p-[10%]"
        priority
      />
    </span>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <BrandLogo size={compact ? 40 : 48} />
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">FTD Educação</p>
        <p className="text-xs text-muted">{compact ? "TREINAMENTO APTUS" : "Plataforma de treinamentos"}</p>
      </div>
    </div>
  );
}
