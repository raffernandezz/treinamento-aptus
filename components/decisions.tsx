"use client";

import { useEffect, useState } from "react";
import type { DecisionItem } from "@/data/mission";
import { useMission } from "@/store/mission-store";
import { Feedback, MealLedger, PrimaryButton, cn } from "@/components/chrome";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function DecisionBlock({ item, plain = false }: { item: DecisionItem; plain?: boolean }) {
  const record = useMission((state) => state.answers[item.id]);
  const registerAnswer = useMission((state) => state.registerAnswer);
  const [rejected, setRejected] = useState<string[]>([]);
  const resolved = Boolean(record?.resolved);

  useEffect(() => {
    setRejected([]);
  }, [item.id]);

  function choose(optionId: string) {
    if (resolved) return;
    const result = registerAnswer(item.id, optionId === item.correctOptionId);
    if (!result.ok) {
      setRejected((current) => (current.includes(optionId) ? current : [...current, optionId]));
    }
  }

  return (
    <div className={plain ? "" : "panel p-5 sm:p-7"}>
      {item.detail ? <p className="text-sm leading-relaxed text-muted">{item.detail}</p> : null}
      <p
        className={cn(
          "text-[1.15rem] font-bold leading-snug tracking-tight text-ink sm:text-[1.25rem]",
          item.detail && "mt-2",
        )}
      >
        {item.prompt}
      </p>
      {item.facts ? (
        <dl className="mt-4 overflow-hidden rounded-panel border border-line bg-paper/40">
          {item.facts.map((fact, index) => {
            const [label, ...rest] = fact.split(": ");
            return (
              <div
                key={fact}
                className={cn(
                  "flex items-start justify-between gap-4 px-3.5 py-2.5 text-sm",
                  index > 0 && "border-t border-line",
                )}
              >
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-semibold text-ink">{rest.join(": ")}</dd>
              </div>
            );
          })}
        </dl>
      ) : null}
      <div className="mt-5 grid gap-3">
        {item.options.map((option, index) => {
          const picked = resolved && option.id === item.correctOptionId;
          const wrong = rejected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={resolved}
              onClick={() => choose(option.id)}
              className={cn("option-btn", picked && "is-ok", wrong && "is-bad", resolved && !picked && "opacity-45")}
            >
              <span className="opt-key">{LETTERS[index]}</span>
              <span className="flex-1 pr-1">{option.label}</span>
            </button>
          );
        })}
      </div>
      {record?.missed || resolved ? (
        <Feedback ok={resolved}>{resolved ? item.success : item.failure}</Feedback>
      ) : null}
      {record?.resolved && record.missed ? (
        <p className="mt-3 text-xs text-muted">A primeira escolha não entrou na pontuação.</p>
      ) : null}
      {item.extra === "meal-math" && (record?.missed || resolved) ? <MealLedger /> : null}
    </div>
  );
}

export function DecisionSequence({
  items,
  noun,
  completeLabel,
  nextLabel = "Próxima situação",
  onComplete,
}: {
  items: DecisionItem[];
  noun: string;
  completeLabel: string;
  nextLabel?: string;
  onComplete: () => void;
}) {
  const answers = useMission((state) => state.answers);
  const hydrated = useMission((state) => state.hydrated);
  const [index, setIndex] = useState(0);
  const [aligned, setAligned] = useState(false);

  useEffect(() => {
    if (!hydrated || aligned) return;
    const open = items.findIndex((item) => !answers[item.id]?.resolved);
    setIndex(open === -1 ? items.length - 1 : open);
    setAligned(true);
  }, [aligned, answers, hydrated, items]);

  const item = items[index];
  const currentResolved = Boolean(answers[item.id]?.resolved);
  const allResolved = items.every((entry) => answers[entry.id]?.resolved);
  const last = index === items.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="section-kicker">
          {noun} {index + 1} de {items.length}
        </p>
        <p className="rounded-full bg-aptus-soft px-2.5 py-1 text-[11px] font-bold text-aptus">
          +10 XP se acertar de primeira
        </p>
      </div>
      <DecisionBlock key={item.id} item={item} />
      <div className="mt-6 flex justify-end">
        {allResolved && last ? <PrimaryButton onClick={onComplete}>{completeLabel}</PrimaryButton> : null}
        {currentResolved && !last ? (
          <PrimaryButton onClick={() => setIndex((value) => value + 1)}>{nextLabel}</PrimaryButton>
        ) : null}
      </div>
    </div>
  );
}
