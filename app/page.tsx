"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LearningPath, ObjectivesList, SkillPreview } from "@/components/hero";
import { AchievementsList, PillarsMap } from "@/components/course";
import { PrimaryButton } from "@/components/chrome";
import { BrandLockup } from "@/components/brand";
import { CoverHeroArt } from "@/components/stage-art";
import { furthestUnlocked } from "@/lib/stages";
import { toScore } from "@/data/mission";
import { useMission } from "@/store/mission-store";

export default function CoverPage() {
  const router = useRouter();
  const hydrated = useMission((state) => state.hydrated);
  const completedStages = useMission((state) => state.completedStages);
  const lessonsRead = useMission((state) => state.lessonsRead);
  const rawScore = useMission((state) => state.rawScore);
  const answers = useMission((state) => state.answers);
  const skills = useMission((state) => state.skills);
  const achievements = useMission((state) => state.achievements);
  const reset = useMission((state) => state.reset);
  const hasProgress = completedStages.length > 0 || rawScore > 0 || Object.keys(answers).length > 0;
  const score = toScore(rawScore);

  function start() {
    router.push("/mission/intro");
  }

  function resume() {
    router.push(furthestUnlocked(completedStages).path);
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <BrandLockup />
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
            <span className="rounded-lg border border-line bg-paper px-3 py-1.5">Curso gamificado</span>
            <span className="rounded-lg border border-line bg-paper px-3 py-1.5">~25 min</span>
            <span className="rounded-lg border border-line bg-paper px-3 py-1.5">10 etapas</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="relative overflow-hidden text-white">
            <CoverHeroArt />
            <div className="absolute inset-0 flex flex-col justify-end px-6 py-8 sm:justify-center sm:px-8 sm:py-11">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Missão Sem Glosa</p>
              <h1 className="mt-2.5 max-w-xl text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                TREINAMENTO APTUS
              </h1>
              <p className="mt-2.5 max-w-xl text-base font-medium text-white/90">
                Reembolsos, Adiantamentos e Prestação de Contas
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                Curso completo: aprendizado, desafio prático, habilidades, conquistas e recompensas —
                no padrão premium de uma plataforma de treinamentos corporativos.
              </p>
              {hasProgress ? (
                <div className="mt-5 flex flex-wrap gap-2.5 text-sm font-semibold">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{score} XP</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                    {completedStages.length}/10 etapas
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                    {achievements.length} selos
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-8">
              <div>
                <h2 className="section-kicker">Como a gamificação funciona</h2>
                <div className="mt-3">
                  <PillarsMap />
                </div>
              </div>

              <div>
                <h2 className="section-kicker">Objetivos de aprendizagem</h2>
                <div className="mt-3">
                  <ObjectivesList />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <PrimaryButton onClick={hasProgress ? resume : start} disabled={!hydrated}>
                  {hasProgress ? "Continuar curso" : "Iniciar curso"}
                </PrimaryButton>
                {hasProgress ? (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      reset();
                      start();
                    }}
                  >
                    Recomeçar
                  </button>
                ) : (
                  <p className="text-sm text-muted">Progresso, XP e selos ficam neste navegador</p>
                )}
              </div>

              {achievements.length > 0 ? (
                <div>
                  <h2 className="section-kicker">Suas conquistas</h2>
                  <div className="mt-3">
                    <AchievementsList unlockedOnly />
                  </div>
                </div>
              ) : null}
            </section>

            <section className="space-y-4">
              <LearningPath completed={completedStages} lessonsRead={lessonsRead} />
              <SkillPreview skills={skills} />
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hydrated && hasProgress ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-lift">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-aptus">Curso em andamento</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-ink">Continuar de onde parou?</h2>
              <p className="mt-2 text-sm text-muted">
                XP, habilidades e conquistas estão salvos neste navegador.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <PrimaryButton onClick={resume}>Continuar</PrimaryButton>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    reset();
                    start();
                  }}
                >
                  Recomeçar
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
