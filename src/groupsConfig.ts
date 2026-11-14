import { ThemeId } from "./themes";

export type PresentationType = "triggers" | "full_video";

export interface GroupVideoAsset {
  id: string;
  phrase: string;
  videoUrl: string;
  videoName: string;
  description: string;
  isFixed?: boolean;
  isEndingTrigger?: boolean;
}

export interface GroupTrigger extends GroupVideoAsset {}

export interface GroupDefinition {
  id: string;
  name: string;
  integrantes: string[];
  temaReferencia: ThemeId;
  temaReferenciaNome: string;
  badge: string;
  description: string;
  presentationType: PresentationType;
  intro: GroupVideoAsset | null;
  fullVideo?: GroupVideoAsset | null;
  triggers: GroupTrigger[];
}

export interface QuizQuestion {
  id: string;
  topic: "caracteristicas" | "fauna_flora" | "importancia" | "ameacas_preservacao" | "tecnologia";
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  feedback: string;
}

export interface EcosystemQuiz {
  id: string;
  themeId: ThemeId;
  ecosystemName: string;
  title: string;
  subtitle: string;
  pointsPerQuestion: 1000;
  maxScore: 5000;
  questions: [QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion];
}

/**
 * ============================================================================
 * 1. CATÁLOGO CENTRALIZADO DE VÍDEOS FIXOS
 * Mantém todas as URLs e metadados de mídia isolados dos objetos de grupo.
 * ============================================================================
 */
export const VIDEOS_CATALOG: Record<string, GroupVideoAsset> = {
  // Grupo 1 — Davi, Samara, Milena e João
  davi_intro: {
    id: "davi_intro",
    phrase: "introdução",
    videoUrl: "https://youtu.be/X1sNWDv_zpg",
    videoName: "Introdução — Davi, Samara, Milena e João",
    description: "Vídeo de introdução do grupo Davi, Samara, Milena e João",
    isFixed: true,
  },
  davi_g1: {
    id: "davi_g1",
    phrase: "Problemas para a fauna?",
    videoUrl: "https://youtu.be/uHCf8YLIzG0",
    videoName: "Gatilho 1 — Problemas para a fauna?",
    description: "Impactos e desafios ambientais enfrentados pela fauna",
    isFixed: true,
  },
  davi_g2: {
    id: "davi_g2",
    phrase: "Perigos nos Bambuzais",
    videoUrl: "https://youtu.be/H8JXEd1HA-A",
    videoName: "Gatilho 2 — Perigos nos Bambuzais",
    description: "Ameaças e riscos presentes nos bambuzais",
    isFixed: true,
  },
  davi_g3: {
    id: "davi_g3",
    phrase: "Como funciona o Monitoramento",
    videoUrl: "https://youtu.be/qEB-W_W3qJE",
    videoName: "Gatilho 3 — Como funciona o Monitoramento",
    description: "Funcionamento do monitoramento e sensores ambientais",
    isFixed: true,
  },
  davi_g4: {
    id: "davi_g4",
    phrase: "Como tudo se conecta",
    videoUrl: "https://youtu.be/HNPU3f3VVpI",
    videoName: "Gatilho 4 — Como tudo se conecta",
    description: "Integração ecológica entre fauna, flora e tecnologia IoT",
    isFixed: true,
  },

  // Grupo 2 — Ezequiel, Melissa e Rihanna
  ezequiel_intro: {
    id: "ezequiel_intro",
    phrase: "introdução",
    videoUrl: "https://youtu.be/K5Fng-QBgUU",
    videoName: "Introdução — Ezequiel, Melissa e Rihanna",
    description: "Vídeo de introdução do grupo Ezequiel, Melissa e Rihanna",
    isFixed: true,
  },
  ezequiel_g1: {
    id: "ezequiel_g1",
    phrase: "Como sobreviver aos animais da taiga?",
    videoUrl: "https://youtu.be/t-yn_HBVY54",
    videoName: "Gatilho 1 — Como sobreviver aos animais da taiga?",
    description: "Orientações de proteção e convivência com a fauna da taiga",
    isFixed: true,
  },
  ezequiel_g2: {
    id: "ezequiel_g2",
    phrase: "Me fale como posso sobreviver na taiga",
    videoUrl: "https://youtu.be/Tam0ywh_PKU",
    videoName: "Gatilho 2 — Me fale como posso sobreviver na taiga",
    description: "Estratégias de sobrevivência e abrigo em clima boreal",
    isFixed: true,
  },
  ezequiel_g3: {
    id: "ezequiel_g3",
    phrase: "Como fazer uma fogueira na neve",
    videoUrl: "https://youtu.be/GCGzpigsS0E",
    videoName: "Gatilho 3 — Como fazer uma fogueira na neve",
    description: "Técnicas seguras para acender fogueira sobre a neve",
    isFixed: true,
  },
  ezequiel_g4: {
    id: "ezequiel_g4",
    phrase: "Tchau",
    videoUrl: "https://youtu.be/0KdvC184Ego",
    videoName: "Gatilho 4 — Tchau",
    description: "Encerramento da apresentação do grupo",
    isFixed: true,
    isEndingTrigger: true,
  },

  // Grupo 3 — Mel, José, Marcela e Yasmin
  mel_intro: {
    id: "mel_intro",
    phrase: "introdução",
    videoUrl: "https://youtu.be/pavCUYkLoss",
    videoName: "Introdução — Mel, José, Marcela e Yasmin",
    description: "Vídeo de introdução do grupo Mel, José, Marcela e Yasmin",
    isFixed: true,
  },
  mel_g1: {
    id: "mel_g1",
    phrase: "Me fale mais sobre o manguezal",
    videoUrl: "https://youtu.be/ITLt81kBSvI",
    videoName: "Gatilho 1 — Me fale mais sobre o manguezal",
    description: "Características, fauna e importância ecológica do manguezal",
    isFixed: true,
  },
  mel_g2: {
    id: "mel_g2",
    phrase: "Como a tecnologia pode ajudar",
    videoUrl: "https://youtu.be/OpmFWqn1TBI",
    videoName: "Gatilho 2 — Como a tecnologia pode ajudar",
    description: "Soluções de IoT e inteligência artificial para preservação do manguezal",
    isFixed: true,
  },
  mel_g3: {
    id: "mel_g3",
    phrase: "Como funciona o Monitoramento",
    videoUrl: "https://youtu.be/Xpz_1CqMY1c",
    videoName: "Gatilho 3 — Como funciona o Monitoramento",
    description: "Funcionamento dos sensores ambientais aplicados ao manguezal",
    isFixed: true,
  },
  mel_g4: {
    id: "mel_g4",
    phrase: "Tchau",
    videoUrl: "https://youtu.be/LXqqZV-3KNc",
    videoName: "Gatilho 4 — Tchau",
    description: "Encerramento da apresentação do grupo",
    isFixed: true,
    isEndingTrigger: true,
  },

  // Grupo 4 — Ana, Lohani, Kauan e Wesley (Intro + 2 Gatilhos)
  ana_intro: {
    id: "ana_intro",
    phrase: "introdução",
    videoUrl: "https://youtu.be/B2sjqM-lUeE",
    videoName: "Introdução — Ana, Lohani, Kauan e Wesley",
    description: "Vídeo de introdução do grupo Ana, Lohani, Kauan e Wesley",
    isFixed: true,
  },
  ana_g1: {
    id: "ana_g1",
    phrase: "Mais sobre a Amazônia",
    videoUrl: "https://youtu.be/TWKjrYkXSqc",
    videoName: "Gatilho 1 — Mais sobre a Amazônia",
    description: "Aprofundamento sobre o bioma Amazônia e monitoramento inteligente",
    isFixed: true,
  },
  ana_g2: {
    id: "ana_g2",
    phrase: "Tchau",
    videoUrl: "https://youtu.be/iXAKKwFBSGY",
    videoName: "Gatilho 2 — Tchau",
    description: "Encerramento da apresentação do grupo",
    isFixed: true,
    isEndingTrigger: true,
  },

  // Grupo 5 — Miguel, Mariana, Bianca e Letícia (Vídeo Completo único)
  miguel_full: {
    id: "miguel_full",
    phrase: "Vídeo completo",
    videoUrl: "https://youtu.be/10R_dDrRouI",
    videoName: "Apresentação Completa — Miguel, Mariana, Bianca e Letícia",
    description: "Apresentação completa sobre o bioma Caatinga em vídeo contínuo",
    isFixed: true,
  },
};

