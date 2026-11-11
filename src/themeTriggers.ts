import { ThemeId } from "./themes";

export interface ThemeTrigger {
  id: string;
  phrase: string;
  videoUrl: string;
  videoName: string;
  description: string;
  isFixed?: boolean;
}

export interface ThemeMediaDefinition {
  themeId: ThemeId;
  themeName: string;
  intro: {
    id: string;
    phrase: string;
    videoUrl: string;
    videoName: string;
    description: string;
    isFixed?: boolean;
  };
  triggers: ThemeTrigger[];
  suggestedQuestions: string[];
}

/**
 * ESTRUTURA CENTRALIZADA DE VÍDEOS E GATILHOS FIXOS
 * Compartilhada universalmente entre todos os 5 temas (Amazônia, Taiga, Caatinga, Bambuçal, Pantanal).
 * As URLs são fixas no código-fonte e protegidas contra alterações acidentais.
 */
export const CENTRAL_FIXED_MEDIA: ThemeMediaDefinition = {
  themeId: "amazonia",
  themeName: "Central Ecossistema",
  intro: {
    id: "intro",
    phrase: "introdução",
    videoUrl: "https://youtube.com/shorts/lvrfiUS1hQc?si=Oifgcfg4S9J2AFZ7",
    videoName: "Apresentação: Assistente Virtual (HD)",
    description: "Vídeo de introdução e apresentação interativa do assistente virtual",
    isFixed: true,
  },
  triggers: [
    {
      id: "taiga_gatilho_1",
      phrase: "Como podemos preservar?",
      videoUrl: "https://youtube.com/shorts/Nvq2pUB2KQM?si=ZA0z8gjjZNxVkBaH",
      videoName: "Gatilho 1 - Como podemos preservar?",
      description: "Práticas e orientações para preservação do ecossistema e meio ambiente",
      isFixed: true,
    },
    {
      id: "taiga_gatilho_2",
      phrase: "Quais são as ameaças?",
      videoUrl: "https://youtube.com/shorts/3xtGroxD40k?si=Xi8fIacXF_dUv7oq",
      videoName: "Gatilho 2 - Quais são as ameaças?",
      description: "Ameaças ambientais, climáticas e ações humanas que afetam o ecossistema",
      isFixed: true,
    },
    {
      id: "taiga_gatilho_3",
      phrase: "Qual é a sua localização?",
      videoUrl: "https://youtube.com/shorts/ARbK4-Cgzf0?si=tst0eZkoGL-h4H1g",
      videoName: "Gatilho 3 - Qual é a sua localização?",
      description: "Localização geográfica, extensão territorial e características do bioma",
      isFixed: true,
    },
    {
      id: "taiga_gatilho_4",
      phrase: "Por que preservar a natureza?",
      videoUrl: "https://youtube.com/shorts/vPDfMaBTYQE?si=kJvOPPaMueIDyYC5",
      videoName: "Gatilho 4 - Por que preservar a natureza?",
      description: "Importância e motivos ecológicos para preservar a natureza e a biodiversidade",
      isFixed: true,
    },
  ],
  suggestedQuestions: [
    "Como podemos preservar?",
    "Quais são as ameaças?",
    "Qual é a sua localização?",
    "Por que preservar a natureza?",
    "reiniciar apresentação"
  ]
};

// Aliases para compatibilidade total com módulos existentes
export const TAIGA_THEME_MEDIA: ThemeMediaDefinition = {
  ...CENTRAL_FIXED_MEDIA,
  themeId: "taiga",
  themeName: "Taiga"
};

export const AMAZONIA_THEME_MEDIA: ThemeMediaDefinition = {
  ...CENTRAL_FIXED_MEDIA,
  themeId: "amazonia",
  themeName: "Amazônia"
};

/**
 * Interface para Grupos de Apresentação Independentes.
 * Permite associar turmas e equipes a biomas específicos sem sobrescrever mídias anteriores.
 */
