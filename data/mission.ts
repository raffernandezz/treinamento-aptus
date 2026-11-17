export const MEAL_DAILY_LIMIT = 112;
export const KM_REIMBURSEMENT = 1.12;

export const POLICIES_URL =
  "https://editoraftd.sharepoint.com/sites/ConexoFTD/SitePages/Pol%C3%ADticas,-procedimentos-e-manuais.aspx";

/** Política de Viagens · item 1.17 e regras correlatas de alimentação */
export const NON_REIMBURSABLE = [
  "Gratificações (limpeza, carregador de aeroporto etc.)",
  "Combustível com nota fiscal (frota usa cartão combustível; carro próprio usa quilometragem)",
  "Bebidas alcoólicas",
  "Despesas pessoais",
  "Medicamentos de uso pessoal",
  "Doações",
  "Brindes e presentes",
] as const;

export type DecisionOption = {
  id: string;
  label: string;
};

export type DecisionItem = {
  id: string;
  topic: string;
  prompt: string;
  detail?: string;
  facts?: string[];
  options: DecisionOption[];
  correctOptionId: string;
  success: string;
  failure: string;
  extra?: "meal-math";
};

const REPORT_OPTIONS: DecisionOption[] = [
  { id: "locais", label: "Despesas Locais – Reembolso" },
  { id: "nacional", label: "Viagem Nacional – Reembolso" },
  { id: "adiantamento", label: "Viagem Nacional com Adiantamento" },
  { id: "internacional", label: "Viagem Internacional" },
];

export const REPORTS: DecisionItem[] = [
  {
    id: "r1",
    topic: "Relatório de despesa local",
    prompt: "Você participou de uma reunião comercial utilizando recursos próprios.",
    detail: "A reunião foi na sua cidade. Não houve adiantamento.",
    options: REPORT_OPTIONS,
    correctOptionId: "locais",
    success: "Este é o relatório adequado para despesas locais realizadas sem adiantamento.",
    failure: "Não é o relatório correto. Analise novamente o contexto da atividade.",
  },
  {
    id: "r2",
    topic: "Relatório com adiantamento",
    prompt: "Você recebeu adiantamento para uma viagem nacional.",
    detail: "O valor já foi creditado na sua conta corrente para cobrir a viagem.",
    options: REPORT_OPTIONS,
    correctOptionId: "adiantamento",
    success:
      "Viagem nacional com valor recebido antecipadamente usa Viagem Nacional com Adiantamento. O que não for usado é depositado de volta; o que passar do adiantamento é reembolsado.",
    failure: "Houve adiantamento de viagem nacional. O relatório precisa registrar esse recurso.",
  },
  {
    id: "r3",
    topic: "Relatório internacional",
    prompt: "A atividade foi uma viagem para outro país.",
    detail: "Passagem e hospedagem saíram pela agência oficial.",
    options: REPORT_OPTIONS,
    correctOptionId: "internacional",
    success:
      "Outro país usa Viagem Internacional. A prestação, com ou sem adiantamento, fecha em até 15 dias corridos após o retorno.",
    failure: "O destino é internacional. Relatório local ou nacional não cobre essa atividade.",
  },
];

export const FINANCE: DecisionItem[] = [
  {
    id: "cupom",
    topic: "Cupom fiscal",
    prompt: "O financeiro aprovaria?",
    options: [
      { id: "aprovar", label: "Aprovar" },
      { id: "reprovar", label: "Reprovar" },
    ],
    correctOptionId: "aprovar",
    success: "Possui documento fiscal válido.",
    failure: "O cupom fiscal é documento válido para comprovar a despesa.",
  },
  {
    id: "comanda",
    topic: "Comanda",
    prompt: "O financeiro aprovaria?",
    options: [
      { id: "aprovar", label: "Aprovar" },
      { id: "reprovar", label: "Reprovar" },
    ],
    correctOptionId: "reprovar",
    success: "Comanda não é documento fiscal.",
    failure: "Comanda não é documento fiscal. O financeiro reprova.",
  },
  {
    id: "pix",
    topic: "Comprovante de PIX",
    prompt: "O financeiro aprovaria?",
    options: [
      { id: "aprovar", label: "Aprovar" },
      { id: "reprovar", label: "Reprovar" },
    ],
    correctOptionId: "reprovar",
    success: "PIX não substitui documento fiscal.",
    failure: "PIX não substitui documento fiscal. Ele mostra a transferência, não a despesa.",
  },
  {
    id: "pos",
    topic: "Comprovante de maquininha",
    prompt: "O financeiro aprovaria?",
    options: [
      { id: "aprovar", label: "Aprovar" },
      { id: "reprovar", label: "Reprovar" },
    ],
    correctOptionId: "reprovar",
    success: "O comprovante da maquininha comprova pagamento mas não comprova a despesa.",
    failure: "O comprovante da maquininha comprova pagamento mas não comprova a despesa.",
  },
];