/**
 * ============================================================================
 * 2. CONFIGURAÇÃO CENTRALIZADA DOS 5 GRUPOS OFICIAIS
 * ASSISTENTES DA NATUREZA | 9º A – OSMARINHO
 * Todos os 5 grupos ficam disponíveis simultaneamente nos 5 temas visuais.
 * ============================================================================
 */
export const GROUPS_CONFIG: Record<string, GroupDefinition> = {
  // GRUPO 1 — DAVI, SAMARA, MILENA E JOÃO (Referência: BAMBUÇAL)
  grupoDaviSamaraMilenaJoao: {
    id: "grupoDaviSamaraMilenaJoao",
    name: "DAVI, SAMARA, MILENA E JOÃO",
    integrantes: ["Davi", "Samara", "Milena", "João"],
    temaReferencia: "bambucal",
    temaReferenciaNome: "Bambuçal",
    badge: "Bambuçal · Davi, Samara, Milena e João",
    description: "Projeto Bambuzal Inteligente — Davi, Samara, Milena e João",
    presentationType: "triggers",
    intro: VIDEOS_CATALOG.davi_intro,
    triggers: [
      VIDEOS_CATALOG.davi_g1,
      VIDEOS_CATALOG.davi_g2,
      VIDEOS_CATALOG.davi_g3,
      VIDEOS_CATALOG.davi_g4,
    ],
  },

  // GRUPO 2 — EZEQUIEL, MELISSA E RIHANNA (Referência: TAIGA)
  grupoEzequielMelissaRihanna: {
    id: "grupoEzequielMelissaRihanna",
    name: "EZEQUIEL, MELISSA E RIHANNA",
    integrantes: ["Ezequiel", "Melissa", "Rihanna"],
    temaReferencia: "taiga",
    temaReferenciaNome: "Taiga",
    badge: "Taiga · Ezequiel, Melissa e Rihanna",
    description: "Projeto Taiga Inteligente — Ezequiel, Melissa e Rihanna",
    presentationType: "triggers",
    intro: VIDEOS_CATALOG.ezequiel_intro,
    triggers: [
      VIDEOS_CATALOG.ezequiel_g1,
      VIDEOS_CATALOG.ezequiel_g2,
      VIDEOS_CATALOG.ezequiel_g3,
      VIDEOS_CATALOG.ezequiel_g4,
    ],
  },

  // GRUPO 3 — MEL, JOSÉ, MARCELA E YASMIN (Referência: MANGUEZAL)
  grupoMelJoseMarcelaYasmin: {
    id: "grupoMelJoseMarcelaYasmin",
    name: "MEL, JOSÉ, MARCELA E YASMIN",
    integrantes: ["Mel", "José", "Marcela", "Yasmin"],
    temaReferencia: "manguezal",
    temaReferenciaNome: "Manguezal",
    badge: "Manguezal · Mel, José, Marcela e Yasmin",
    description: "Projeto Manguezal Inteligente — Mel, José, Marcela e Yasmin",
    presentationType: "triggers",
    intro: VIDEOS_CATALOG.mel_intro,
    triggers: [
      VIDEOS_CATALOG.mel_g1,
      VIDEOS_CATALOG.mel_g2,
      VIDEOS_CATALOG.mel_g3,
      VIDEOS_CATALOG.mel_g4,
    ],
  },

  // GRUPO 4 — ANA, LOHANI, KAUAN E WESLEY (Referência: AMAZÔNIA | Exclusivamente 2 gatilhos)
  grupoAnaLohaniKauanWesley: {
    id: "grupoAnaLohaniKauanWesley",
    name: "ANA, LOHANI, KAUAN E WESLEY",
    integrantes: ["Ana", "Lohani", "Kauan", "Wesley"],
    temaReferencia: "amazonia",
    temaReferenciaNome: "Amazônia",
    badge: "Amazônia · Ana, Lohani, Kauan e Wesley",
    description: "Projeto Amazônia Inteligente — Ana, Lohani, Kauan e Wesley",
    presentationType: "triggers",
    intro: VIDEOS_CATALOG.ana_intro,
    triggers: [
      VIDEOS_CATALOG.ana_g1,
      VIDEOS_CATALOG.ana_g2,
    ],
  },

  // GRUPO 5 — MIGUEL, MARIANA, BIANCA E LETÍCIA (Referência: CAATINGA | Vídeo único completo)
  grupoMiguelMarianaBiancaLeticia: {
    id: "grupoMiguelMarianaBiancaLeticia",
    name: "MIGUEL, MARIANA, BIANCA E LETÍCIA",
    integrantes: ["Miguel", "Mariana", "Bianca", "Letícia"],
    temaReferencia: "caatinga",
    temaReferenciaNome: "Caatinga",
    badge: "Caatinga · Miguel, Mariana, Bianca e Letícia",
    description: "Projeto Caatinga Inteligente — Apresentação em vídeo completo + Quiz da Caatinga",
    presentationType: "full_video",
    intro: null,
    fullVideo: VIDEOS_CATALOG.miguel_full,
    triggers: [],
  },
};