export interface PresentationGroup {
  id: string;
  name: string;
  badge: string;
  biome: ThemeId;
  description: string;
  intro: {
    id: string;
    phrase: string;
    videoUrl: string;
    videoName: string;
    description: string;
    isFixed?: boolean;
  };
  triggers: ThemeTrigger[];
  suggestedQuestions: string[];
}

/**
 * NOVO GRUPO VINCULADO EXCLUSIVAMENTE À TAIGA:
 * Bioma: TAIGA
 * Grupo: DAVI, SAMARA, MILENA E JOÃO
 * Quantidade de vídeos: 5 (1 Introdução + 4 Gatilhos de Interação)
 */
export const TAIGA_GROUP_DAVI: PresentationGroup = {
  id: "taiga_davi_samara_milena_joao",
  name: "DAVI, SAMARA, MILENA E JOÃO",
  badge: "Davi, Samara, Milena e João",
  biome: "taiga",
  description: "Apresentação Interativa da Taiga • Grupo Davi, Samara, Milena e João",
  intro: {
    id: "intro",
    phrase: "introdução",
    videoUrl: "https://youtu.be/X1sNWDv_zpg",
    videoName: "Apresentação Taiga • Davi, Samara, Milena e João (Intro)",
    description: "Vídeo de introdução do grupo Davi, Samara, Milena e João no tema Taiga",
    isFixed: true,
  },
  triggers: [
    {
      id: "taiga_davi_g1",
      phrase: "Problemas para a fauna?",
      videoUrl: "https://youtu.be/uHCf8YLIzG0",
      videoName: "Gatilho 1 - Problemas para a fauna?",
      description: "Impactos e problemas ecológicos enfrentados pela fauna na Taiga",
      isFixed: true,
    },
    {
      id: "taiga_davi_g2",
      phrase: "Perigos nos Bambuzais",
      videoUrl: "https://youtu.be/H8JXEd1HA-A",
      videoName: "Gatilho 2 - Perigos nos Bambuzais",
      description: "Ameaças e perigos nos bambuzais e florestas",
      isFixed: true,
    },
    {
      id: "taiga_davi_g3",
      phrase: "Como funciona o Monitoramento",
      videoUrl: "https://youtu.be/qEB-W_W3qJE",
      videoName: "Gatilho 3 - Como funciona o Monitoramento",
      description: "Funcionamento do monitoramento e sensores da floresta",
      isFixed: true,
    },
    {
      id: "taiga_davi_g4",
      phrase: "Como tudo se conecta",
      videoUrl: "https://youtu.be/HNPU3f3VVpI",
      videoName: "Gatilho 4 - Como tudo se conecta",
      description: "Interconexão ecológica entre os seres vivos e as tecnologias",
      isFixed: true,
    },
  ],
  suggestedQuestions: [
    "Problemas para a fauna?",
    "Perigos nos Bambuzais",
    "Como funciona o Monitoramento",
    "Como tudo se conecta",
    "reiniciar apresentação"
  ]
};

/**
 * Grupo Geral da Taiga (Preservado para retrocompatibilidade sem sobrescrever dados)
 */
export const TAIGA_GROUP_GERAL: PresentationGroup = {
  id: "taiga_geral",
  name: "GRUPO GERAL • TAIGA",
  badge: "Geral",
  biome: "taiga",
  description: "Apresentação Geral de Preservação da Taiga",
  intro: {
    id: "intro",
    phrase: "introdução",
    videoUrl: "https://youtube.com/shorts/lvrfiUS1hQc?si=Oifgcfg4S9J2AFZ7",
    videoName: "Apresentação: Assistente Virtual (HD)",
    description: "Vídeo de introdução e apresentação interativa",
    isFixed: true,
  },
  triggers: CENTRAL_FIXED_MEDIA.triggers,
  suggestedQuestions: CENTRAL_FIXED_MEDIA.suggestedQuestions,
};

/**
 * Lista de apresentações independentes cadastradas para o Bioma TAIGA
 */
export const TAIGA_PRESENTATION_GROUPS: PresentationGroup[] = [
  TAIGA_GROUP_DAVI,
  TAIGA_GROUP_GERAL,
];

