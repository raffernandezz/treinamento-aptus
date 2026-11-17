"use client";

import { PrimaryButton, StageBody, StageComplete, useStageExit } from "@/components/chrome";
import { PillarsMap, SkillBoard } from "@/components/course";
import { StageArt } from "@/components/stage-art";

const TOPICS = [
  { title: "Reembolsos", tip: "Quando e como solicitar" },
  { title: "Adiantamentos", tip: "Viagem com valor antecipado" },
  { title: "Aprovações", tip: "Olhar do financeiro e do gestor" },
  { title: "Prestação de Contas", tip: "Fechar sem divergência" },
  { title: "Documentação", tip: "O que comprova a despesa" },
];

export default function IntroPage() {
  const exit = useStageExit("intro", "/mission/report-selection");

  return (
    <StageBody
      stageIndex="01"
      kicker="Briefing da missão"
      title="Bem-vindo ao curso Missão Sem Glosa."
      lede="Isto não é um quiz solto. Em cada etapa você aprende a regra, pratica em desafio real, sobe uma habilidade e desbloqueia conquistas."
    >
      <StageArt id="intro" className="mb-6 aspect-[16/9] max-h-56" priority />
      <div className="mb-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">Os 6 pilares deste treinamento</p>
        <PillarsMap />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden">
          <div className="border-b border-line bg-[#f3f8fc] px-4 py-3">
            <p className="text-sm font-bold text-ink">Escopo do curso</p>
            <p className="text-xs text-muted">Mesma lógica de decisão do Aptus — sem clonar a tela do sistema.</p>
          </div>
          <ul>
            {TOPICS.map((topic, index) => (
              <li
                key={topic.title}
                className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? "border-t border-line" : ""}`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf4fb] text-[11px] font-extrabold text-aptus">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{topic.title}</p>
                  <p className="text-xs text-muted">{topic.tip}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <SkillBoard compact />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          ["Ciclo por etapa", "Aprender → Desafiar"],
          ["Recompensa", "XP + selos + skills"],
          ["Objetivo final", "Prestação sem glosa"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{label}</p>
            <p className="mt-1 text-sm font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={exit.requestExit}>Começar aprendizado</PrimaryButton>
      </div>
      <StageComplete open={exit.open} onNext={exit.goNext} />
    </StageBody>
  );
}