export const MEALS: DecisionItem[] = [
  {
    id: "meal-limit",
    topic: "Limite de alimentação",
    prompt: "Dia 1: R$ 80,00. Dia 2: R$ 140,00. Está dentro da política?",
    detail: "Viagem nacional de dois dias. Só alimentação. Sem bebida alcoólica.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
    ],
    correctOptionId: "sim",
    success: "O limite é acumulativo durante a viagem.",
    failure:
      "O limite de R$ 112,00 por pessoa é diário, e o gasto pode acumular no período da viagem. Olhe o total, não cada dia isolado.",
    extra: "meal-math",
  },
  {
    id: "meal-client",
    topic: "Refeição com cliente",
    prompt: "Jantar com cliente. Posso lançar normalmente?",
    detail: "Você pagou o jantar de um cliente durante a atividade.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
      { id: "head", label: "Requer aprovação" },
    ],
    correctOptionId: "head",
    success: "Necessita aprovação prévia do Head.",
    failure:
      "Jantar com cliente não segue o lançamento comum de alimentação. Necessita aprovação prévia do Head.",
  },
  {
    id: "meal-shared",
    topic: "Alimentação compartilhada",
    prompt: "Almoço da equipe. Posso lançar como alimentação individual?",
    detail: "Você pagou a conta de colegas do Grupo Marista na mesma mesa.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
    ],
    correctOptionId: "nao",
    success:
      "Alimentação compartilhada possui tratamento específico. O valor por pessoa respeita R$ 112,00 ao dia, e quem foi custeado não apresenta a mesma despesa.",
    failure:
      "Não lance o total como alimentação individual. Divida por pessoa dentro do limite de R$ 112,00 ao dia. O participante custeado não lança a mesma despesa.",
  },
  {
    id: "meal-alcohol",
    topic: "Bebida alcoólica",
    prompt: "A conta do jantar inclui vinho. Posso lançar o valor total em alimentação?",
    detail: "Viagem nacional. O cupom fiscal está legível e dentro do limite diário se incluir o vinho.",
    options: [
      { id: "total", label: "Sim, lançar o total do cupom" },
      { id: "sem", label: "Não — bebida alcoólica não é reembolsável" },
      { id: "head", label: "Só com aprovação do Head" },
    ],
    correctOptionId: "sem",
    success:
      "Bebidas alcoólicas não são reembolsáveis em viagens nacionais. O valor do álcool fica por conta do colaborador.",
    failure:
      "Mesmo com cupom válido e limite ok, bebida alcoólica está na lista de despesas não reembolsáveis.",
  },
];