/**
 * Dicionário de grupos por bioma (mantém todos os biomas intactos e independentes)
 */
export const ALL_BIOME_GROUPS: Record<ThemeId, PresentationGroup[]> = {
  taiga: TAIGA_PRESENTATION_GROUPS,
  amazonia: [
    {
      id: "amazonia_geral",
      name: "GRUPO AMAZÔNIA",
      badge: "Amazônia",
      biome: "amazonia",
      description: "Apresentação da Floresta Amazônica",
      intro: CENTRAL_FIXED_MEDIA.intro,
      triggers: CENTRAL_FIXED_MEDIA.triggers,
      suggestedQuestions: CENTRAL_FIXED_MEDIA.suggestedQuestions,
    }
  ],
  caatinga: [
    {
      id: "caatinga_geral",
      name: "GRUPO CAATINGA",
      badge: "Caatinga",
      biome: "caatinga",
      description: "Apresentação do Sertão da Caatinga",
      intro: CENTRAL_FIXED_MEDIA.intro,
      triggers: CENTRAL_FIXED_MEDIA.triggers,
      suggestedQuestions: CENTRAL_FIXED_MEDIA.suggestedQuestions,
    }
  ],
  bambucal: [
    {
      id: "bambucal_geral",
      name: "GRUPO BAMBUÇAL",
      badge: "Bambuçal",
      biome: "bambucal",
      description: "Apresentação do Bosque Bambuçal",
      intro: CENTRAL_FIXED_MEDIA.intro,
      triggers: CENTRAL_FIXED_MEDIA.triggers,
      suggestedQuestions: CENTRAL_FIXED_MEDIA.suggestedQuestions,
    }
  ],
  pantanal: [
    {
      id: "pantanal_geral",
      name: "GRUPO PANTANAL",
      badge: "Pantanal",
      biome: "pantanal",
      description: "Apresentação das Águas do Pantanal",
      intro: CENTRAL_FIXED_MEDIA.intro,
      triggers: CENTRAL_FIXED_MEDIA.triggers,
      suggestedQuestions: CENTRAL_FIXED_MEDIA.suggestedQuestions,
    }
  ],
};

/**
 * Mapeamento centralizado de mídias para cada um dos cinco temas.
 * A troca de tema modifica apenas a identidade visual do app;
 * todos os 5 temas compartilham o acervo central fixo de vídeos e gatilhos.
 */
export const THEME_MEDIA_MAP: Record<ThemeId, ThemeMediaDefinition> = {
  amazonia: {
    ...CENTRAL_FIXED_MEDIA,
    themeId: "amazonia",
    themeName: "Amazônia",
  },
  taiga: {
    ...CENTRAL_FIXED_MEDIA,
    intro: TAIGA_GROUP_DAVI.intro,
    triggers: TAIGA_GROUP_DAVI.triggers,
    suggestedQuestions: TAIGA_GROUP_DAVI.suggestedQuestions,
    themeId: "taiga",
    themeName: "Taiga",
  },
  caatinga: {
    ...CENTRAL_FIXED_MEDIA,
    themeId: "caatinga",
    themeName: "Caatinga",
  },
  bambucal: {
    ...CENTRAL_FIXED_MEDIA,
    themeId: "bambucal",
    themeName: "Bambuçal",
  },
  pantanal: {
    ...CENTRAL_FIXED_MEDIA,
    themeId: "pantanal",
    themeName: "Pantanal",
  }
};

/**
 * Normaliza strings para comparação fonética e por similaridade textual:
 * Remove acentos, pontuações, caracteres especiais e espaços extras.
 */
export function normalizeVoiceText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s]/g, " ")     // pontuações viram espaços
    .replace(/\s+/g, " ")             // normaliza espaços
    .trim();
}

/**
 * Identificador e resolvedor especializado para os gatilhos centrais (Grupo Geral).
 * Permite variações de escrita e reconhecimento de voz sem confundir os gatilhos.
 */
