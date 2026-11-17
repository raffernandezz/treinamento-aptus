"use client";

import { useRouter } from "next/navigation";
import { POLICIES_URL } from "@/data/mission";
import { useMission } from "@/store/mission-store";

export default function PoliciesPage() {
  const router = useRouter();
  const reset = useMission((state) => state.reset);

  return (
    <section className="w-full max-w-2xl py-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-aptus">Referência</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Políticas corporativas</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Este treinamento apresentou as principais regras operacionais. Para a versão atualizada, consulte o portal oficial.
      </p>
      <a href={POLICIES_URL} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 inline-flex">
        Consultar políticas
      </a>
      <div className="mt-8">
        <button
          type="button"
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Refazer missão
        </button>
      </div>
    </section>
  );
}
