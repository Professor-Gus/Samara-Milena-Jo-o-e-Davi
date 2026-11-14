import manguezalSmartImg from "./assets/images/manguezal_smart_1794534276228.jpg";

export type ThemeId = "amazonia" | "taiga" | "caatinga" | "bambucal" | "manguezal";

export interface ThemeColors {
  bgApp: string;          // Main background
  bgSurface: string;      // Cards and main panels
  bgCard: string;         // Inner cards / sections
  bgElevated: string;     // Elevated popovers / sheets
  bgInput: string;        // Text inputs and chips
  borderMain: string;     // Primary structural borders
  borderSubtle: string;   // Secondary dividing borders
  primary: string;        // Main theme action color
  primaryHover: string;   // Hover state
  primaryText: string;    // Contrast text on primary button
  accent: string;         // Highlights, badges, pulse rings
  accentText: string;     // Text for accent badges
  textPrimary: string;    // Headings, titles
  textSecondary: string;  // Body text
  textMuted: string;      // Captions, subtitles, hints
  chipBg: string;         // Suggested questions chip bg
  chipHoverBg: string;    // Suggested questions hover bg
  glow: string;           // Shadows and glow highlights
}

export interface FaunaSpecies {
  name: string;
  scientificName: string;
  category: string;
  status: string;
}