/**
 * Lista oficial ordenada dos 5 grupos cadastrados.
 */
export const ALL_GROUPS_LIST: GroupDefinition[] = [
  GROUPS_CONFIG.grupoDaviSamaraMilenaJoao,
  GROUPS_CONFIG.grupoEzequielMelissaRihanna,
  GROUPS_CONFIG.grupoMelJoseMarcelaYasmin,
  GROUPS_CONFIG.grupoAnaLohaniKauanWesley,
  GROUPS_CONFIG.grupoMiguelMarianaBiancaLeticia,
];

export const DEFAULT_GROUP_ID = "grupoDaviSamaraMilenaJoao";

/**
 * Consulta centralizada de grupo pelo identificador.
 */
export function getGroupById(groupId: string): GroupDefinition {
  if (GROUPS_CONFIG[groupId]) {
    return GROUPS_CONFIG[groupId];
  }
  if (groupId === "taiga_davi_samara_milena_joao" || groupId === "bambucal_davi") {
    return GROUPS_CONFIG.grupoDaviSamaraMilenaJoao;
  }
  return GROUPS_CONFIG[DEFAULT_GROUP_ID];
}

/**
 * Consulta centralizada de vídeo por identificador único (intro, full_video ou gatilho) dentro de um grupo.
 */
export function getVideoById(groupId: string, videoId: string): GroupVideoAsset | null {
  const group = getGroupById(groupId);
  if ((videoId === "full_video" || videoId === group.fullVideo?.id) && group.fullVideo) {
    return group.fullVideo;
  }
  if ((videoId === "intro" || videoId === group.intro?.id) && group.intro) {
    return group.intro;
  }
  return group.triggers.find(t => t.id === videoId) || null;
}

