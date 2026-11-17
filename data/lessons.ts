import { KM_REIMBURSEMENT, MEAL_DAILY_LIMIT, NON_REIMBURSABLE } from "@/data/mission";

export type SkillId = "relatorios" | "documentos" | "auditoria" | "politicas" | "aprovacao";

export type LessonId =
  | "reports"
  | "finance"
  | "errors"
  | "meals"
  | "special"
  | "manager"
  | "checklist"
  | "challenge";

export type AchievementId =
  | "first_correct"
  | "error_hunter"
  | "doc_guardian"
  | "policy_pro"
  | "manager_sharp"
  | "checklist_ready"
  | "mission_finisher"
  | "perfect_stage";

export const SKILLS: Array<{ id: SkillId; label: string; blurb: string }> = [
  { id: "relatorios", label: "Relatórios", blurb: "Escolher o fluxo certo no Aptus" },
  { id: "documentos", label: "Documentos", blurb: "Separar o que comprova a despesa" },
  { id: "auditoria", label: "Auditoria", blurb: "Achar divergência antes da glosa" },
  { id: "politicas", label: "Políticas", blurb: "Limites, exceções e regras FTD" },
  { id: "aprovacao", label: "Aprovação", blurb: "Decidir como gestor e financeiro" },
];

export const ACHIEVEMENTS: Array<{
  id: AchievementId;
  title: string;
  description: string;
}> = [
  {
    id: "first_correct",
    title: "Primeiro acerto",
    description: "Você somou pontos na primeira decisão correta de primeira.",
  },
  {
    id: "doc_guardian",
    title: "Guardião do documento",
    description: "Concluiu a etapa de comprovantes fiscais.",
  },
  {
    id: "error_hunter",
    title: "Caçador de glosa",
    description: "Localizou as 3 divergências no lançamento.",
  },
  {
    id: "policy_pro",
    title: "Política na prática",
    description: "Dominou alimentação e situações especiais.",
  },
  {
    id: "manager_sharp",
    title: "Gestor afiado",
    description: "Concluiu o modo gestor com decisões consistentes.",
  },
  {
    id: "checklist_ready",
    title: "Prestação blindada",
    description: "Conferiu o checklist completo antes do envio.",
  },
  {
    id: "mission_finisher",
    title: "Missão concluída",
    description: "Fechou o desafio final e chegou ao resultado.",
  },
  {
    id: "perfect_stage",
    title: "Etapa limpa",
    description: "Fechou uma etapa sem errar na primeira tentativa.",
  },
];

export type LessonInfoBlock = {
  title: string;
  tone?: "warn" | "info";
  items: string[];
};

export type Lesson = {
  id: LessonId;
  skill: SkillId;
  skillGain: number;
  stageAchievement?: AchievementId;
  objective: string;
  title: string;
  summary: string;
  rules: string[];
  exampleGood: string;
  exampleBad: string;
  glosaRisk: string;
  challengeHint: string;
  infoBlocks?: LessonInfoBlock[];
};

