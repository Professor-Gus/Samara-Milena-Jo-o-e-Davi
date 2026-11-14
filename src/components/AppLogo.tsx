import React, { useId } from "react";

interface AppLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AppLogoProps["size"]>, string> = {
  xs: "w-7 h-7",
  sm: "w-9 h-9 sm:w-10 sm:h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28 sm:w-32 sm:h-32"
};

/**
 * Logo oficial exclusiva: ASSISTENTES DA NATUREZA | 9º A – OSMARINHO
 * Conceito:
 * - Árvore e folha central representando a natureza
 * - Circuitos eletrônicos nas folhas e raízes representando IoT e IA
 * - Anel planetário envolvendo o símbolo representando os ecossistemas
 * - Detalhes sutis de monitoramento ambiental em verde-neon, verde natural e azul tecnológico
 * - Fundo 100% transparente e legibilidade em qualquer escala
 */
export const AppLogo: React.FC<AppLogoProps> = ({ size = "sm", className = "" }) => {
  const uid = useId().replace(/:/g, "");
  const gradLeafId = `leaf-grad-${uid}`;
  const gradRingId = `ring-grad-${uid}`;
  const glowId = `neon-glow-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${SIZE_CLASSES[size]} shrink-0 select-none ${className}`}
      role="img"
      aria-label="Logo Assistentes da Natureza 9º A Osmarinho"
    >
      <defs>
        <linearGradient id={gradLeafId} x1="30" y1="18" x2="90" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>

        <linearGradient id={gradRingId} x1="12" y1="16" x2="108" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>

        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Planetary / Ecosystem Ring */}
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke={`url(#${gradRingId})`}
        strokeWidth="2.4"
        strokeDasharray="190 14 26 14"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      {/* Inner Orbital Sensor Arc */}
      <circle
        cx="60"
        cy="60"
        r="43"
        stroke="#38bdf8"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />

      {/* Orbital Monitoring Nodes */}
      <circle cx="60" cy="10" r="3" fill="#4ade80" filter={`url(#${glowId})`} />
      <circle cx="105" cy="79" r="2.6" fill="#38bdf8" filter={`url(#${glowId})`} />
      <circle cx="15" cy="79" r="2.6" fill="#22c55e" filter={`url(#${glowId})`} />

      {/* Central Leaf / Canopy Silhouette */}
      <path
        d="M60 21C42 33 34 50 38 66C41 77 50 83 60 85C70 83 79 77 82 66C86 50 78 33 60 21Z"
        fill={`url(#${gradLeafId})`}
        fillOpacity="0.18"
        stroke={`url(#${gradLeafId})`}
        strokeWidth="2.6"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      {/* Central Trunk & Digital Backbone */}
      <path
        d="M60 30V93"
        stroke="#4ade80"
        strokeWidth="2.6"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      {/* Electronic Leaf Circuit Veins (IoT + AI) */}
      <path
        d="M60 44L48 37M48 37H43"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="37" r="2.2" fill="#38bdf8" />

      <path
        d="M60 44L72 37M72 37H77"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="37" r="2.2" fill="#4ade80" />

      <path
        d="M60 58L44 52L41 55"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="56" r="2.2" fill="#4ade80" />

      <path
        d="M60 58L76 52L79 55"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="56" r="2.2" fill="#38bdf8" />

      <path
        d="M60 72L47 68"
        stroke="#38bdf8"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="45.5" cy="67.5" r="2" fill="#38bdf8" />

      <path
        d="M60 72L73 68"
        stroke="#4ade80"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="74.5" cy="67.5" r="2" fill="#4ade80" />

      {/* Central AI Core Node */}
      <circle cx="60" cy="56" r="4.2" fill="#06b6d4" stroke="#f0fdf4" strokeWidth="1.4" filter={`url(#${glowId})`} />

      {/* Circuit Roots representing Connected Ecosystems */}
      <path
        d="M60 90L49 97H41"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="39.5" cy="97" r="2.2" fill="#4ade80" />

      <path
        d="M60 90L71 97H79"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="80.5" cy="97" r="2.2" fill="#38bdf8" />

      <path
        d="M60 93V103"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="104.5" r="2.2" fill="#38bdf8" />
    </svg>
  );
};
