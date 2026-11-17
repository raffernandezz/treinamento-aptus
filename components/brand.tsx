import Image from "next/image";

export function BrandLogo({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/brand/ftd-logo.webp"
      alt="FTD Educação"
      width={size}
      height={size}
      className={["rounded-lg object-contain", className].filter(Boolean).join(" ")}
      priority
    />
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <BrandLogo size={compact ? 36 : 44} />
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">FTD Educação</p>
        <p className="text-xs text-muted">{compact ? "TREINAMENTO APTUS" : "Plataforma de treinamentos"}</p>
      </div>
    </div>
  );
}