export function matchCentralTrigger(input: string): string | null {
  const norm = normalizeVoiceText(input);
  if (!norm) return null;

  // Intro matchers: apresentação, introdução, início, começar, voltar
  const introWords = ["introducao", "inicio", "iniciar", "apresentacao", "apresentar", "comecar", "comeco", "abrir", "voltar"];
  if (introWords.some(w => norm === w || norm.startsWith(w + " ") || norm.endsWith(" " + w) || norm.includes(w))) {
    return "intro";
  }

  // Gatilho 2: "Quais são as ameaças?"
  if (
    norm.includes("ameaca") ||
    norm.includes("ameacas") ||
    norm.includes("quais sao as ameacas") ||
    norm.includes("quais as ameacas") ||
    norm.includes("o que ameaca") ||
    norm.includes("principais ameacas") ||
    norm.includes("maiores ameacas") ||
    norm.includes("perigos") ||
    norm.includes("riscos ambientais") ||
    norm.includes("riscos")
  ) {
    return "taiga_gatilho_2";
  }

  // Gatilho 3: "Qual é a sua localização?"
  if (
    norm.includes("localizacao") ||
    norm.includes("localizada") ||
    norm.includes("onde fica") ||
    norm.includes("onde esta") ||
    norm.includes("onde se localiza") ||
    norm.includes("onde encontramos") ||
    norm.includes("qual e a localizacao") ||
    norm.includes("qual sua localizacao") ||
    norm.includes("qual e a sua localizacao") ||
    norm.includes("onde se situa")
  ) {
    return "taiga_gatilho_3";
  }

  // Gatilho 4: "Por que preservar a natureza?"
  if (
    norm.includes("natureza") ||
    norm.includes("por que preservar") ||
    norm.includes("porque preservar") ||
    norm.includes("por que proteger") ||
    norm.includes("motivos para preservar") ||
    norm.includes("motivo para preservar") ||
    norm.includes("razao para preservar") ||
    norm.includes("por que devemos preservar") ||
    norm.includes("importancia de preservar") ||
    norm.includes("por que preservar a natureza") ||
    norm.includes("porque preservar a natureza") ||
    norm.includes("por que e importante preservar")
  ) {
    return "taiga_gatilho_4";
  }

  // Gatilho 1: "Como podemos preservar?"
  if (
    norm.includes("como podemos preservar") ||
    norm.includes("como preservar") ||
    norm.includes("como proteger") ||
    norm.includes("como cuidar") ||
    norm.includes("como podemos cuidar") ||
    norm.includes("como podemos proteger") ||
    norm.includes("como a gente preserva") ||
    norm.includes("o que fazer para preservar") ||
    norm.includes("maneiras de preservar") ||
    norm.includes("formas de preservar") ||
    norm.includes("podemos preservar") ||
    norm === "preservar"
  ) {
    return "taiga_gatilho_1";
  }

  return null;
}

/**
 * RECONHECEDOR ESPECIALIZADO DE VOZ PARA O GRUPO:
 * DAVI, SAMARA, MILENA E JOÃO (TAIGA)
 * 
 * 1. Introdução: "introdução", "apresentação", "início", "começar"
 * 2. Gatilho 1: "Problemas para a fauna?"
 * 3. Gatilho 2: "Perigos nos Bambuzais"
 * 4. Gatilho 3: "Como funciona o Monitoramento"
 * 5. Gatilho 4: "Como tudo se conecta"
 * 
 * Garante ativação imediata desde a primeira tentativa por fala ou texto.
 */
