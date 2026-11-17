"use client";

import { useState } from "react";
import { FOUND_ERRORS } from "@/data/mission";
import { PrimaryButton, StageBody, StageComplete, cn, useStageExit } from "@/components/chrome";
import { ModuleShell } from "@/components/course";
import { StageArt } from "@/components/stage-art";
import { useMission } from "@/store/mission-store";

type Spot = "date" | "value" | "category" | "supplier" | "payment" | "cr" | "justification";

const COPY: Record<"date" | "value" | "category", string> = {
  date: FOUND_ERRORS[0].message,
  value: FOUND_ERRORS[1].message,
  category: FOUND_ERRORS[2].message,
};

export default function FindErrorPage() {
  const exit = useStageExit("errors", "/mission/meals");
  const foundErrors = useMission((state) => state.foundErrors);
  const markFound = useMission((state) => state.markFound);
  const [notice, setNotice] = useState("");
  const found = new Set(foundErrors);
  const foundCount = foundErrors.filter((id) => id in COPY).length;

  function inspect(spot: Spot) {
    if (spot === "supplier" || spot === "payment" || spot === "cr" || spot === "justification") {
      setNotice("Sem divergência neste campo.");
      return;
    }
    markFound(spot);
    setNotice(COPY[spot]);
  }

  return (
    <StageBody
      wide
      stageIndex="04"
      kicker="Módulo · Auditoria"
      title="Encontre o erro."
      lede="Estude como conferir lançamento × documento. Depois audite a prestação."
    >
      <StageArt id="errors" className="mb-6 aspect-[16/9] max-h-48" />
      <ModuleShell lessonId="errors">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Divergências {foundCount}/3</p>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Prestação em análise</p>
        </div>

        <div className="panel grid overflow-hidden md:grid-cols-2">
          <div className="border-b border-line p-4 md:border-b-0 md:border-r">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-aptus">Lançamento</p>
            <div className="space-y-2">
              <Field label="Data" value="12/11/2026" active={found.has("date")} onClick={() => inspect("date")} />
              <Field label="Estabelecimento" value="Via Norte Concessionária" onClick={() => inspect("supplier")} />
              <Field
                label="Categoria"
                value="Lanches e Refeições"
                active={found.has("category")}
                onClick={() => inspect("category")}
              />
              <Field label="Valor" value="R$ 59,90" active={found.has("value")} onClick={() => inspect("value")} />
              <Field label="Pagamento" value="Cartão corporativo" onClick={() => inspect("payment")} />
              <Field label="CR" value="Comercial · Filial SP" onClick={() => inspect("cr")} />
              <Field label="Justificativa" value="Pedágio no trajeto da visita" onClick={() => inspect("justification")} />
            </div>
          </div>
          <div className="bg-[#f7fbfe] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Documento anexado</p>
            <div className="mx-auto mt-4 max-w-xs rounded-xl border border-line bg-white px-4 py-5">
              <p className="text-[11px] font-bold tracking-[0.14em] text-muted">CUPOM FISCAL</p>
              <p className="mt-3 text-sm font-bold text-ink">Pedágio</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Estabelecimento</dt>
                  <dd>Via Norte</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Data</dt>
                  <dd className="font-semibold">10/11/2026</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Valor</dt>
                  <dd className="font-semibold">R$ 58,90</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {notice ? <p className="mt-4 text-sm font-semibold text-ink">{notice}</p> : null}
        <ul className="panel mt-4 overflow-hidden">
          {FOUND_ERRORS.map((error, index) => (
            <li
              key={error.id}
              className={cn(
                "px-4 py-2.5 text-sm",
                index > 0 && "border-t border-line",
                found.has(error.id) ? "text-ok" : "text-muted",
              )}
            >
              {found.has(error.id) ? error.message : "Divergência ainda não localizada"}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <PrimaryButton disabled={foundCount < 3} onClick={exit.requestExit}>
            Concluir módulo
          </PrimaryButton>
        </div>
      </ModuleShell>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}

function Field({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm",
        active ? "border-ok bg-[#f2faf5]" : "border-line bg-white hover:border-aptus",
      )}
    >
      <span className="text-muted">{label}</span>
      <span className="font-semibold tabular-nums text-ink">{value}</span>
    </button>
  );
}