export const SPECIAL: DecisionItem[] = [
  {
    id: "fuel-card",
    topic: "Cartão combustível",
    prompt: "O veículo da frota precisa abastecer. O posto aceita o cartão combustível. O que fazer?",
    options: [
      { id: "cartao", label: "Usar o cartão combustível" },
      { id: "corp", label: "Pagar com o cartão corporativo" },
      { id: "reembolso", label: "Pedir reembolso com a nota" },
    ],
    correctOptionId: "cartao",
    success: "Frota institucional usa o cartão combustível.",
    failure: "Com o cartão combustível aceito no posto, ele é o meio obrigatório.",
  },
  {
    id: "fuel-exception",
    topic: "Abastecimento sem posto conveniado",
    prompt: "No trecho seguinte nenhum posto aceita o cartão combustível. O que fazer?",
    options: [
      { id: "corp", label: "Abastecer no cartão corporativo e lançar depois" },
      { id: "alfredo", label: "Pedir autorização do Alfredo (Facilities/Transporte)" },
      { id: "nota", label: "Lançar a nota de combustível como reembolso" },
    ],
    correctOptionId: "alfredo",
    success:
      "Sem posto conveniado, a exceção pede autorização prévia do gestor e de Facilities/Transporte. A prestação segue depois dessa autorização.",
    failure:
      "Nota de combustível não autoriza reembolso, e o cartão corporativo não substitui o cartão combustível sem autorização prévia.",
  },
  {
    id: "tickets",
    topic: "Passagem fora da agência",
    prompt: "Encontrei passagem mais barata fora da Argo. Posso comprar?",
    detail: "Argo é a agência oficial usada no fluxo corporativo.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
    ],
    correctOptionId: "nao",
    success: "Deve seguir o fluxo corporativo.",
    failure: "Preço menor fora da Argo não autoriza a compra. Passagens seguem a agência oficial.",
  },
  {
    id: "lodging",
    topic: "Hospedagem e extras",
    prompt: "O hotel quer incluir frigobar e estacionamento na fatura da diária, junto da agência. Como fechar?",
    options: [
      { id: "junto", label: "Incluir os extras na fatura da diária" },
      { id: "aparte", label: "Pagar os extras à parte e lançar no reembolso" },
      { id: "ignorar", label: "Não guardar o comprovante dos extras" },
    ],
    correctOptionId: "aparte",
    success:
      "A agência oficial fatura só a diária prevista. Frigobar, alimentação e estacionamento são pagos pelo viajante e reembolsados dentro dos limites.",
    failure: "Extras não entram na fatura da diária. Pague à parte e lance no reembolso, dentro da política.",
  },
  {
    id: "not-fuel-nf",
    topic: "Combustível com nota",
    prompt: "Usei o carro próprio e tenho a nota do posto. Posso pedir reembolso pela nota de combustível?",
    detail: "Deslocamento a trabalho. A nota fiscal do combustível está legível.",
    options: [
      { id: "nota", label: "Sim, reembolsar a nota de combustível" },
      { id: "km", label: "Não — usar o reembolso por quilômetro rodado" },
      { id: "cartao", label: "Lançar no cartão corporativo" },
    ],
    correctOptionId: "km",
    success: `Combustível com nota não é reembolsável. No carro próprio, o reembolso é por quilômetro rodado (R$ ${KM_REIMBURSEMENT.toFixed(2).replace(".", ",")} / km).`,
    failure:
      "Mesmo com nota fiscal, combustível não se reembolsa pelo valor do posto. A política prevê quilometragem.",
  },
  {
    id: "not-gift",
    topic: "Brinde e presente",
    prompt: "Comprei um presente para um parceiro comercial. Posso lançar no reembolso?",
    detail: "Há cupom fiscal. A compra foi durante a viagem.",
    options: [
      { id: "sim", label: "Sim, é despesa de relacionamento" },
      { id: "nao", label: "Não — brindes e presentes não são reembolsáveis" },
      { id: "head", label: "Somente com aprovação do Head" },
    ],
    correctOptionId: "nao",
    success: "Brindes e presentes estão na lista de despesas não reembolsáveis da política de Viagens.",
    failure: "Cupom válido não transforma brinde ou presente em despesa reembolsável.",
  },
  {
    id: "not-tip",
    topic: "Gratificação",
    prompt: "Paguei uma gorjeta ao carregador do aeroporto. Posso reembolsar?",
    options: [
      { id: "sim", label: "Sim, faz parte da viagem" },
      { id: "nao", label: "Não — gratificações não são reembolsáveis" },
    ],
    correctOptionId: "nao",
    success:
      "Gratificações para serviços de limpeza ou carregador de aeroporto não são reembolsáveis.",
    failure: "Esse tipo de gratificação está vedado na política de despesas não reembolsáveis.",
  },
];

const MANAGER_OPTIONS: DecisionOption[] = [
  { id: "aprovar", label: "Aprovar" },
  { id: "reprovar", label: "Reprovar" },
  { id: "regularizar", label: "Regularizar" },
];