/**
 * ============================================================================
 * 3. SISTEMA CENTRALIZADO DE QUIZZES INTERATIVOS (5 ECOSSISTEMAS)
 * Nível intermediário para 9º ano · 5 perguntas por quiz · 1.000 pts por acerto
 * ============================================================================
 */
export const QUIZZES_CONFIG: Record<ThemeId, EcosystemQuiz> = {
  amazonia: {
    id: "quiz_amazonia",
    themeId: "amazonia",
    ecosystemName: "Amazônia",
    title: "Quiz da Amazônia Inteligente",
    subtitle: "Desafios ecológicos, biodiversidade e monitoramento com IoT e IA",
    pointsPerQuestion: 1000,
    maxScore: 5000,
    questions: [
      {
        id: "amz_q1",
        topic: "caracteristicas",
        question: "Qual característica climática e estrutural define a maior parte do bioma Amazônia?",
        options: [
          "Clima equatorial quente e úmido com floresta densa em camadas",
          "Clima polar seco com vegetação rasteira de liquens",
          "Baixa umidade anual com predomínio de cactos esparsos",
          "Estações de neve intensa e árvores aciculifoliadas"
        ],
        correctIndex: 0,
        feedback: "A Amazônia possui clima equatorial quente e úmido, formando uma floresta tropical fechada e estratificada."
      },
      {
        id: "amz_q2",
        topic: "fauna_flora",
        question: "Qual combinação representa corretamente uma espécie da fauna e uma da flora amazônica?",
        options: [
          "Lobo-cinzento e pinheiro-escocês",
          "Onça-pintada e vitória-régia",
          "Panda-gigante e bambu-gigante",
          "Tatu-bola e mandacaru"
        ],
        correctIndex: 1,
        feedback: "A onça-pintada é predadora de topo na floresta amazônica e a vitória-régia é símbolo da flora aquática de seus rios."
      },
      {
        id: "amz_q3",
        topic: "importancia",
        question: "Por que os chamados 'rios voadores' da Amazônia são fundamentais para a América do Sul?",
        options: [
          "Porque congelam as nascentes da Cordilheira dos Andes no verão",
          "Porque transportam grandes massas de umidade que alimentam chuvas em outras regiões",
          "Porque impedem a fotossíntese no dossel superior da floresta",
          "Porque aumentam a salinidade dos lençóis freáticos continentais"
        ],
        correctIndex: 1,
        feedback: "A evapotranspiração intensa das árvores libera vapor d'água que viaja pela atmosfera e sustenta o regime de chuvas."
      },
      {
        id: "amz_q4",
        topic: "ameacas_preservacao",
        question: "Qual conjunto de ações representa hoje as principais ameaças à conservação da Amazônia?",
        options: [
          "Reflorestamento nativo e reservas extrativistas sustentáveis",
          "Desmatamento ilegal, queimadas e garimpo sem controle ambiental",
          "Polinização natural por abelhas e dispersão de sementes",
          "Rotação agroecológica em áreas já degradadas"
        ],
        correctIndex: 1,
        feedback: "Desmatamento, fogo provocado e mineração ilegal fragmentam habitats e contaminam os rios amazônicos."
      },
      {
        id: "amz_q5",
        topic: "tecnologia",
        question: "Como sensores IoT e Inteligência Artificial podem atuar juntos na proteção da Amazônia?",
        options: [
          "Substituindo rios naturais por canais artificiais de concreto",
          "Detectando áudio de motosserras, focos de calor e variações no solo em tempo real",
          "Aumentando a emissão de CO2 para acelerar o corte de madeira",
          "Bloqueando sinais de satélite sobre áreas de preservação"
        ],
        correctIndex: 1,
        feedback: "Sensores bioacústicos, câmeras inteligentes e satélites com IA identificam alertas de desmatamento e incêndio rapidamente."
      }
    ]
  },

  taiga: {
    id: "quiz_taiga",
    themeId: "taiga",
    ecosystemName: "Taiga",
    title: "Quiz da Taiga Boreal",
    subtitle: "Adaptações ao frio extremo, coníferas e monitoramento climático",
    pointsPerQuestion: 1000,
    maxScore: 5000,
    questions: [
      {
        id: "tai_q1",
        topic: "caracteristicas",
        question: "Qual é a principal característica ambiental da Taiga, também chamada de Floresta Boreal?",
        options: [
          "Invernos longos e rigorosos, verões curtos e grandes extensões de coníferas",
          "Clima tropical chuvoso o ano inteiro com mangues costeiros",
          "Temperaturas acima de 35°C e ausência quase total de chuvas",
          "Alagamentos marinhos diários causados pelas marés altas"
        ],
        correctIndex: 0,
        feedback: "Localizada em altas latitudes do Hemisfério Norte, a Taiga combina frio intenso, neve prolongada e florestas de pinheiros."
      },
      {
        id: "tai_q2",
        topic: "fauna_flora",
        question: "Por que as árvores coníferas (como pinheiros e abetos) têm folhas em formato de agulha na Taiga?",
        options: [
          "Para atrair macacos e tucanos durante o verão boreal",
          "Para reduzir a perda de água e evitar que o peso da neve quebre os ramos",
          "Para absorver água salgada diretamente das ondas oceânicas",
          "Para perder todas as folhas a cada semana de outono"
        ],
        correctIndex: 1,
        feedback: "Folhas finas e cerosas retêm umidade no solo congelado e permitem que a neve deslize sem danificar a copa."
      },
      {
        id: "tai_q3",
        topic: "importancia",
        question: "Qual é o papel estratégico da Taiga no equilíbrio climático do planeta?",
        options: [
          "Armazenar enormes quantidades de carbono na biomassa e nos solos frios",
          "Aumentar a temperatura média dos oceanos tropicais",
          "Gerar tempestades de areia para fertilizar desertos quentes",
          "Produzir sal marinho para os estuários costeiros"
        ],
        correctIndex: 0,
        feedback: "A extensa cobertura vegetal e o solo congelado da Taiga funcionam como gigantescos reservatórios de carbono."
      },
      {
        id: "tai_q4",
        topic: "ameacas_preservacao",
        question: "Qual fenômeno ligado ao aquecimento global preocupa cientistas que monitoram a Taiga?",
        options: [
          "Aumento de incêndios florestais e degelo de solos ricos em carbono",
          "Congelamento definitivo da linha do Equador",
          "Avanço das dunas de cactos sobre áreas urbanas litorâneas",
          "Multiplicação excessiva de recifes de corais boreais"
        ],
        correctIndex: 0,
        feedback: "O aumento de temperatura intensifica queimadas boreais e o descongelamento do solo, liberando gases de efeito estufa."
      },
      {
        id: "tai_q5",
        topic: "tecnologia",
        question: "Qual tecnologia é mais útil para monitorar animais e variações térmicas na Taiga?",
        options: [
          "Boias oceânicas de salinidade instaladas em praias tropicais",
          "Sensores criogênicos de temperatura e câmeras térmicas com drones resistentes ao frio",
          "Medidores de irrigação agrícola para plantações de mandioca",
          "Radares submarinos exclusivos de corais de água quente"
        ],
        correctIndex: 1,
        feedback: "Sensores de congelamento, estações subárticas e câmeras infravermelhas permitem monitorar clima e fauna sem perturbar o ambiente."
      }
    ]
  },

  caatinga: {
    id: "quiz_caatinga",
    themeId: "caatinga",
    ecosystemName: "Caatinga",
    title: "Quiz da Caatinga Inteligente",
    subtitle: "Sertão brasileiro, adaptações à seca e tecnologias hídricas",
    pointsPerQuestion: 1000,
    maxScore: 5000,
    questions: [
      {
        id: "caa_q1",
        topic: "caracteristicas",
        question: "O que torna a Caatinga única entre os grandes biomas mundiais?",
        options: [
          "É o único bioma exclusivamente brasileiro, adaptado ao clima semiárido",
          "É uma floresta submersa em água congelada durante dez meses",
          "Fica localizada apenas nas montanhas nevadas da Europa",
          "Apresenta chuvas constantes superiores a 4.000 mm por ano"
        ],
        correctIndex: 0,
        feedback: "A Caatinga existe exclusivamente no Brasil e abriga grande riqueza de espécies adaptadas a longos períodos de seca."
      },
      {
        id: "caa_q2",
        topic: "fauna_flora",
        question: "Qual adaptação permite que cactos como o mandacaru sobrevivam à escassez de água na Caatinga?",
        options: [
          "Folhas largas e finas que evaporam água continuamente",
          "Folhas transformadas em espinhos e caules capazes de armazenar água",
          "Raízes aéreas flutuantes em águas estuarinas salobras",
          "Pelagem densa para resistir a temperaturas abaixo de -20°C"
        ],
        correctIndex: 1,
        feedback: "Espinhos reduzem a perda de água por transpiração e o caule suculento funciona como reserva hídrica natural."
      },
      {
        id: "caa_q3",
        topic: "importancia",
        question: "Por que a conservação da biodiversidade da Caatinga também é vital para as populações locais?",
        options: [
          "Porque a vegetação nativa protege o solo contra desertificação e sustenta abelhas, fauna e agricultura familiar",
          "Porque impede a incidência de energia solar no Nordeste brasileiro",
          "Porque elimina a necessidade de reservatórios e cisternas rurais",
          "Porque transforma o clima semiárido em clima polar em poucas décadas"
        ],
        correctIndex: 0,
        feedback: "A cobertura vegetal mantém a fertilidade do solo, favorece a polinização e ajuda a reter água no período chuvoso."
      },
      {
        id: "caa_q4",
        topic: "ameacas_preservacao",
        question: "Qual problema ambiental agrava a degradação do solo na Caatinga quando há desmatamento e queimadas?",
        options: [
          "Desertificação com perda de nutrientes e redução da recarga hídrica",
          "Formação de geleiras permanentes sobre as serras do sertão",
          "Aumento de enchentes marinhas causadas por manguezais",
          "Excesso permanente de neve bloqueando estradas rurais"
        ],
        correctIndex: 0,
        feedback: "Sem vegetação nativa, o solo fica exposto à erosão solar e hídrica, acelerando processos de desertificação."
      },
      {
        id: "caa_q5",
        topic: "tecnologia",
        question: "Como sistemas inteligentes ajudam na convivência sustentável com o semiárido da Caatinga?",
        options: [
          "Usando irrigação por gotejamento automatizada, sensores de umidade do solo e controle de cisternas por IoT",
          "Mantendo bombas de água ligadas sem controle em horários de sol forte",
          "Desativando painéis solares durante períodos de alta insolação",
          "Substituindo cisternas por fontes artificiais de água salgada"
        ],
        correctIndex: 0,
        feedback: "Sensores de umidade e nível em cisternas ligados à energia solar otimizam cada gota de água no sertão."
      }
    ]
  },

  bambucal: {
    id: "quiz_bambucal",
    themeId: "bambucal",
    ecosystemName: "Bambuçal",
    title: "Quiz do Bambuçal Inteligente",
    subtitle: "Dinâmica dos bambuzais, fauna associada e monitoramento IoT",
    pointsPerQuestion: 1000,
    maxScore: 5000,
    questions: [
      {
        id: "bam_q1",
        topic: "caracteristicas",
        question: "Qual característica botânica torna os bambus tão eficientes na regeneração rápida de áreas verdes?",
        options: [
          "Crescimento acelerado a partir de rizomas subterrâneos resistentes",
          "Crescimento de apenas um milímetro a cada década",
          "Dependência exclusiva de temperaturas abaixo de zero grau",
          "Ausência completa de raízes no solo"
        ],
        correctIndex: 0,
        feedback: "O bambu é uma gramínea gigante com rede de rizomas que brota rapidamente e protege encostas contra erosão."
      },
      {
        id: "bam_q2",
        topic: "fauna_flora",
        question: "Quais animais são símbolos clássicos dependentes de habitats preservados de bambuzais?",
        options: [
          "Panda-gigante e panda-vermelho, além de aves especializadas do sub-bosque",
          "Urso-polar e pinguim-imperador",
          "Boto-cor-de-rosa e peixe-boi-da-amazônia",
          "Caranguejo-uçá e guará-vermelho"
        ],
        correctIndex: 0,
        feedback: "Pandas gigantes e vermelhos utilizam o bambu como base alimentar, enquanto diversas aves usam os colmos para abrigo."
      },
      {
        id: "bam_q3",
        topic: "importancia",
        question: "Além de abrigar fauna específica, qual benefício ambiental os bambuzais oferecem aos ecossistemas?",
        options: [
          "Sequestro intenso de carbono, proteção contra erosão e fornecimento de biomassa renovável",
          "Ressecamento total dos lençóis freáticos ao redor das nascentes",
          "Liberação contínua de metais pesados na atmosfera",
          "Destruição de toda microfauna benéfica do solo"
        ],
        correctIndex: 0,
        feedback: "Os bambuzais absorvem CO2 em altas taxas e suas raízes entrelaçadas estabilizam margens e solos inclinados."
      },
      {
        id: "bam_q4",
        topic: "ameacas_preservacao",
        question: "Que risco ocorre quando há exploração descontrolada ou fragmentação dos bambuzais?",
        options: [
          "Perda de corredores ecológicos, escassez de alimento para a fauna e maior vulnerabilidade a incêndios",
          "Congelamento das raízes aéreas pelo excesso de maré alta",
          "Aumento imediato da espessura das calotas polares",
          "Transformação automática dos colmos em rochas vulcânicas"
        ],
        correctIndex: 0,
        feedback: "Cortar áreas contínuas de bambu isola populações animais e reduz abrigo, alimento e proteção do solo."
      },
      {
        id: "bam_q5",
        topic: "tecnologia",
        question: "De que maneira câmeras inteligentes e sensores bioacústicos protegem os bambuzais?",
        options: [
          "Monitorando passagem da fauna, identificando cantos de aves e detectando intrusões ou fumaça em trilhas",
          "Aumentando ruídos industriais para espantar animais nativos",
          "Substituindo brotos de bambu por cabos plásticos permanentes",
          "Cortando colmos saudáveis automaticamente sem análise prévia"
        ],
        correctIndex: 0,
        feedback: "Câmeras com visão computacional e matrizes acústicas acompanham a saúde da fauna sem interferência humana."
      }
    ]
  },

  manguezal: {
    id: "quiz_manguezal",
    themeId: "manguezal",
    ecosystemName: "Manguezal",
    title: "Quiz do Manguezal Inteligente",
    subtitle: "Zona estuarina, raízes aéreas, marés e tecnologia costeira",
    pointsPerQuestion: 1000,
    maxScore: 5000,
    questions: [
      {
        id: "man_q1",
        topic: "caracteristicas",
        question: "Onde se desenvolvem os manguezais e qual é a principal característica de sua água?",
        options: [
          "Em zonas costeiras de transição entre rios e mar, com água salobra e variação de marés",
          "No topo de montanhas nevadas acima de 4.000 metros",
          "Em desertos continentais distantes de qualquer oceano",
          "Exclusivamente em lagos congelados do círculo polar"
        ],
        correctIndex: 0,
        feedback: "O manguezal é um ecossistema costeiro de encontro entre água doce dos rios e água salgada do mar."
      },
      {
        id: "man_q2",
        topic: "fauna_flora",
        question: "Para que servem as raízes aéreas (escoras e pneumatóforos) das árvores de mangue?",
        options: [
          "Sustentar as árvores na lama instável e captar oxigênio em um solo encharcado",
          "Armazenar neve durante o inverno para resfriar os peixes",
          "Afastar caranguejos e alevinos das margens costeiras",
          "Impedir a passagem da luz solar para todas as plantas do litoral"
        ],
        correctIndex: 0,
        feedback: "Como o lodo do mangue tem pouco oxigênio, raízes adaptadas garantem respiração vegetal e firmeza contra as marés."
      },
      {
        id: "man_q3",
        topic: "importancia",
        question: "Por que o manguezal é conhecido como o 'berçário da vida marinha'?",
        options: [
          "Porque oferece abrigo e alimento abundante para peixes jovens, crustáceos e moluscos",
          "Porque concentra tubarões adultos de águas profundas o ano todo",
          "Porque bloqueia totalmente a reprodução de espécies marinhas",
          "Porque impede o ciclo da água entre oceanos e continentes"
        ],
        correctIndex: 0,
        feedback: "As raízes submersas protegem filhotes contra grandes predadores e concentram nutrientes essenciais."
      },
      {
        id: "man_q4",
        topic: "ameacas_preservacao",
        question: "Quais impactos humanos representam maior perigo para a sobrevivência dos manguezais?",
        options: [
          "Aterramento para construções, despejo de esgoto sem tratamento e acúmulo de lixo plástico",
          "Variação natural diária entre maré cheia e maré baixa",
          "Presença de caranguejos-uçá e aves costeiras como o guará-vermelho",
          "Crescimento natural de mudas jovens de mangue-vermelho"
        ],
        correctIndex: 0,
        feedback: "Poluição orgânica, plásticos e aterros destroem o berçário costeiro e reduzem a proteção contra ressacas."
      },
      {
        id: "man_q5",
        topic: "tecnologia",
        question: "Quais sensores IoT são essenciais para monitorar a saúde de um manguezal inteligente?",
        options: [
          "Sensores de salinidade, oxigênio dissolvido, pH da água, nível da maré e drones costeiros",
          "Sondas de espessura de gelo glacial e sensores de tempestade de neve",
          "Irrigadores de solo árido ligados ao armazenamento de cisternas",
          "Aquecedores submersos para elevar artificialmente o pH marinho"
        ],
        correctIndex: 0,
        feedback: "Monitorar salinidade, oxigenação e variação das marés em tempo real alerta rapidamente sobre contaminação ou desequilíbrio."
      }
    ]
  }
};

