"use client";

import { MANAGER } from "@/data/mission";
import { DecisionSequence } from "@/components/decisions";
import { StageBody, StageComplete, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";

export default function ManagerPage() {
  const exit = useStageExit("manager", "/mission/checklist");

  return (
    <StageBody
      stageIndex="07"
      kicker="Módulo · Gestor"
      title="Dê o destino da prestação."
      lede="Aprenda quando aprovar, reprovar ou regularizar. Depois julgue quatro casos."
    >
      <ModuleShell lessonId="manager">
        <DecisionSequence
          items={MANAGER}
          noun="Caso"
          nextLabel="Próximo caso"
          completeLabel="Concluir módulo"
          onComplete={exit.requestExit}
        />
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
