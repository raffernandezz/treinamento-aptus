"use client";

import { CHALLENGE } from "@/data/mission";
import { DecisionSequence } from "@/components/decisions";
import { StageBody, StageComplete, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";

export default function ChallengePage() {
  const exit = useStageExit("challenge", "/mission/result");

  return (
    <StageBody
      stageIndex="09"
      kicker="Desafio final"
      title="Feche a prestação."
      lede="Revise o que importa. Depois integre tudo em oito decisões — a primeira escolha conta."
    >
      <ModuleShell lessonId="challenge">
        <DecisionSequence
          items={CHALLENGE}
          noun="Decisão"
          nextLabel="Próxima decisão"
          completeLabel="Ver resultado"
          onComplete={exit.requestExit}
        />
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