export const ALL_QUIZZES_LIST: EcosystemQuiz[] = [
  QUIZZES_CONFIG.amazonia,
  QUIZZES_CONFIG.taiga,
  QUIZZES_CONFIG.caatinga,
  QUIZZES_CONFIG.bambucal,
  QUIZZES_CONFIG.manguezal,
];

export function getQuizByThemeId(themeId: ThemeId): EcosystemQuiz {
  return QUIZZES_CONFIG[themeId] || QUIZZES_CONFIG.amazonia;
}

/**
 * ============================================================================
 * 4. NORMALIZAÇÃO E RECONHECIMENTO DE VOZ POR GRUPO ATIVO
 * ============================================================================
 */
export function normalizeVoiceText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Reconhecimento de voz para Grupo 1 — DAVI, SAMARA, MILENA E JOÃO
 */
export function matchDaviTrigger(norm: string): string | null {
  if (
    norm.includes("bambuzal") ||
    norm.includes("bambuzais") ||
    norm.includes("bambu") ||
    norm.includes("perigos nos bambuzais") ||
    norm.includes("perigo nos bambuzais") ||
    norm.includes("perigos no bambuzal")
  ) {
    return "davi_g2";
  }

  if (
    norm.includes("fauna") ||
    norm.includes("problemas para a fauna") ||
    norm.includes("problema para a fauna") ||
    norm.includes("problemas na fauna") ||
    (norm.includes("problema") && (norm.includes("animais") || norm.includes("animal")))
  ) {
    return "davi_g1";
  }

  if (
    norm.includes("monitoramento") ||
    norm.includes("monitorar") ||
    norm.includes("monitora") ||
    norm.includes("como funciona o monitoramento") ||
    norm.includes("sensores")
  ) {
    return "davi_g3";
  }

  if (
    norm.includes("conecta") ||
    norm.includes("conectar") ||
    norm.includes("conexao") ||
    norm.includes("conexoes") ||
    norm.includes("como tudo se conecta") ||
    norm.includes("tudo se conecta")
  ) {
    return "davi_g4";
  }

  return null;
}

