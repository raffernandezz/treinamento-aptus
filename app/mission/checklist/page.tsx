"use client";

import { CHECKLIST } from "@/data/mission";
import { StageBody, StageComplete, cn, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";
import { useMission } from "@/store/mission-store";

export default function ChecklistPage() {
  const exit = useStageExit("checklist", "/mission/final-challenge");
  const checklist = useMission((state) => state.checklist);
  const toggleCheck = useMission((state) => state.toggleCheck);
  const ready = CHECKLIST.every((item) => checklist.includes(item.id));

  return (
    <StageBody
      stageIndex="08"
      kicker="Módulo · Envio"
      title="Confira a prestação."
      lede="Revise o checklist de blindagem. Depois marque cada ponto que você realmente conferiu."
    >
      <ModuleShell lessonId="checklist">
        <ul className="panel overflow-hidden">
          {CHECKLIST.map((item, index) => {
            const done = checklist.includes(item.id);
            return (
              <li key={item.id} className={index > 0 ? "border-t border-line" : ""}>
                <button
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className={cn("flex w-full items-center gap-3 px-4 py-3.5 text-left", done && "bg-[#f2faf5]")}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded border text-[11px]",
                      done ? "border-ok bg-ok text-white" : "border-line bg-white",
                    )}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span className="text-sm font-semibold text-ink">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <button type="button" className="btn-send" disabled={!ready} onClick={exit.requestExit}>
            Enviar prestação
          </button>
        </div>
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
