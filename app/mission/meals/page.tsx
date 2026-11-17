"use client";

import { useState } from "react";
import { MEALS } from "@/data/mission";
import { DecisionBlock } from "@/components/decisions";
import { PrimaryButton, StageBody, StageComplete, cn, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";
import { StageArt } from "@/components/stage-art";
import { useMission } from "@/store/mission-store";

const TABS = [
  { id: "limite", label: "Limite", item: MEALS[0] },
  { id: "cliente", label: "Cliente", item: MEALS[1] },
  { id: "equipe", label: "Compartilhada", item: MEALS[2] },
  { id: "alcool", label: "Álcool", item: MEALS[3] },
];

export default function MealsPage() {
  const exit = useStageExit("meals", "/mission/special-cases");
  const answers = useMission((state) => state.answers);
  const [tab, setTab] = useState(TABS[0].id);
  const current = TABS.find((item) => item.id === tab) ?? TABS[0];
  const ready = MEALS.every((item) => answers[item.id]?.resolved);

  return (
    <StageBody
      stageIndex="05"
      kicker="Módulo · Políticas"
      title="Essa refeição passa?"
      lede="Aprenda o limite, as exceções e o que não reembolsa. Depois decida os lançamentos de alimentação."
    >
      <StageArt id="meals" className="mb-6 aspect-[16/9] max-h-48" />
      <ModuleShell lessonId="meals">
        <div className="mb-3 grid grid-cols-2 border border-line sm:grid-cols-4" role="tablist">
          {TABS.map((item, index) => {
            const done = Boolean(answers[item.item.id]?.resolved);
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(item.id)}
                className={cn(
                  "px-2 py-2.5 text-[12px] font-bold",
                  index > 0 && "border-l border-line",
                  index >= 2 && "border-t border-line sm:border-t-0",
                  selected ? "bg-ink text-white" : "bg-white text-ink",
                )}
              >
                {item.label}
                {done ? " ✓" : ""}
              </button>
            );
          })}
        </div>
        <DecisionBlock key={current.item.id} item={current.item} />
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