/**
 * Reconhecimento de voz para Grupo 2 — EZEQUIEL, MELISSA E RIHANNA
 */
export function matchEzequielTrigger(norm: string): string | null {
  if (
    norm === "tchau" ||
    norm.startsWith("tchau ") ||
    norm.endsWith(" tchau") ||
    norm.includes("tchau") ||
    norm.includes("adeus") ||
    norm.includes("ate logo")
  ) {
    return "ezequiel_g4";
  }

  if (
    norm.includes("fogueira") ||
    norm.includes("fogo na neve") ||
    norm.includes("fazer fogo") ||
    norm.includes("fazer uma fogueira") ||
    norm.includes("acender fogueira") ||
    norm.includes("fogueira na neve")
  ) {
    return "ezequiel_g3";
  }

  if (
    norm.includes("animal") ||
    norm.includes("animais") ||
    norm.includes("animais da taiga") ||
    norm.includes("sobreviver aos animais") ||
    norm.includes("sobreviver com os animais") ||
    norm.includes("urso") ||
    norm.includes("lobo")
  ) {
    return "ezequiel_g1";
  }

  if (
    norm.includes("me fale como posso sobreviver") ||
    norm.includes("como posso sobreviver") ||
    norm.includes("sobreviver na taiga") ||
    norm.includes("sobrevivencia na taiga") ||
    norm.includes("sobrevivencia") ||
    norm.includes("sobreviver")
  ) {
    return "ezequiel_g2";
  }

  return null;
}