export const MANAGER: DecisionItem[] = [
  {
    id: "m1",
    topic: "Aprovação do gestor",
    prompt: "A prestação chegou para você. Qual é o destino?",
    facts: [
      "Documento: NF-e de transporte por aplicativo",
      "Valor lançado: R$ 46,00",
      "Valor do documento: R$ 46,00",
      "Data: igual nos dois lados",
      "Categoria: Transporte",
      "Imagem: legível, sem rasura",
    ],
    options: MANAGER_OPTIONS,
    correctOptionId: "aprovar",
    success: "Documento legível, valor e data consistentes, despesa de trabalho. Aprovar.",
    failure: "Não há divergência nem despesa vedada. Este caso é aprovação.",
  },
  {
    id: "m2",
    topic: "Comprovante ilegível",
    prompt: "A prestação chegou para você. Qual é o destino?",
    facts: [
      "Documento: foto de cupom",
      "Valor: impossível de ler",
      "Data: visível",
      "Categoria: Alimentação",
      "Imagem: cortada e escura",
    ],
    options: MANAGER_OPTIONS,
    correctOptionId: "regularizar",
    success: "Comprovante ilegível volta para regularizar, com imagem nítida. Não aprove e não encerre sem documento.",
    failure: "Sem valor legível o financeiro não confere a despesa. O caminho é regularizar.",
  },
  {
    id: "m3",
    topic: "Cliente sem aprovação",
    prompt: "A prestação chegou para você. Qual é o destino?",
    facts: [
      "Documento: cupom fiscal de restaurante",
      "Contexto: jantar com cliente",
      "Aprovação do Head: não anexada",
      "Valor: R$ 186,00",
      "Imagem: legível",
    ],
    options: MANAGER_OPTIONS,
    correctOptionId: "regularizar",
    success: "Cliente sem aprovação prévia do Head. A prestação volta para regularizar a aprovação.",
    failure: "O cupom existe, mas falta a aprovação do Head. Não aprove assim. Regularize.",
  },
  {
    id: "m4",
    topic: "Despesa pessoal",
    prompt: "A prestação chegou para você. Qual é o destino?",
    facts: [
      "Documento: cupom de farmácia",
      "Descrição: medicamento de uso pessoal",
      "Valor: R$ 62,40",
      "Imagem: legível",
      "Vínculo com a atividade: nenhum",
    ],
    options: MANAGER_OPTIONS,
    correctOptionId: "reprovar",
    success: "Despesa pessoal. Medicamento de uso pessoal não é reembolsável. Reprovar.",
    failure: "Documento legível não torna a despesa corporativa. Medicamento pessoal é reprovação.",
  },
];

export const CHECKLIST = [
  { id: "relatorio", label: "Relatório correto" },
  { id: "categoria", label: "Categoria correta" },
  { id: "documento", label: "Documento fiscal válido" },
  { id: "valor", label: "Valor correto" },
  { id: "data", label: "Data correta" },
  { id: "justificativa", label: "Justificativa" },
  { id: "aprovacao", label: "Aprovação necessária" },
] as const;

export const CHALLENGE: DecisionItem[] = [
  {
    id: "c1",
    topic: "Relatório da prestação",
    prompt: "Qual relatório utilizar?",
    detail: "Táxi para uma reunião na própria cidade, pago com recurso próprio. Sem adiantamento.",
    options: REPORT_OPTIONS,
    correctOptionId: "locais",
    success: "Despesa local sem adiantamento: Despesas Locais – Reembolso.",
    failure: "Não houve viagem nem adiantamento. O relatório é Despesas Locais – Reembolso.",
  },
  {
    id: "c2",
    topic: "PIX como comprovante",
    prompt: "PIX é válido?",
    detail: "O anexo é só a tela do PIX. Não há cupom nem nota.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
    ],
    correctOptionId: "nao",
    success: "PIX não substitui documento fiscal.",
    failure: "PIX comprova a transferência, não a despesa. Sem documento fiscal, não é válido.",
  },
  {
    id: "c3",
    topic: "Aprovação de cliente",
    prompt: "Cliente precisa de aprovação?",
    detail: "Você pagou o jantar de um cliente e quer lançar em alimentação.",
    options: [
      { id: "sim", label: "Sim, aprovação prévia do Head" },
      { id: "nao", label: "Não, lança como alimentação" },
    ],
    correctOptionId: "sim",
    success: "Necessita aprovação prévia do Head.",
    failure: "Refeição com cliente precisa de aprovação prévia do Head antes do lançamento comum.",
  },
  {
    id: "c4",
    topic: "Comanda",
    prompt: "Comanda é válida?",
    detail: "O restaurante entregou a comanda da mesa. Não há cupom nem nota.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
    ],
    correctOptionId: "nao",
    success: "Comanda não é documento fiscal.",
    failure: "Comanda não comprova a despesa. O financeiro não aceita.",
  },
  {
    id: "c5",
    topic: "Alimentação compartilhada",
    prompt: "Almoço da equipe. Lançar o valor cheio como alimentação individual?",
    detail: "A conta inclui colegas do Grupo Marista. O total do dia, sozinho, passa de R$ 112,00.",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
    ],
    correctOptionId: "nao",
    success:
      "Alimentação compartilhada possui tratamento específico. Vale o valor por pessoa, até R$ 112,00 ao dia, sem lançamento duplicado de quem foi custeado.",
    failure: "O valor cheio no seu nome mistura a equipe numa despesa individual. Não lance assim.",
  },
  {
    id: "c6",
    topic: "Categoria do lançamento",
    prompt: "O pedágio entrou em Lanches e Refeições. O valor confere com o cupom. O que fazer?",
    options: [
      { id: "enviar", label: "Enviar assim" },
      { id: "categoria", label: "Corrigir a categoria" },
      { id: "valor", label: "Alterar o valor para caber no limite de alimentação" },
    ],
    correctOptionId: "categoria",
    success: "Categoria incorreta. Pedágio não é alimentação, mesmo quando o valor confere.",
    failure: "Valor certo na categoria errada continua divergente. Corrija a categoria antes de enviar.",
  },
  {
    id: "c7",
    topic: "Abastecimento",
    prompt: "Abastecimento da frota em posto que não aceita o cartão combustível. O que fazer?",
    options: [
      { id: "corp", label: "Pagar no cartão corporativo, sem autorização" },
      { id: "alfredo", label: "Pedir autorização do Alfredo (Facilities/Transporte)" },
      { id: "nota", label: "Pedir reembolso da nota de combustível" },
    ],
    correctOptionId: "alfredo",
    success:
      "Sem posto conveniado, só com autorização prévia de Facilities/Transporte. Combustível de frota não se reembolsa apenas com a nota.",
    failure: "Cartão corporativo e nota fiscal não substituem o cartão combustível sem autorização prévia.",
  },
  {
    id: "c8",
    topic: "Despesa não reembolsável",
    prompt: "Qual destas despesas NÃO pode ser reembolsada?",
    detail: "Todas têm comprovante. Escolha a que a política veda.",
    options: [
      { id: "pedagio", label: "Pedágio no trajeto da visita" },
      { id: "presente", label: "Presente para parceiro comercial" },
      { id: "taxi", label: "Táxi até o aeroporto" },
    ],
    correctOptionId: "presente",
    success:
      "Brindes e presentes não são reembolsáveis. Pedágio e táxi de trabalho, com documento válido, seguem o fluxo normal.",
    failure:
      "Revise a lista de despesas não reembolsáveis: brindes, presentes, álcool, despesas pessoais, doações e gratificações estão fora.",
  },
];

