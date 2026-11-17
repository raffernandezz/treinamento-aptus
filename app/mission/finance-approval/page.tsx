"use client";

import { useEffect, useState } from "react";
import { FINANCE, type DecisionItem } from "@/data/mission";
import { DecisionBlock } from "@/components/decisions";
import { PrimaryButton, StageBody, StageComplete, cn, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";
import { StageArt } from "@/components/stage-art";
import { useMission } from "@/store/mission-store";

const CARDS: Array<{ item: DecisionItem; title: string; lines: string[] }> = [
  {
    item: FINANCE[0],
    title: "Cupom fiscal",
    lines: ["Padaria Central Ltda", "CNPJ 12.345.678/0001-90", "Data 10/11/2026", "Total R$ 42,50"],
  },
  {
    item: FINANCE[1],
    title: "Comanda",
    lines: ["Mesa 12", "Garçom: 04", "Itens: 3", "Sem CNPJ / sem chave"],
  },
  {
    item: FINANCE[2],
    title: "PIX",
    lines: ["Transferência concluída", "Favorecido: Restaurante Sul", "Valor R$ 86,00", "Sem documento fiscal"],
  },
  {
    item: FINANCE[3],
    title: "Maquininha",
    lines: ["APROVADO", "Cartão •••• 4412", "Valor R$ 59,90", "Comprova pagamento"],
  },
];

function FlipDocument({ title, lines, item }: { title: string; lines: string[]; item: DecisionItem }) {
  const resolved = useMission((state) => Boolean(state.answers[item.id]?.resolved));
  const [flipped, setFlipped] = useState(resolved);

  useEffect(() => {
    if (resolved) setFlipped(true);
  }, [resolved]);

  return (
    <div className="flip-scene">
      <div className={cn("flip-card", flipped && "is-flipped")}>
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="flip-face panel flex min-h-[320px] w-full flex-col justify-between p-5 text-left"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-aptus">{title}</p>
            <div className="mt-3 rounded-xl border border-line bg-paper p-4">
              {lines.map((line) => (
                <p key={line} className="border-b border-line/80 py-2 text-sm text-ink last:border-b-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Virar comprovante</span>
        </button>
        <div className="flip-face flip-back panel min-h-[320px] overflow-auto p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-aptus">{title}</p>
          <div className="mt-3">
            <DecisionBlock item={item} plain />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const exit = useStageExit("finance", "/mission/find-error");
  const answers = useMission((state) => state.answers);
  const ready = FINANCE.every((item) => answers[item.id]?.resolved);

  return (
    <StageBody
      wide
      stageIndex="03"
      kicker="Módulo · Documentos"
      title="O financeiro aprovaria?"
      lede="Aprenda o que comprova despesa. Depois vire os comprovantes e decida."
    >
      <StageArt id="finance" className="mb-6 aspect-[16/9] max-h-48" />
      <ModuleShell lessonId="finance">
        <div className="grid gap-4 md:grid-cols-2">
          {CARDS.map((card) => (
            <FlipDocument key={card.item.id} title={card.title} lines={card.lines} item={card.item} />
          ))}
        </div>
        <div className="mt-6">
          <PrimaryButton disabled={!ready} onClick={exit.requestExit}>
            Concluir módulo
          </PrimaryButton>
        </div>
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
