"use client";

import { useEffect } from "react";
import { ALL_DECISIONS, MEDALS, medalFor, toScore } from "@/data/mission";
import { MedalMark, PrimaryButton, StageComplete, useStageExit } from "@/components/chrome";
import { AchievementsList, SkillBoard } from "@/components/course";
import { BrandLogo } from "@/components/brand";
import { StageArt } from "@/components/stage-art";
import { completeLesson, saveProgress, saveScore } from "@/lib/scorm";
import { useMission } from "@/store/mission-store";

export default function ResultPage() {
  const exit = useStageExit("result", "/mission/policies");
  const hydrated = useMission((state) => state.hydrated);
  const rawScore = useMission((state) => state.rawScore);
  const answers = useMission((state) => state.answers);
  const achievements = useMission((state) => state.achievements);
  const score = toScore(rawScore);
  const medal = medalFor(score);
  const copy = MEDALS[medal];
  const missed = [...new Set(ALL_DECISIONS.filter((item) => answers[item.id]?.missed).map((item) => item.topic))];

  useEffect(() => {
    if (!hydrated) return;
    const current = toScore(useMission.getState().rawScore);
    saveScore(current);
    saveProgress(100);
  }, [hydrated]);

  return (
    <section className="learn-canvas w-full max-w-4xl pb-10 pt-2">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-aptus">Recompensa final</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">Resultado do curso</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        XP, medalha, habilidades e conquistas — o fechamento da Missão Sem Glosa.
      </p>

      <StageArt id="result" className="mt-6 aspect-[16/9] max-h-52" />

      <div className="panel mt-6 overflow-hidden">
        <div className="relative flex items-center gap-3 overflow-hidden bg-ink px-6 py-5 text-white">
          <div className="pointer-events-none absolute -right-4 -top-6 h-28 w-28 bg-aptus/30 [clip-path:polygon(18%_0,100%_0,100%_78%,0_100%)]" />
          <BrandLogo size={56} className="relative shrink-0" />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Certificado de desempenho</p>
            <p className="mt-1 text-lg font-bold tracking-tight">TREINAMENTO APTUS · Missão Sem Glosa</p>
          </div>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Pontuação (XP)</p>
              <p className="mt-1 text-6xl font-extrabold tabular-nums tracking-tight text-ink">{score}</p>
              <p className="mt-1 text-xs font-semibold text-muted">
                de 100 · {achievements.length} selos desbloqueados
              </p>
            </div>
            <MedalMark id={medal} />
          </div>
          <h2 className="mt-6 text-xl font-extrabold tracking-tight text-ink">{copy.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy.message}</p>
          {missed.length > 0 ? (
            <div className="mt-5 border-t border-line pt-5">
              <p className="section-kicker">Recomendado revisar</p>
              <ul className="mt-2 space-y-1">
                {missed.map((topic) => (
                  <li key={topic} className="text-sm text-ink">
                    — {topic}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 rounded-panel border border-[#b7dfc4] bg-[#eef8f1] px-4 py-3 text-sm font-semibold text-ok">
              Nenhuma revisão crítica. Prestação no padrão sem glosa.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SkillBoard />
        <div className="panel p-4 sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-aptus">Conquistas</p>
          <p className="mt-1 text-sm font-bold tracking-tight text-ink">Selos da missão</p>
          <div className="mt-3">
            <AchievementsList />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton
          onClick={() => {
            completeLesson();
            exit.requestExit();
          }}
        >
          Ver políticas
        </PrimaryButton>
      </div>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </section>
  );
}