/**
 * Reconhecimento de voz para Grupo 3 — MEL, JOSÉ, MARCELA E YASMIN
 */
export function matchMelTrigger(norm: string): string | null {
  if (
    norm === "tchau" ||
    norm.startsWith("tchau ") ||
    norm.endsWith(" tchau") ||
    norm.includes("tchau") ||
    norm.includes("adeus") ||
    norm.includes("ate logo")
  ) {
    return "mel_g4";
  }

  if (
    norm.includes("monitoramento") ||
    norm.includes("monitorar") ||
    norm.includes("monitora") ||
    norm.includes("como funciona o monitoramento") ||
    norm.includes("sensores")
  ) {
    return "mel_g3";
  }

  if (
    norm.includes("tecnologia") ||
    norm.includes("como a tecnologia pode ajudar") ||
    norm.includes("tecnologia pode ajudar") ||
    norm.includes("ajudar")
  ) {
    return "mel_g2";
  }

  if (
    norm.includes("manguezal") ||
    norm.includes("mangue") ||
    norm.includes("me fale mais sobre o manguezal") ||
    norm.includes("fale mais sobre o manguezal") ||
    norm.includes("sobre o manguezal")
  ) {
    return "mel_g1";
  }

  return null;
}

/**
 * Reconhecimento de voz para Grupo 4 — ANA, LOHANI, KAUAN E WESLEY (apenas 2 gatilhos)
 */