export interface SmartDevice {
  name: string;
  type: string;
  status: "online" | "transmitting" | "monitoring" | "active";
  telemetry: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  environmentTitle: string;
  biome: string;
  shortCaracteristica: string;
  colorsDescription: string;
  bgImage: string;
  particleType: "fireflies" | "snow" | "dust" | "leaves" | "ripples";
  glowColor: string;
  iconName: "Trees" | "TreePine" | "Sun" | "Sprout" | "Waves";
  swatches: [string, string, string, string]; // 4 representative color swatches
  colors: ThemeColors;
  animals: FaunaSpecies[];
  smartDevices: SmartDevice[];
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  amazonia: {
    id: "amazonia",
    name: "Amazônia",
    environmentTitle: "Floresta Inteligente",
    biome: "Floresta Tropical Densa, Rios & Sensores Ambientais",
    shortCaracteristica: "Floresta tropical, vegetação densa, rios e sensores ambientais",
    colorsDescription: "Verde-floresta, verde-esmeralda e verde-neon",
    bgImage: "/assets/images/amazonia_smart.jpg",
    particleType: "fireflies",
    glowColor: "rgba(16, 185, 129, 0.4)",
    iconName: "Trees",
    swatches: ["#03140c", "#064e3b", "#10b981", "#84cc16"],
    colors: {
      bgApp: "#020e07",
      bgSurface: "#05180f",
      bgCard: "#092418",
      bgElevated: "#0c3020",
      bgInput: "#03140b",
      borderMain: "#10b981",
      borderSubtle: "#0b432a",
      primary: "#10b981",
      primaryHover: "#34d399",
      primaryText: "#02170d",
      accent: "#84cc16",
      accentText: "#02170d",
      textPrimary: "#f0fdf4",
      textSecondary: "#bbf7d0",
      textMuted: "#6ee7b7",
      chipBg: "#082518",
      chipHoverBg: "#10b981",
      glow: "rgba(16, 185, 129, 0.25)"
    },
    animals: [
      { name: "Onça-pintada", scientificName: "Panthera onca", category: "Predador de Topo", status: "Monitorada por IA" },
      { name: "Arara-vermelha", scientificName: "Ara chloropterus", category: "Avifauna do Dossel", status: "Em Revoada Ativa" },
      { name: "Tucano", scientificName: "Ramphastos toco", category: "Dispersor Florestal", status: "Avistado na Copa" },
      { name: "Bicho-preguiça", scientificName: "Bradypus tridactylus", category: "Mamífero Arborícola", status: "Movimento Tranquilo" },
      { name: "Boto-cor-de-rosa", scientificName: "Inia geoffrensis", category: "Fauna Fluvial", status: "Rastreamento Hidroacústico" }
    ],
    smartDevices: [
      { name: "Câmera de Monitoramento Florestal", type: "Visão Noturna AI 4K", status: "transmitting", telemetry: "30 fps • Detecção de Fauna" },
      { name: "Sensor de Umidade do Solo", type: "Sonda LoRaWAN Subsuperfície", status: "online", telemetry: "84.2% UR • pH 6.1" },
      { name: "Sensor de Temperatura de Copa", type: "Sensor Térmico de Dossel", status: "monitoring", telemetry: "27.4°C • Sensação 29°C" },
      { name: "Estação Fluvial Amazônica", type: "Boia Telemétrica Solar", status: "online", telemetry: "Nível Rio +4.2m • OD 7.8 mg/L" },
      { name: "Drone de Monitoramento Ambiental", type: "Eco-UAV Autônomo", status: "active", telemetry: "Patrulha 2.4km • Bateria 94%" }
    ]
  },
  taiga: {
    id: "taiga",
    name: "Taiga",
    environmentTitle: "Floresta Boreal Monitorada",
    biome: "Floresta de Coníferas, Neve & Monitoramento Climático",
    shortCaracteristica: "Coníferas, neve, clima frio e monitoramento climático",
    colorsDescription: "Azul-petróleo, verde-pinheiro e azul-gelo",
    bgImage: "/assets/images/taiga_smart.jpg",
    particleType: "snow",
    glowColor: "rgba(56, 189, 248, 0.4)",
    iconName: "TreePine",
    swatches: ["#02131e", "#064e3b", "#0284c7", "#7dd3fc"],
    colors: {
      bgApp: "#010e17",
      bgSurface: "#041926",
      bgCard: "#072638",
      bgElevated: "#0a334b",
      bgInput: "#021420",
      borderMain: "#0284c7",
      borderSubtle: "#07486a",
      primary: "#38bdf8",
      primaryHover: "#7dd3fc",
      primaryText: "#021622",
      accent: "#10b981",
      accentText: "#ffffff",
      textPrimary: "#f0f9ff",
      textSecondary: "#bae6fd",
      textMuted: "#7dd3fc",
      chipBg: "#06283b",
      chipHoverBg: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.25)"
    },
    animals: [
      { name: "Lobo-cinzento", scientificName: "Canis lupus", category: "Líder de Alcateia", status: "Alcance Rastreado" },
      { name: "Urso-pardo", scientificName: "Ursus arctos", category: "Grande Mamífero", status: "Em Forrageamento" },
      { name: "Alce", scientificName: "Alces alces", category: "Herbívoro Nórdico", status: "Vale de Coníferas" },
      { name: "Raposa-vermelha", scientificName: "Vulpes vulpes", category: "Caçadora Ártica", status: "Sensor de Trilha Ativo" },
      { name: "Coruja-das-neves", scientificName: "Bubo scandiacus", category: "Rapina Polar", status: "Em Vigília Noturna" }
    ],
    smartDevices: [
      { name: "Sensores de Temperatura & Congelamento", type: "Sonda Criogênica PT100", status: "monitoring", telemetry: "-14.6°C • Geada Firme" },
      { name: "Câmeras de Monitoramento da Fauna", type: "Sensor Térmico Criogênico", status: "transmitting", telemetry: "Detecção Infravermelha" },
      { name: "Estação Meteorológica Subártica", type: "Anemômetro Ultrassônico", status: "online", telemetry: "Vento 19 km/h NNO • Baro 1025" },
      { name: "Sensores de Qualidade do Ar", type: "Detector Laser de Partículas", status: "online", telemetry: "AQI 08 • PM2.5: 1.8 µg/m³" },
      { name: "Drones de Observação Boreal", type: "UAV Anti-congelamento", status: "active", telemetry: "Altitude 120m • Rota Polar" }
    ]
  },
  caatinga: {
    id: "caatinga",
    name: "Caatinga",
    environmentTitle: "Sertão Inteligente",
    biome: "Clima Semiárido, Cactos & Monitoramento Hídrico",
    shortCaracteristica: "Semiárido, solo seco, cactos e monitoramento hídrico",
    colorsDescription: "Areia, terracota, âmbar solar e verde-cacto",
    bgImage: "/assets/images/caatinga_smart.jpg",
    particleType: "dust",
    glowColor: "rgba(249, 115, 22, 0.4)",
    iconName: "Sun",
    swatches: ["#1c0f06", "#9a3412", "#d97706", "#84cc16"],
    colors: {
      bgApp: "#120903",
      bgSurface: "#1e1108",
      bgCard: "#2d1a0e",
      bgElevated: "#3e2414",
      bgInput: "#150b04",
      borderMain: "#ea580c",
      borderSubtle: "#6c2b0c",
      primary: "#f97316",
      primaryHover: "#fb923c",
      primaryText: "#180902",
      accent: "#84cc16",
      accentText: "#180902",
      textPrimary: "#fffbeb",
      textSecondary: "#fed7aa",
      textMuted: "#fde68a",
      chipBg: "#29160a",
      chipHoverBg: "#f97316",
      glow: "rgba(249, 115, 22, 0.25)"
    },
    animals: [
      { name: "Tatu-bola", scientificName: "Tolypeutes tricinctus", category: "Símbolo da Caatinga", status: "Localizado no Solo" },
      { name: "Asa-branca", scientificName: "Patagioenas picazuro", category: "Avifauna do Sertão", status: "Canto Identificado" },
      { name: "Preá", scientificName: "Cavia aperea", category: "Roedor Nativo", status: "Colônia Monitorada" },
      { name: "Raposa-do-campo", scientificName: "Lycalopex vetulus", category: "Canídeo Adaptado", status: "Patrulha Noturna" },
      { name: "Mocó", scientificName: "Kerodon rupestris", category: "Habitante de Rochedos", status: "Abrigo Seguro" }
    ],
    smartDevices: [
      { name: "Sensores de Umidade do Solo", type: "Sensor Capacitivo LoRa", status: "online", telemetry: "19.5% UR • Alerta Hídrico" },
      { name: "Sistemas Inteligentes de Irrigação", type: "Válvulas de Gotejamento AI", status: "monitoring", telemetry: "Fluxo Programado 18:30" },
      { name: "Sensores de Nível de Cisterna", type: "Sensor Hidrostático Ultrassônico", status: "online", telemetry: "Capacidade: 78.4% (39.200L)" },
      { name: "Estação Meteorológica Solar", type: "Piranômetro & Higrômetro", status: "transmitting", telemetry: "Índice UV 9.2 • 33.8°C" },
      { name: "Painéis Solares Inteligentes", type: "Seguidor Fotovoltaico Dual", status: "active", telemetry: "Geração 3.8 kW • Carga 100%" }
    ]
  },
  bambucal: {
    id: "bambucal",
    name: "Bambuçal",
    environmentTitle: "Bosque de Bambu Inteligente",
    biome: "Bambuzais, Vegetação Característica & Fauna Local",
    shortCaracteristica: "Bambuzais, vegetação densa e fauna local monitorada",
    colorsDescription: "Verde-bambu, verde-oliva e amarelo-dourado",
    bgImage: "/assets/images/bambuzal_smart.jpg",
    particleType: "leaves",
    glowColor: "rgba(163, 230, 53, 0.4)",
    iconName: "Sprout",
    swatches: ["#0f1703", "#3f6212", "#65a30d", "#facc15"],
    colors: {
      bgApp: "#090f02",
      bgSurface: "#131d05",
      bgCard: "#1d2c09",
      bgElevated: "#273b0d",
      bgInput: "#0d1503",
      borderMain: "#84cc16",
      borderSubtle: "#44650f",
      primary: "#a3e635",
      primaryHover: "#bef264",
      primaryText: "#101902",
      accent: "#facc15",
      accentText: "#101902",
      textPrimary: "#f7fee7",
      textSecondary: "#d9f99d",
      textMuted: "#fef08a",
      chipBg: "#1a2807",
      chipHoverBg: "#a3e635",
      glow: "rgba(163, 230, 53, 0.25)"
    },
    animals: [
      { name: "Panda-gigante", scientificName: "Ailuropoda melanoleuca", category: "Embaixador Ecológico", status: "Alimentando-se de Bambu" },
      { name: "Panda-vermelho", scientificName: "Ailurus fulgens", category: "Mamífero Arborícola", status: "Empoleirado na Haste" },
      { name: "Faisão-dourado", scientificName: "Chrysolophus pictus", category: "Ave Ornamental Rara", status: "Na Trilha Principal" },
      { name: "Macaco-de-nariz-arrebitado", scientificName: "Rhinopithecus", category: "Primata de Montanha", status: "Em Confraternização" },
      { name: "Pássaros do Bambuzal", scientificName: "Garrulax canorus", category: "Bioacústica Harmoniosa", status: "Cantos Registrados" }
    ],
    smartDevices: [
      { name: "Eco-Sensores de Biomassa", type: "Detector CO2 & Crescimento", status: "transmitting", telemetry: "CO2: 388 ppm • Equilíbrio Puro" },
      { name: "Câmeras de Monitoramento de Fauna", type: "Visão Computacional Edge AI", status: "online", telemetry: "Rastreamento Contínuo" },
      { name: "Sensores de Presença Infravermelho", type: "PIR Micro-ondas 360°", status: "monitoring", telemetry: "Trilha Livre • Trânsito Baixo" },
      { name: "Sistemas Automatizados de Iluminação", type: "LED Biológico Solar 3000K", status: "active", telemetry: "Ciclo Crepuscular Ativo" },
      { name: "Estação Acústica Florestal", type: "Matriz Bioacústica IoT", status: "online", telemetry: "42 dB • Fauna Preservada" }
    ]
  },
  manguezal: {
    id: "manguezal",
    name: "Manguezal",
    environmentTitle: "Ecossistema Costeiro Inteligente",
    biome: "Raízes Aéreas, Mangues, Marés & Fauna Costeira",
    shortCaracteristica: "Raízes aéreas, água estuarina, caranguejos e peixes",
    colorsDescription: "Verde-mangue, turquesa estuarino e azul-oceânico",
    bgImage: manguezalSmartImg,
    particleType: "ripples",
    glowColor: "rgba(45, 212, 191, 0.42)",
    iconName: "Waves",
    swatches: ["#02181a", "#0f766e", "#14b8a6", "#2dd4bf"],
    colors: {
      bgApp: "#011012",
      bgSurface: "#031e22",
      bgCard: "#062f35",
      bgElevated: "#094047",
      bgInput: "#021619",
      borderMain: "#14b8a6",
      borderSubtle: "#0d5760",
      primary: "#2dd4bf",
      primaryHover: "#5eead4",
      primaryText: "#02181a",
      accent: "#10b981",
      accentText: "#02181a",
      textPrimary: "#f0fdfa",
      textSecondary: "#99f6e4",
      textMuted: "#5eead4",
      chipBg: "#052a2f",
      chipHoverBg: "#2dd4bf",
      glow: "rgba(45, 212, 191, 0.28)"
    },
    animals: [
      { name: "Caranguejo-uçá", scientificName: "Ucides cordatus", category: "Crustáceo das Raízes", status: "Toca Monitorada na Maré" },
      { name: "Guará-vermelho", scientificName: "Eudocimus ruber", category: "Ave Costeira Símbolo", status: "Forrageamento no Lodo" },
      { name: "Robalo-flecha", scientificName: "Centropomus undecimalis", category: "Peixe Estuarino", status: "Berçário das Raízes Aéreas" },
      { name: "Garça-azul", scientificName: "Egretta caerulea", category: "Avifauna do Mangue", status: "Voo Baixo no Canal" },
      { name: "Chama-maré", scientificName: "Uca maracoani", category: "Crustáceo Bioindicador", status: "Colônia Saudável Ativa" }
    ],
    smartDevices: [
      { name: "Sensores de Salinidade Estuarina", type: "Sonda Condutivimétrica IoT", status: "online", telemetry: "Salinidade 24.5 PSU • Estável" },
      { name: "Medidores de Nível de Maré", type: "Sensor Radar Ultrassônico", status: "transmitting", telemetry: "Maré Enchente +1.62m" },
      { name: "Câmeras Submersas de Fauna Costeira", type: "Visão Subaquática HD", status: "monitoring", telemetry: "Cardumes Juvenis Detectados" },
      { name: "Sondas de Oxigênio & pH do Mangue", type: "Multiparâmetro Costeiro", status: "online", telemetry: "OD 6.8 mg/L • pH 7.2" },
      { name: "Drones de Mapeamento de Raízes", type: "Eco-UAV Costeiro Autônomo", status: "active", telemetry: "Cobertura Mangue 98% • Bat 92%" }
    ]
  }
};

export const THEME_LIST = [
  THEMES.amazonia,
  THEMES.taiga,
  THEMES.caatinga,
  THEMES.bambucal,
  THEMES.manguezal
];

export function isValidThemeId(id: string | null | undefined): id is ThemeId {
  return id === "amazonia" || id === "taiga" || id === "caatinga" || id === "bambucal" || id === "manguezal";
}

export function normalizeThemeId(id: string | null | undefined): ThemeId {
  if (id === "pantanal") return "manguezal";
  if (isValidThemeId(id)) return id;
  return "amazonia";
}