export const FOUND_ERRORS = [
  {
    id: "date",
    topic: "Data divergente",
    message: "Data divergente. O lançamento está em 12/11 e a nota em 10/11.",
  },
  {
    id: "value",
    topic: "Valor divergente",
    message: "Valor divergente. O sistema mostra R$ 59,90 e a nota R$ 58,90.",
  },
  {
    id: "category",
    topic: "Categoria incorreta",
    message: "Categoria incorreta. Pedágio não é Lanches e Refeições.",
  },
] as const;

export const ALL_DECISIONS: DecisionItem[] = [
  ...REPORTS,
  ...FINANCE,
  ...MEALS,
  ...SPECIAL,
  ...MANAGER,
  ...CHALLENGE,
];

export const STAGE_POINT_IDS = [
  "reports",
  "finance",
  "errors",
  "meals",
  "special",
  "manager",
  "checklist",
  "challenge",
] as const;

export const POINT = {
  correct: 10,
  found: 10,
  stage: 5,
} as const;

export const MAX_RAW =
  ALL_DECISIONS.length * POINT.correct + FOUND_ERRORS.length * POINT.found + STAGE_POINT_IDS.length * POINT.stage;

export function money(value: number) {
  const [ints, frac] = value.toFixed(2).split(".");
  const grouped = ints.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${grouped},${frac}`;
}

export function toScore(raw: number) {
  if (raw >= MAX_RAW) return 100;
  return Math.round((raw / MAX_RAW) * 100);
}

export type MedalId = "gold" | "silver" | "bronze" | "review";

export function medalFor(score: number): MedalId {
  if (score >= 100) return "gold";
  if (score >= 90) return "silver";
  if (score >= 70) return "bronze";
  return "review";
}

export const MEDALS: Record<
  MedalId,
  { title: string; message: string }
> = {
  gold: {
    title: "COLABORADOR SEM GLOSA",
    message: "Prestação fechada sem glosa. Você registrou, validou e decidiu como o financeiro espera.",
  },
  silver: {
    title: "ESPECIALISTA EM PRESTAÇÃO DE CONTAS",
    message: "Muito perto do padrão sem glosa. A primeira leitura ainda escapou em alguns pontos.",
  },
  bronze: {
    title: "BOA PERFORMANCE",
    message: "A prestação está encaminhada. Algumas regras ainda devolveriam despesa se passassem direto.",
  },
  review: {
    title: "REVISAR CONCEITOS",
    message: "A missão mostrou onde a prestação seria devolvida. Vale refazer os pontos sensíveis.",
  },
};
