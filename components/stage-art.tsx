import Image from "next/image";

const ARTS: Record<string, { src: string; alt: string }> = {
  cover: { src: "/mission/cover-hero.jpg", alt: "TREINAMENTO APTUS — missão de prestação de contas" },
  intro: { src: "/mission/intro.jpg", alt: "Início da missão de prestação de contas" },
  reports: { src: "/mission/reports.jpg", alt: "Seleção de relatórios de despesa" },
  finance: { src: "/mission/finance.jpg", alt: "Validação de documentos fiscais" },
  errors: { src: "/mission/audit.jpg", alt: "Auditoria de lançamento e divergências" },
  meals: { src: "/mission/meals.jpg", alt: "Política de alimentação e limites" },
  special: { src: "/mission/special.jpg", alt: "Situações especiais e vedações" },
  result: { src: "/mission/result.jpg", alt: "Resultado e conquista do treinamento" },
};

export function StageArt({
  id,
  className = "",
  priority = false,
}: {
  id: keyof typeof ARTS;
  className?: string;
  priority?: boolean;
}) {
  const art = ARTS[id];
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-ink shadow-soft ${className}`}>
      <Image
        src={art.src}
        alt={art.alt}
        width={1600}
        height={900}
        className="h-full w-full object-cover"
        priority={priority}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
    </div>
  );
}

export function CoverHeroArt() {
  return (
    <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px]">
      <Image
        src="/mission/cover-hero.jpg"
        alt="TREINAMENTO APTUS"
        fill
        className="object-cover object-right"
        priority
        sizes="(max-width: 1024px) 100vw, 72rem"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
    </div>
  );
}