export function matchAnaTrigger(norm: string): string | null {
  if (
    norm === "tchau" ||
    norm.startsWith("tchau ") ||
    norm.endsWith(" tchau") ||
    norm.includes("tchau") ||
    norm.includes("adeus") ||
    norm.includes("ate logo")
  ) {
    return "ana_g2";
  }

  if (
    norm.includes("amazonia") ||
    norm.includes("mais sobre a amazonia") ||
    norm.includes("fale sobre a amazonia") ||
    norm.includes("sobre a amazonia")
  ) {
    return "ana_g1";
  }

  return null;
}

/**
 * Reconhecedor centralizado de gatilhos para o grupo ativo selecionado.
 * Garante isolamento total entre grupos e respeita apresentação sem gatilhos (full_video).
 */
export function matchTriggerForActiveGroup(input: string, groupId: string): string | null {
  const norm = normalizeVoiceText(input);
  if (!norm) return null;

  const group = getGroupById(groupId);
  if (group.presentationType === "full_video" || group.triggers.length === 0) {
    return null;
  }

  // 1. Checagem exata contra as frases cadastradas do grupo ativo
  for (const t of group.triggers) {
    const tNorm = normalizeVoiceText(t.phrase);
    if (norm === tNorm || norm.includes(tNorm) || tNorm.includes(norm)) {
      return t.id;
    }
  }

  // 2. Matcher especializado por grupo
  if (group.id === "grupoDaviSamaraMilenaJoao") {
    const res = matchDaviTrigger(norm);
    if (res) return res;
  } else if (group.id === "grupoEzequielMelissaRihanna") {
    const res = matchEzequielTrigger(norm);
    if (res) return res;
  } else if (group.id === "grupoMelJoseMarcelaYasmin") {
    const res = matchMelTrigger(norm);
    if (res) return res;
  } else if (group.id === "grupoAnaLohaniKauanWesley") {
    const res = matchAnaTrigger(norm);
    if (res) return res;
  }

  // 3. Fallback semântico restrito aos gatilhos do grupo ativo
  for (const t of group.triggers) {
    const words = normalizeVoiceText(t.phrase).split(" ").filter(w => w.length > 2);
    const hits = words.filter(w => norm.includes(w)).length;
    if (words.length > 0 && hits >= Math.ceil(words.length * 0.5)) {
      return t.id;
    }
  }

  return null;
}