export const LESSONS: Record<LessonId, Lesson> = {
  reports: {
    id: "reports",
    skill: "relatorios",
    skillGain: 20,
    objective: "Escolher o relatório certo para cada tipo de atividade.",
    title: "Relatórios de despesa",
    summary:
      "O relatório define o fluxo no Aptus. Local, viagem nacional, adiantamento e internacional não são intercambiáveis.",
    rules: [
      "Despesa na própria cidade, sem adiantamento → Despesas Locais – Reembolso.",
      "Viagem nacional com valor antecipado → Viagem Nacional com Adiantamento.",
      "Atividade em outro país → Viagem Internacional.",
      "O que sobrar do adiantamento volta; o que passar é reembolsado.",
    ],
    exampleGood: "Reunião comercial na sua cidade, paga com recurso próprio → relatório local.",
    exampleBad: "Viagem com adiantamento lançada como reembolso simples → fluxo errado e glosa.",
    glosaRisk: "Relatório incorreto trava aprovação e devolve a prestação.",
    challengeHint: "Leia o contexto e escolha o relatório. Acertar de primeira vale pontos.",
  },
  finance: {
    id: "finance",
    skill: "documentos",
    skillGain: 20,
    stageAchievement: "doc_guardian",
    objective: "Separar documento fiscal válido de comprovante de pagamento.",
    title: "O que o financeiro aprova",
    summary:
      "Só documento fiscal comprova a despesa. PIX, comanda e maquininha mostram pagamento — não substituem a nota.",
    rules: [
      "Cupom fiscal e NF-e são válidos quando legíveis e consistentes.",
      "Comanda de restaurante não é documento fiscal.",
      "Comprovante de PIX não comprova a natureza da despesa.",
      "Comprovante de maquininha comprova pagamento, não a despesa.",
    ],
    exampleGood: "Cupom fiscal com CNPJ, data e valor legíveis → aprovar.",
    exampleBad: "Só o comprovante de PIX do jantar → reprovar.",
    glosaRisk: "Sem documento fiscal a despesa volta ou é glosada.",
    challengeHint: "Vire cada comprovante e decida: aprovar ou reprovar.",
  },
  errors: {
    id: "errors",
    skill: "auditoria",
    skillGain: 20,
    stageAchievement: "error_hunter",
    objective: "Comparar lançamento e documento antes do envio.",
    title: "Auditoria de lançamento",
    summary:
      "Data, valor e categoria precisam bater com o anexo. Divergência silenciosa vira glosa no financeiro.",
    rules: [
      "Data do lançamento = data do documento.",
      "Valor lançado = valor do documento.",
      "Categoria descreve a despesa real (pedágio não é alimentação).",
      "Justificativa e CR precisam fazer sentido com a atividade.",
    ],
    exampleGood: "Pedágio R$ 58,90 em 10/11, categoria Pedágio → consistente.",
    exampleBad: "Lançamento 12/11, R$ 59,90, categoria Lanches → três glosas em um clique.",
    glosaRisk: "Divergência de data, valor ou categoria devolve a prestação.",
    challengeHint: "Clique nos campos do lançamento que não batem com o cupom.",
  },
  meals: {
    id: "meals",
    skill: "politicas",
    skillGain: 20,
    objective: `Aplicar o limite de R$ ${MEAL_DAILY_LIMIT.toFixed(2).replace(".", ",")} e as exceções de refeição.`,
    title: "Alimentação sem glosa",
    summary:
      "O limite diário por pessoa pode acumular na viagem. Cliente, conta compartilhada e álcool têm tratamento próprio.",
    rules: [
      `Limite: R$ ${MEAL_DAILY_LIMIT.toFixed(2).replace(".", ",")} por pessoa ao dia (acumulativo na viagem).`,
      "Refeição com cliente exige aprovação prévia do Head.",
      "Conta da equipe: rateio por pessoa dentro do limite; quem foi custeado não relança.",
      "Bebida alcoólica não é reembolsável — mesmo com cupom e limite ok.",
    ],
    exampleGood: "Dia 1 R$ 80 + Dia 2 R$ 140 = R$ 220 em 2 dias → dentro do acumulado.",
    exampleBad: "Lançar o vinho junto da refeição → glosa do valor alcoólico.",
    glosaRisk: "Estouro de limite, álcool ou exceção sem aprovação devolve a despesa.",
    challengeHint: "Decida quatro lançamentos: limite, cliente, conta compartilhada e bebida.",
    infoBlocks: [
      {
        title: "Informativo · Alimentação",
        tone: "info",
        items: [
          "O limite é por pessoa e por dia, podendo acumular no período da viagem.",
          "Álcool nunca entra no reembolso de alimentação.",
          "Valores acima do previsto podem ser glosados (o excedente fica com o colaborador).",
        ],
      },
    ],
  },
  special: {
    id: "special",
    skill: "politicas",
    skillGain: 20,
    stageAchievement: "policy_pro",
    objective: "Dominar exceções e reconhecer o que a política não reembolsa.",
    title: "Situações especiais e vedações",
    summary:
      "Além de combustível, passagem e hospedagem, a política lista despesas que nunca passam no reembolso — mesmo com documento fiscal.",
    rules: [
      "Frota institucional: usar cartão combustível quando o posto aceitar.",
      "Sem posto conveniado: autorização prévia (gestor + Facilities/Transporte).",
      "Passagens só pela agência oficial (Argo).",
      `Carro próprio: reembolso por km (R$ ${KM_REIMBURSEMENT.toFixed(2).replace(".", ",")} / km) — não pela nota de combustível.`,
      "Extras de hotel (frigobar, estacionamento) à parte, no reembolso, dentro dos limites.",
    ],
    exampleGood: "Posto aceita cartão combustível → abastece com o cartão da frota.",
    exampleBad: "Pedir reembolso da nota de combustível do carro próprio → glosa.",
    glosaRisk: "Despesa vedada ou exceção sem autorização gera glosa.",
    challengeHint: "Pratique abastecimento, passagem, hospedagem e o que não reembolsa.",
    infoBlocks: [
      {
        title: "Informativo · Despesas não reembolsáveis",
        tone: "warn",
        items: [...NON_REIMBURSABLE],
      },
    ],
  },
  manager: {
    id: "manager",
    skill: "aprovacao",
    skillGain: 20,
    stageAchievement: "manager_sharp",
    objective: "Dar o destino certo: aprovar, reprovar ou regularizar.",
    title: "Modo gestor",
    summary:
      "O gestor não “chuta”. Documento ilegível ou falta de aprovação volta para regularizar; despesa pessoal ou vedada reprova.",
    rules: [
      "Consistente, legível e de trabalho → aprovar.",
      "Ilegível ou incompleto → regularizar.",
      "Cliente sem aprovação do Head → regularizar.",
      "Despesa pessoal / não reembolsável (álcool, brinde, medicamento pessoal etc.) → reprovar.",
    ],
    exampleGood: "NF-e de app de transporte, valores iguais, imagem nítida → aprovar.",
    exampleBad: "Medicamento pessoal com cupom legível → reprovar (é despesa vedada).",
    glosaRisk: "Aprovar o que deveria voltar ou era vedado empurra o problema para o financeiro.",
    challengeHint: "Quatro prestações reais. Escolha o destino de cada uma.",
    infoBlocks: [
      {
        title: "Informativo · Quando reprovar de cara",
        tone: "warn",
        items: [
          "Despesas pessoais e medicamentos de uso pessoal",
          "Bebidas alcoólicas, doações, brindes e presentes",
          "Gratificações (ex.: carregador de aeroporto)",
        ],
      },
    ],
  },
  checklist: {
    id: "checklist",
    skill: "auditoria",
    skillGain: 15,
    stageAchievement: "checklist_ready",
    objective: "Conferir a prestação ponto a ponto antes do envio.",
    title: "Checklist de envio",
    summary:
      "Envio sem conferência é o atalho mais caro. Relatório, categoria, documento, valor, data, justificativa, aprovações — e se a despesa é permitida.",
    rules: [
      "Relatório e categoria corretos.",
      "Documento fiscal válido e legível.",
      "Valor e data iguais ao anexo.",
      "Justificativa clara e aprovações necessárias anexadas.",
      "Confirme que nenhum item da lista de não reembolsáveis entrou na prestação.",
    ],
    exampleGood: "Checklist completo marcado com evidência em cada item → enviar.",
    exampleBad: "Enviar “para ver se passa” → glosa e retrabalho.",
    glosaRisk: "Item esquecido no checklist costuma ser exatamente o que o financeiro devolve.",
    challengeHint: "Marque só o que você realmente conferiu. O envio só libera com a lista cheia.",
    infoBlocks: [
      {
        title: "Informativo · Antes de enviar",
        tone: "info",
        items: [
          "Despesa vedada não “passa” só porque o cupom está certo.",
          "Álcool, brinde, doação, gratificação e despesa pessoal devem sair da prestação.",
        ],
      },
    ],
  },
  challenge: {
    id: "challenge",
    skill: "aprovacao",
    skillGain: 25,
    stageAchievement: "mission_finisher",
    objective: "Integrar tudo: relatório, documento, política, vedações e decisão final.",
    title: "Desafio final",
    summary:
      "Última prova da missão. A primeira escolha conta na pontuação — como na prestação real.",
    rules: [
      "Relatório certo para o contexto.",
      "Documento válido e categoria coerente.",
      "Políticas de alimentação e exceções aplicadas.",
      "Despesas não reembolsáveis identificadas e barradas.",
      "Decisão de aprovação alinhada ao risco de glosa.",
    ],
    exampleGood: "Ler o cenário completo antes de clicar → pontuação limpa.",
    exampleBad: "Responder no impulso → perde o bônus da primeira tentativa.",
    glosaRisk: "Erro aqui mostra onde a prestação real seria glosada.",
    challengeHint: "Oito decisões encadeadas. Feche a prestação sem glosa.",
    infoBlocks: [
      {
        title: "Informativo · Lembrete rápido",
        tone: "warn",
        items: [...NON_REIMBURSABLE],
      },
    ],
  },
};

export const EMPTY_SKILLS: Record<SkillId, number> = {
  relatorios: 0,
  documentos: 0,
  auditoria: 0,
  politicas: 0,
  aprovacao: 0,
};

export const PILLARS = [
  { id: "aprendizado", label: "Aprendizado", tip: "Conteúdo antes da prática" },
  { id: "desafio", label: "Desafio", tip: "Situações reais para decidir" },
  { id: "habilidade", label: "Habilidade", tip: "Competências que sobem" },
  { id: "objetivo", label: "Objetivo", tip: "Meta clara em cada etapa" },
  { id: "conquista", label: "Conquista", tip: "Etapas e selos desbloqueados" },
  { id: "recompensa", label: "Recompensa", tip: "XP, medalhas e reconhecimento" },
] as const;
