"use client";

import { REPORTS } from "@/data/mission";
import { DecisionSequence } from "@/components/decisions";
import { StageBody, StageComplete, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";
import { StageArt } from "@/components/stage-art";

export default function ReportSelectionPage() {
  const exit = useStageExit("reports", "/mission/finance-approval");

  return (
    <StageBody
      stageIndex="02"
      kicker="Módulo · Relatórios"
      title="Escolha o relatório certo."
      lede="Primeiro aprenda as regras do fluxo. Depois pratique nas situações da missão."
    >
      <StageArt id="reports" className="mb-6 aspect-[16/9] max-h-48" />
      <ModuleShell lessonId="reports">
        <DecisionSequence items={REPORTS} noun="Situação" completeLabel="Concluir módulo" onComplete={exit.requestExit} />
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