export function matchDaviTaigaTrigger(input: string): string | null {
  const norm = normalizeVoiceText(input);
  if (!norm) return null;

  // 1. Intro / Apresentação
  const introWords = ["introducao", "inicio", "iniciar", "apresentacao", "apresentar", "comecar", "comeco", "abrir", "voltar"];
  if (introWords.some(w => norm === w || norm.startsWith(w + " ") || norm.endsWith(" " + w) || norm.includes(w))) {
    return "intro";
  }

  // 2. Correspondências literais exatas
  if (
    norm === "problemas para a fauna" ||
    norm === "problemas para fauna" ||
    norm === "problema para a fauna" ||
    norm === "problema para fauna" ||
    norm === "problemas na fauna" ||
    norm === "problemas fauna"
  ) {
    return "taiga_davi_g1";
  }

  if (
    norm === "perigos nos bambuzais" ||
    norm === "perigo nos bambuzais" ||
    norm === "perigos no bambuzal" ||
    norm === "perigo no bambuzal" ||
    norm === "perigos bambuzais" ||
    norm === "perigo bambuzal"
  ) {
    return "taiga_davi_g2";
  }

  if (
    norm === "como funciona o monitoramento" ||
    norm === "como funciona monitoramento" ||
    norm === "como funciona o monitoramento ambiental" ||
    norm === "funcionamento do monitoramento"
  ) {
    return "taiga_davi_g3";
  }

  if (
    norm === "como tudo se conecta" ||
    norm === "tudo se conecta" ||
    norm === "como tudo conecta" ||
    norm === "como se conecta"
  ) {
    return "taiga_davi_g4";
  }

  // 3. Detecção por palavras-chave exclusivas e prioritárias:

  // GATILHO 2: "Perigos nos Bambuzais"
  // Prioridade para bambuzal / bambuzais / bambu
  if (
    norm.includes("bambuzal") ||
    norm.includes("bambuzais") ||
    norm.includes("bambu") ||
    (norm.includes("perigo") && norm.includes("floresta"))
  ) {
    return "taiga_davi_g2";
  }

  // GATILHO 1: "Problemas para a fauna?"
  // Prioridade para fauna / animais
  if (
    norm.includes("fauna") ||
    (norm.includes("problema") && (norm.includes("animal") || norm.includes("animais") || norm.includes("especie") || norm.includes("especies"))) ||
    norm.includes("problemas para os animais") ||
    norm.includes("ameacas para a fauna") ||
    norm.includes("animais da taiga")
  ) {
    return "taiga_davi_g1";
  }

  // GATILHO 3: "Como funciona o Monitoramento"
  // Prioridade para monitoramento / monitorar / sensores
  if (
    norm.includes("monitoramento") ||
    norm.includes("monitorar") ||
    norm.includes("monitora") ||
    norm.includes("sistema de monitoramento") ||
    norm.includes("sensores") ||
    norm.includes("telemetria")
  ) {
    return "taiga_davi_g3";
  }

  // GATILHO 4: "Como tudo se conecta"
  // Prioridade para conecta / conectar / conexao / interconexao
  if (
    norm.includes("conecta") ||
    norm.includes("conectar") ||
    norm.includes("conexao") ||
    norm.includes("conexoes") ||
    norm.includes("interconexao") ||
    norm.includes("tudo esta conectado") ||
    norm.includes("tudo conectado") ||
    norm.includes("se relaciona") ||
    norm.includes("interligado")
  ) {
    return "taiga_davi_g4";
  }

  // 4. Detecção flexível por contagem de termos das frases oficiais
  const targets = [
    { id: "taiga_davi_g1", terms: ["problemas", "fauna"] },
    { id: "taiga_davi_g2", terms: ["perigos", "bambuzais"] },
    { id: "taiga_davi_g3", terms: ["funciona", "monitoramento"] },
    { id: "taiga_davi_g4", terms: ["tudo", "conecta"] }
  ];

  for (const t of targets) {
    const hits = t.terms.filter(term => norm.includes(term)).length;
    if (hits >= 1 && norm.length <= 30) {
      return t.id;
    }
  }

  return null;
}

/**
 * Resolvedor contextual de gatilhos: avalia o grupo ativo para aplicar o
 * matcher correto sem cruzar dados entre grupos ou biomas diferentes.
 */
export function matchTriggerForGroup(input: string, groupId: string): string | null {
  if (groupId === TAIGA_GROUP_DAVI.id) {
    return matchDaviTaigaTrigger(input);
  }
  return matchCentralTrigger(input);
}

// Mantido como alias para retrocompatibilidade
export const matchTaigaTrigger = matchCentralTrigger;

