"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CHALLENGE, MEAL_DAILY_LIMIT, money, toScore } from "@/data/mission";
import { furthestUnlocked, stageFromPath, STAGES } from "@/lib/stages";
import { useMission } from "@/store/mission-store";
import { RewardModal, skillAverage } from "@/components/course";
import { BrandLogo } from "@/components/brand";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function MissionHeader() {
  const pathname = usePathname();
  const stage = stageFromPath(pathname);
  const rawScore = useMission((state) => state.rawScore);
  const answers = useMission((state) => state.answers);
  const hydrated = useMission((state) => state.hydrated);
  const skills = useMission((state) => state.skills);
  const achievements = useMission((state) => state.achievements);

  if (!stage) return null;

  const challengeDone = CHALLENGE.filter((item) => answers[item.id]?.resolved).length;
  const progress = stage.id === "challenge" ? (challengeDone >= 4 ? 90 : 80) : stage.progress;
  const stageName =
    stage.id === "challenge" && challengeDone >= 4 ? "Desafio final · 2ª parte" : stage.name;
  const score = hydrated ? toScore(rawScore) : 0;
  const showProgress = stage.id !== "policies";
  const mastery = skillAverage(skills);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo size={34} className="shrink-0 ring-1 ring-line" />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold tracking-[0.08em] text-muted">TREINAMENTO APTUS</p>
              <p className="truncate text-[0.95rem] font-bold tracking-tight text-ink">
                {stage.id === "policies"
                  ? "Políticas corporativas"
                  : `Etapa ${stage.etapa} de 10 · ${stageName}`}
              </p>
            </div>
          </div>
          {showProgress ? (
            <div className="flex items-center gap-2">
              <div className="stat-chip hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Domínio</p>
                <p className="text-sm font-extrabold tabular-nums text-ink">{mastery}%</p>
              </div>
              <div className="stat-chip">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">XP</p>
                <p className="text-sm font-extrabold tabular-nums text-ink">{score}</p>
              </div>
              <div className="stat-chip">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Selos</p>
                <p className="text-sm font-extrabold tabular-nums text-ink">{achievements.length}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {showProgress ? (
        <div className="progress-track rounded-none">
          <motion.div
            className="progress-fill"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
      ) : null}
    </header>
  );
}

export function StageOutline() {
  const pathname = usePathname();
  const completedStages = useMission((state) => state.completedStages);
  const current = stageFromPath(pathname);
  const path = STAGES.filter((stage) => stage.id !== "policies");
  const done = new Set(completedStages);

  return (
    <aside className="hidden w-[260px] shrink-0 xl:block">
      <div className="sticky top-[5.25rem] overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="bg-ink px-4 py-4 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">Missão Sem Glosa</p>
          <p className="mt-1 text-sm font-bold leading-snug">Roteiro do treinamento</p>
          <p className="mt-2 text-[11px] font-semibold text-white/65">
            {current && current.id !== "policies" ? `${current.progress}% concluído` : "100% concluído"}
          </p>
        </div>
        <ol className="max-h-[calc(100vh-11rem)] overflow-auto py-2">
          {path.map((stage) => {
            const complete = done.has(stage.id);
            const active = current?.id === stage.id;
            return (
              <li
                key={stage.id}
                className={cn(
                  "mx-2 flex items-start gap-2.5 rounded-xl px-2.5 py-2.5",
                  active && "bg-[#f3f5f8]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-extrabold",
                    complete
                      ? "border-warm bg-warm text-white"
                      : active
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-muted",
                  )}
                >
                  {complete ? "✓" : stage.etapa}
                </span>
                <div className="min-w-0">
                  <p className={cn("truncate text-sm font-semibold", active ? "text-ink" : "text-ink/80")}>
                    {stage.name}
                  </p>
                  <p className="text-[11px] text-muted">
                    {complete ? "Concluída" : active ? "Em andamento" : "Próxima"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

export function StageBody({
  kicker,
  title,
  lede,
  wide,
  stageIndex,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  wide?: boolean;
  stageIndex?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("learn-canvas w-full pb-24 pt-2", wide ? "max-w-4xl" : "max-w-2xl")}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {stageIndex ? (
          <span className="rounded-full bg-aptus-soft px-2.5 py-1 text-[11px] font-extrabold text-aptus">
            Etapa {stageIndex}
          </span>
        ) : null}
        <p className="section-kicker">{kicker}</p>
      </div>
      <h1 className="text-center text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.05rem]">
        {title}
      </h1>
      {lede ? (
        <p className="mx-auto mt-3 max-w-2xl text-center text-[1rem] leading-relaxed text-muted">{lede}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Feedback({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className={ok ? "feedback-ok" : "feedback-bad"}>
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white",
            ok ? "bg-ok" : "bg-bad",
          )}
        >
          {ok ? "✓" : "!"}
        </span>
        <div>
          <p className="text-sm font-bold text-ink">
            {ok ? "Resposta correta · +10 XP" : "Ainda não — revise e tente de novo"}
          </p>
          <div className="mt-1 text-sm leading-relaxed text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function MealLedger() {
  const day1 = 80;
  const day2 = 140;
  const total = day1 + day2;
  const limit = MEAL_DAILY_LIMIT * 2;
  return (
    <div className="mt-4 overflow-hidden rounded-panel border border-line bg-white shadow-soft">
      <div className="grid grid-cols-2 text-sm">
        {[
          ["Dia 1", money(day1)],
          ["Dia 2", money(day2)],
          ["Total", money(total)],
          [`Limite ${MEAL_DAILY_LIMIT} × 2`, money(limit)],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={cn(
              "flex items-center justify-between px-4 py-3",
              index % 2 === 0 ? "border-r border-line" : "",
              index < 2 ? "border-b border-line" : "",
            )}
          >
            <span className="text-muted">{label}</span>
            <span className="font-bold tabular-nums text-ink">{value}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-line bg-[#eef8f1] px-4 py-3 text-sm font-semibold text-ok">
        {total} &lt; {limit}. Dentro da política.
      </p>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  glow?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className="btn-primary">
      {children}
    </button>
  );
}

export function StageComplete({ open, onNext }: { open: boolean; onNext: () => void }) {
  return <RewardModal open={open} onNext={onNext} />;
}

export function useStageExit(stageId: string, nextPath: string) {
  const completeStage = useMission((state) => state.completeStage);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function requestExit() {
    completeStage(stageId);
    setOpen(true);
  }

  function goNext() {
    router.push(nextPath);
  }

  return { open, requestExit, goNext };
}

export function MissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useMission((state) => state.hydrated);
  const completedStages = useMission((state) => state.completedStages);

  useEffect(() => {
    if (!hydrated) return;
    const current = stageFromPath(pathname);
    if (!current) return;
    const allowed = furthestUnlocked(useMission.getState().completedStages);
    const currentIndex = STAGES.findIndex((item) => item.id === current.id);
    const allowedIndex = STAGES.findIndex((item) => item.id === allowed.id);
    if (currentIndex > allowedIndex) router.replace(allowed.path);
  }, [hydrated, pathname, completedStages, router]);

  if (!hydrated) {
    return <div className="min-h-screen bg-paper" />;
  }

  return (
    <>
      <MissionHeader />
      <main className="min-h-screen bg-paper pt-[4.75rem]">
        <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 lg:px-8">
          <StageOutline />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
    </>
  );
}

export function MedalMark({ id }: { id: "gold" | "silver" | "bronze" | "review" }) {
  const map = {
    gold: { label: "Ouro", tone: "bg-[#fff6db] text-[#8a6a00] border-[#f0d98a]" },
    silver: { label: "Prata", tone: "bg-[#f0f3f6] text-[#4b5563] border-[#cfd6de]" },
    bronze: { label: "Bronze", tone: "bg-[#f8efe6] text-[#8a5524] border-[#e2c4a4]" },
    review: { label: "Revisão", tone: "bg-paper text-muted border-line" },
  } as const;
  const medal = map[id];

  return (
    <div className={cn("rounded-panel border px-3.5 py-2.5 text-right shadow-soft", medal.tone)}>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-80">Medalha</p>
      <p className="mt-1 text-lg font-extrabold tracking-tight">{medal.label}</p>
    </div>
  );
}
