export const STAGES = [
  { id: "intro", path: "/mission/intro", name: "Introdução", progress: 0, etapa: 1 },
  { id: "reports", path: "/mission/report-selection", name: "Relatórios", progress: 10, etapa: 2 },
  { id: "finance", path: "/mission/finance-approval", name: "Financeiro aprovaria", progress: 20, etapa: 3 },
  { id: "errors", path: "/mission/find-error", name: "Encontre o erro", progress: 30, etapa: 4 },
  { id: "meals", path: "/mission/meals", name: "Alimentação", progress: 40, etapa: 5 },
  { id: "special", path: "/mission/special-cases", name: "Situações especiais", progress: 50, etapa: 6 },
  { id: "manager", path: "/mission/manager-mode", name: "Gestor", progress: 60, etapa: 7 },
  { id: "checklist", path: "/mission/checklist", name: "Checklist", progress: 70, etapa: 8 },
  { id: "challenge", path: "/mission/final-challenge", name: "Desafio final", progress: 80, etapa: 9 },
  { id: "result", path: "/mission/result", name: "Resultado", progress: 100, etapa: 10 },
  { id: "policies", path: "/mission/policies", name: "Políticas", progress: 100, etapa: 10 },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

export function stageFromPath(pathname: string) {
  return STAGES.find((stage) => pathname === stage.path);
}

export function furthestUnlocked(completed: string[]) {
  let best: (typeof STAGES)[number] = STAGES[0];
  for (let index = 1; index < STAGES.length; index += 1) {
    if (completed.includes(STAGES[index - 1].id)) best = STAGES[index];
    else break;
  }
  return best;
}
