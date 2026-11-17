"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ACHIEVEMENTS,
  LESSONS,
  PILLARS,
  SKILLS,
  type LessonId,
  type SkillId,
} from "@/data/lessons";
import { useMission } from "@/store/mission-store";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function PillarBadge({ pillar }: { pillar: (typeof PILLARS)[number]["id"] }) {
  const item = PILLARS.find((entry) => entry.id === pillar) ?? PILLARS[0];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9daf8] bg-aptus-soft px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-aptus">
      {item.label}
    </span>
  );
}

export function LearnPanel({
  lessonId,
  onReady,
}: {
  lessonId: LessonId;
  onReady: () => void;
}) {
  const lesson = LESSONS[lessonId];
  const markLessonRead = useMission((state) => state.markLessonRead);
  const lessonsRead = useMission((state) => state.lessonsRead);
  const already = lessonsRead.includes(lessonId);

  function finish() {
    markLessonRead(lessonId);
    onReady();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PillarBadge pillar="objetivo" />
        <PillarBadge pillar="aprendizado" />
      </div>

      <div className="panel overflow-hidden">
        <div className="relative overflow-hidden border-b border-line bg-ink px-5 py-6 text-white">
          <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 bg-aptus/30 [clip-path:polygon(18%_0,100%_0,100%_72%,0_100%)]" />
          <div className="pointer-events-none absolute -bottom-8 left-10 h-20 w-20 bg-warm/20 [clip-path:polygon(0_20%,100%_0,80%_100%,0_100%)]" />
          <p className="relative text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Objetivo da etapa</p>
          <h2 className="relative mt-1.5 text-lg font-extrabold leading-snug tracking-tight sm:text-xl">
            {lesson.objective}
          </h2>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="section-kicker">Aprendizado</p>
            <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-ink">{lesson.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{lesson.summary}</p>
          </div>

          <div>
            <p className="section-kicker">Regras que você precisa dominar</p>
            <ul className="mt-2.5 space-y-2">
              {lesson.rules.map((rule, index) => (
                <li key={rule} className="flex gap-3 rounded-panel border border-line bg-paper/80 px-3.5 py-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-aptus-soft text-[11px] font-extrabold text-aptus">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold leading-snug text-ink">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-panel border border-[#b7dfc4] bg-[#eef8f1] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ok">Exemplo correto</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{lesson.exampleGood}</p>
            </div>
            <div className="rounded-panel border border-[#ecc4be] bg-[#fdf4f3] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-bad">O que gera glosa</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{lesson.exampleBad}</p>
            </div>
          </div>

          {lesson.infoBlocks?.map((block) => (
            <div
              key={block.title}
              className={cn(
                "rounded-panel border px-4 py-4",
                block.tone === "warn"
                  ? "border-[#ecc4be] bg-[#fdf4f3]"
                  : "border-[#c9daf8] bg-aptus-soft/60",
              )}
            >
              <p
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.1em]",
                  block.tone === "warn" ? "text-bad" : "text-aptus",
                )}
              >
                {block.title}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-semibold leading-snug text-ink">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", block.tone === "warn" ? "bg-bad" : "bg-aptus")} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="rounded-panel border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink">
            Risco: {lesson.glosaRisk}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={finish}>
          {already ? "Ir para o desafio" : "Entendi — praticar agora"}
        </button>
        <p className="text-sm text-muted">Depois do aprendizado vem o desafio da etapa.</p>
      </div>
    </div>
  );
}

export function ChallengeHeader({ lessonId }: { lessonId: LessonId }) {
  const lesson = LESSONS[lessonId];
  return (
    <div className="mb-5 rounded-panel border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <PillarBadge pillar="desafio" />
        <PillarBadge pillar="habilidade" />
      </div>
      <p className="mt-3 text-[0.95rem] font-bold tracking-tight text-ink">Hora de praticar</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{lesson.challengeHint}</p>
      <p className="mt-2.5 text-xs font-semibold text-aptus">
        Habilidade em foco: {SKILLS.find((item) => item.id === lesson.skill)?.label} · +{lesson.skillGain} ao concluir
      </p>
    </div>
  );
}

export function useLessonPhase(lessonId: LessonId) {
  const lessonsRead = useMission((state) => state.lessonsRead);
  const [phase, setPhase] = useState<"learn" | "challenge">(lessonsRead.includes(lessonId) ? "challenge" : "learn");

  useEffect(() => {
    if (lessonsRead.includes(lessonId)) setPhase("challenge");
  }, [lessonId, lessonsRead]);

  return {
    phase,
    goChallenge: () => setPhase("challenge"),
    goLearn: () => setPhase("learn"),
  };
}

export function ModuleShell({
  lessonId,
  children,
}: {
  lessonId: LessonId;
  children: React.ReactNode;
}) {
  const { phase, goChallenge, goLearn } = useLessonPhase(lessonId);

  if (phase === "learn") {
    return <LearnPanel lessonId={lessonId} onReady={goChallenge} />;
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button type="button" className="text-xs font-bold text-aptus underline-offset-2 hover:underline" onClick={goLearn}>
          Rever aprendizado
        </button>
      </div>
      <ChallengeHeader lessonId={lessonId} />
      {children}
    </div>
  );
}

export function SkillBoard({ compact = false }: { compact?: boolean }) {
  const skills = useMission((state) => state.skills);

  return (
    <div className={cn("panel overflow-hidden", compact && "shadow-none")}>
      <div className="border-b border-line bg-[#f8fafc] px-4 py-3.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-aptus">Habilidades</p>
        <p className="mt-0.5 text-sm font-bold tracking-tight text-ink">Competências da missão</p>
      </div>
      <ul className="divide-y divide-line">
        {SKILLS.map((skill) => {
          const value = skills[skill.id] ?? 0;
          return (
            <li key={skill.id} className="px-4 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{skill.label}</p>
                  {!compact ? <p className="mt-0.5 text-[11px] text-muted">{skill.blurb}</p> : null}
                </div>
                <span className="text-sm font-extrabold tabular-nums text-aptus">{value}%</span>
              </div>
              <div className="progress-track mt-2.5">
                <div className="progress-fill transition-[width] duration-500" style={{ width: `${value}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AchievementsList({ unlockedOnly = false }: { unlockedOnly?: boolean }) {
  const unlocked = useMission((state) => state.achievements);
  const items = unlockedOnly ? ACHIEVEMENTS.filter((item) => unlocked.includes(item.id)) : ACHIEVEMENTS;

  if (unlockedOnly && items.length === 0) {
    return <p className="text-sm text-muted">Nenhuma conquista ainda — complete etapas e desafios.</p>;
  }

  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item) => {
        const on = unlocked.includes(item.id);
        return (
          <li
            key={item.id}
            className={cn(
              "rounded-panel border px-3.5 py-3.5",
              on ? "border-[#b7dfc4] bg-[#eef8f1] shadow-soft" : "border-line bg-white opacity-50",
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
              {on ? "Conquista" : "Bloqueada"}
            </p>
            <p className="mt-1 text-sm font-bold tracking-tight text-ink">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function PillarsMap() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {PILLARS.map((pillar) => (
        <div key={pillar.id} className="rounded-panel border border-line bg-white px-3.5 py-3.5 shadow-soft">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-aptus">{pillar.label}</p>
          <p className="mt-1.5 text-xs leading-snug text-muted">{pillar.tip}</p>
        </div>
      ))}
    </div>
  );
}

export function RewardModal({
  open,
  onNext,
}: {
  open: boolean;
  onNext: () => void;
}) {
  const lastReward = useMission((state) => state.lastReward);
  const clearLastReward = useMission((state) => state.clearLastReward);
  const achievement = ACHIEVEMENTS.find((item) => item.id === lastReward?.achievementId);
  const skillLabel = SKILLS.find((item) => item.id === lastReward?.skill)?.label;

  function continueNext() {
    clearLastReward();
    onNext();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div className="relative overflow-hidden border-b border-line bg-ink px-6 py-5 text-white">
              <div className="pointer-events-none absolute -right-4 -top-6 h-24 w-24 bg-accent/25 [clip-path:polygon(20%_0,100%_0,100%_70%,0_100%)]" />
              <p className="relative text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Conquista · Recompensa</p>
              <h2 className="relative mt-1.5 text-xl font-extrabold tracking-tight">Etapa concluída</h2>
            </div>
            <div className="space-y-3 px-6 py-5">
              {lastReward?.xp ? (
                <p className="rounded-panel border border-line bg-paper px-3.5 py-2.5 text-sm font-bold text-ink">
                  +{lastReward.xp} XP de conclusão de etapa
                </p>
              ) : null}
              {skillLabel && lastReward?.skillGain ? (
                <p className="rounded-panel border border-[#c9daf8] bg-aptus-soft px-3.5 py-2.5 text-sm font-bold text-aptus">
                  Habilidade {skillLabel} +{lastReward.skillGain}
                </p>
              ) : null}
              {achievement ? (
                <div className="rounded-panel border border-[#b7dfc4] bg-[#eef8f1] px-3.5 py-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ok">Selo desbloqueado</p>
                  <p className="mt-1 text-sm font-extrabold tracking-tight text-ink">{achievement.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{achievement.description}</p>
                </div>
              ) : (
                <p className="text-sm text-muted">Bom progresso. Siga para o próximo objetivo da missão.</p>
              )}
              <div className="pt-1">
                <button type="button" className="btn-primary" onClick={continueNext}>
                  Próxima etapa
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function skillAverage(skills: Record<SkillId, number>) {
  const values = Object.values(skills);
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
