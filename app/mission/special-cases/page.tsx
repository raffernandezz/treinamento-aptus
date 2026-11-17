"use client";

import { SPECIAL } from "@/data/mission";
import { DecisionBlock } from "@/components/decisions";
import { PrimaryButton, StageBody, StageComplete, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";
import { StageArt } from "@/components/stage-art";
import { useMission } from "@/store/mission-store";

export default function SpecialCasesPage() {
  const exit = useStageExit("special", "/mission/manager-mode");
  const answers = useMission((state) => state.answers);
  const fuelReady = Boolean(answers["fuel-card"]?.resolved);
  const ready = SPECIAL.every((item) => answers[item.id]?.resolved);

  return (
    <StageBody
      wide
      stageIndex="06"
      kicker="Módulo · Exceções"
      title="Situações especiais."
      lede="Aprenda as regras fora do caminho padrão e a lista do que não reembolsa. Depois pratique."
    >
      <StageArt id="special" className="mb-6 aspect-[16/9] max-h-48" />
      <ModuleShell lessonId="special">
        <div className="grid gap-3 lg:grid-cols-2">
          <article className="panel p-4">
            <h2 className="text-[15px] font-bold tracking-tight">Abastecimento</h2>
            <div className="mt-3">
              <DecisionBlock item={SPECIAL[0]} plain />
            </div>
            {fuelReady ? (
              <div className="mt-4 border-t border-line pt-4">
                <DecisionBlock item={SPECIAL[1]} plain />
              </div>
            ) : null}
          </article>
          <article className="panel p-4">
            <h2 className="text-[15px] font-bold tracking-tight">Passagens e hospedagem</h2>
            <div className="mt-3">
              <DecisionBlock item={SPECIAL[2]} plain />
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <DecisionBlock item={SPECIAL[3]} plain />
            </div>
          </article>
          <article className="panel p-4 lg:col-span-2">
            <h2 className="text-[15px] font-bold tracking-tight">O que não pode ser reembolsado</h2>
            <p className="mt-1 text-sm text-muted">
              Mesmo com documento fiscal, a política veda estas despesas. Decida cada caso.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <DecisionBlock item={SPECIAL[4]} plain />
              <DecisionBlock item={SPECIAL[5]} plain />
              <DecisionBlock item={SPECIAL[6]} plain />
            </div>
          </article>
        </div>
        <div className="mt-4 flex justify-end">
          <PrimaryButton disabled={!ready} onClick={exit.requestExit}>
            Concluir módulo
          </PrimaryButton>
        </div>
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
