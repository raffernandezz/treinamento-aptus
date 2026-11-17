import { STAGES } from "@/lib/stages";
import { SKILLS } from "@/data/lessons";

const PATH = STAGES.filter((stage) => stage.id !== "policies");

export function LearningPath({
  completed = [] as string[],
  lessonsRead = [] as string[],
}: {
  completed?: string[];
  lessonsRead?: string[];
}) {
  const done = new Set(completed);
  const read = new Set(lessonsRead);
  let unlockedIndex = 0;
  for (let index = 1; index < PATH.length; index += 1) {
    if (done.has(PATH[index - 1].id)) unlockedIndex = index;
    else break;
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-line bg-[#f8fafc] px-4 py-3.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-aptus">Trilha do curso</p>
        <p className="mt-1 text-sm font-bold tracking-tight text-ink">Aprender → Desafiar → Conquistar</p>
      </div>
      <ol className="divide-y divide-line">
        {PATH.map((stage, index) => {
          const complete = done.has(stage.id);
          const current = index === unlockedIndex && !complete;
          const locked = index > unlockedIndex;
          const learning = current && !read.has(stage.id) && stage.id !== "intro" && stage.id !== "result";

          return (
            <li
              key={stage.id}
              className={[
                "flex items-center gap-3 px-4 py-3.5",
                locked ? "opacity-40" : "",
                current ? "bg-aptus-soft/50" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-extrabold",
                  complete
                    ? "bg-ok text-white"
                    : current
                      ? "bg-aptus text-white"
                      : "bg-aptus-soft text-aptus",
                ].join(" ")}
              >
                {complete ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{stage.name}</p>
                <p className="text-[11px] text-muted">
                  {complete
                    ? "Concluída"
                    : locked
                      ? "Bloqueada"
                      : learning
                        ? "Aprendizado disponível"
                        : current
                          ? "Em andamento"
                          : `Etapa ${stage.etapa}`}
                </p>
              </div>
              {complete ? (
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-ok">Feito</span>
              ) : current ? (
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-aptus">Agora</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ObjectivesList() {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {[
        "Dominar relatórios e fluxos",
        "Validar documentos fiscais",
        "Auditar lançamentos com precisão",
        "Aplicar políticas no dia a dia",
        "Aprovar como gestor",
        "Fechar prestação sem glosa",
      ].map((item, index) => (
        <li
          key={item}
          className="flex items-start gap-2.5 rounded-panel border border-line bg-white px-3.5 py-3 shadow-soft"
        >
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-aptus-soft text-[10px] font-extrabold text-aptus">
            {index + 1}
          </span>
          <span className="text-sm font-semibold leading-snug text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SkillPreview({ skills }: { skills: Record<string, number> }) {
  return (
    <div className="rounded-panel border border-line bg-white p-4 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Habilidades do curso</p>
      <ul className="mt-3 space-y-2.5">
        {SKILLS.map((skill) => {
          const value = skills[skill.id] ?? 0;
          return (
            <li key={skill.id}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">{skill.label}</span>
                <span className="tabular-nums text-muted">{value}%</span>
              </div>
              <div className="progress-track mt-1.5">
                <div className="progress-fill" style={{ width: `${value}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
