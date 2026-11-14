import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Mic, 
  MicOff, 
  Send, 
  Tv, 
  Upload, 
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Settings,
  MessageSquare,
  HelpCircle,
  Video,
  Cloud,
  Database,
  Folder,
  FolderOpen,
  Chrome,
  LogOut,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Play,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Smartphone,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  Radio,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Download,
  Save,
  HardDrive,
  Plus,
  X,
  ArrowUpRight,
  FileText,
  Palette,
  Trees,
  TreePine,
  Sun,
  Sprout,
  Waves,
  Cpu,
  Activity,
  Feather,
  Users,
  Home,
  ArrowLeft,
  Trophy
} from "lucide-react";
import { Trigger } from "./types";
import { safeStorage } from "./safeStorage";
import { ThemeId, THEMES, THEME_LIST, isValidThemeId, normalizeThemeId } from "./themes";
import {
  GROUPS_CONFIG,
  ALL_GROUPS_LIST,
  ALL_QUIZZES_LIST,
  DEFAULT_GROUP_ID,
  GroupDefinition,
  GroupTrigger,
  getGroupById,
  getVideoById,
  matchTriggerForActiveGroup
} from "./groupsConfig";
import { SmartAmbientParticles } from "./components/SmartAmbientParticles";
import { SmartEcosystemModal } from "./components/SmartEcosystemDrawer";
import { AppLogo } from "./components/AppLogo";
import { EcosystemQuizModal } from "./components/EcosystemQuizModal";

export type ExperienceState = 
  | "INTRODUCAO"   // reprodução do vídeo inicial
  | "ESCUTANDO"    // aguardando a fala do usuário
  | "PROCESSANDO"  // identificando a frase ou gatilho
  | "REPRODUZINDO" // executando o vídeo correspondente
  | "AGUARDANDO";  // vídeo finalizado, aguardando uma nova interação

interface CustomQuestion {
  id: string;
  phrase: string;
  videoUrl: string;
  videoName: string;
  isEndingTrigger?: boolean;
}

export type VideoQualityPreference = "hd1080" | "hd720" | "large" | "medium" | "auto";

// Helper to extract YouTube Video ID from any format (standard, short, embed, shorts)
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return Boolean(getYouTubeVideoId(url));
}

export default function App() {
  // Navigation: state to change between the interactive screen "chat" and "settings"
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("chat");

  // Fluxo da Plataforma: Tela Inicial -> Seleção de Grupo -> Apresentação Interativa
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(false);
  const [hasSelectedGroup, setHasSelectedGroup] = useState<boolean>(false);
  const [presentationEnded, setPresentationEnded] = useState<boolean>(false);

  // Sistema Visual Oficial (5 Biomas: Amazônia, Taiga, Caatinga, Bambuçal, Manguezal)
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(() => {
    try {
      const saved = safeStorage.getItem("natureza_selected_theme") || safeStorage.getItem("wit_selected_theme");
      if (saved) {
        return normalizeThemeId(saved);
      }
    } catch (_) {}
    return "amazonia";
  });

  // Grupo de Apresentação Centralizado (3 Grupos Oficiais disponíveis em TODOS os 5 temas)
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    try {
      const saved = safeStorage.getItem("natureza_selected_group_id") || safeStorage.getItem("wit_selected_group_id");
      if (saved && GROUPS_CONFIG[saved]) return saved;
    } catch (_) {}
    return DEFAULT_GROUP_ID;
  });

  const currentTheme = THEMES[selectedThemeId] || THEMES.amazonia;

  // Resolução universal do grupo ativo a partir do arquivo centralizado groupsConfig.ts
  const currentGroup: GroupDefinition = useMemo(() => {
    return getGroupById(selectedGroupId);
  }, [selectedGroupId]);

  // Estados da Experiência: INTRODUCAO | ESCUTANDO | PROCESSANDO | REPRODUZINDO | AGUARDANDO
  const [experienceState, setExperienceState] = useState<ExperienceState>("AGUARDANDO");

  // Estrutura Dinâmica de Vídeos e Gatilhos do Grupo Ativo (suporta gatilhos ou vídeo único completo)
  const isFullVideoGroup = currentGroup.presentationType === "full_video";
  const effectiveIntroUrl = currentGroup.intro?.videoUrl || currentGroup.fullVideo?.videoUrl || "";
  const effectiveIntroName = currentGroup.intro?.videoName || currentGroup.fullVideo?.videoName || currentGroup.name;
  const effectiveQuestions: CustomQuestion[] = useMemo(() => {
    return currentGroup.triggers.map(t => ({
      id: t.id,
      phrase: t.phrase,
      videoUrl: t.videoUrl,
      videoName: t.videoName,
      isEndingTrigger: t.isEndingTrigger,
    }));
  }, [currentGroup]);

  const [showEcosystemModal, setShowEcosystemModal] = useState<boolean>(false);
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [quizTargetThemeId, setQuizTargetThemeId] = useState<ThemeId>("amazonia");

  const handleSelectTheme = (themeId: ThemeId) => {
    const safeId = normalizeThemeId(themeId);
    setSelectedThemeId(safeId);
    try {
      safeStorage.setItem("natureza_selected_theme", safeId);
      safeStorage.setItem("wit_selected_theme", safeId);
    } catch (e) {
      console.warn("Failed to persist selected theme:", e);
    }
    showSaveSuccess(`Tema "${THEMES[safeId]?.name || safeId}" aplicado!`);
  };

  const renderThemeIcon = (iconName: string, className = "w-4.5 h-4.5") => {
    switch (iconName) {
      case "Trees":
        return <Trees className={className} />;
      case "TreePine":
        return <TreePine className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "Sprout":
        return <Sprout className={className} />;
      case "Waves":
        return <Waves className={className} />;
      default:
        return <Palette className={className} />;
    }
  };

  // Toast / Notificação de Salvamento
  const [saveToast, setSaveToast] = useState<{ message: string; visible: boolean; type?: "success" | "info" } | null>(null);

  const showSaveSuccess = (message: string) => {
    setSaveToast({ message, visible: true, type: "success" });
    setTimeout(() => {
      setSaveToast(prev => prev ? { ...prev, visible: false } : null);
    }, 4000);
  };

  // Salvar Preferências do App (Armazenamento Local)
  const handleSaveAllData = () => {
    try {
      safeStorage.setItem("natureza_selected_theme", selectedThemeId);
      safeStorage.setItem("natureza_selected_group_id", selectedGroupId);
      safeStorage.setItem("eco_video_quality", preferredVideoQuality);
      safeStorage.setItem("eco_video_fit", videoFit);
      safeStorage.setItem("eco_force_1080p_only", String(force1080pOnly));
      safeStorage.setItem("eco_mobile_fullscreen_auto", String(mobileFullscreenAuto));
      safeStorage.setItem("eco_speech_engine", preferredSpeechEngine);
      safeStorage.setItem("eco_show_bg_image", String(showBgImage));
      safeStorage.setItem("eco_bg_opacity", String(bgOpacity));
      safeStorage.setItem("natureza_last_saved", new Date().toISOString());

      showSaveSuccess("Preferências visuais, grupo e reprodutor salvos!");
    } catch (err: any) {
      console.warn("Erro ao salvar dados:", err);
      showSaveSuccess("Aviso: Preferências mantidas na sessão atual.");
    }
  };

  // Exportar Backup Completo (.JSON)
  const handleExportBackup = () => {
    try {
      const backupData = {
        app: "ASSISTENTES DA NATUREZA - 9º A OSMARINHO",
        version: "3.0",
        exportedAt: new Date().toISOString(),
        theme: selectedThemeId,
        groupId: selectedGroupId,
        settings: {
          preferredVideoQuality,
          videoFit,
          force1080pOnly,
          mobileFullscreenAuto,
          preferredSpeechEngine,
          showBgImage,
          bgOpacity
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `backup-assistentes-natureza-9a-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showSaveSuccess("Arquivo de backup (.JSON) gerado e baixado com sucesso!");
    } catch (err: any) {
      console.warn("Erro ao exportar backup:", err);
      showSaveSuccess("Aviso: Falha ao exportar backup.");
    }
  };

  // Importar / Restaurar Backup (.JSON)
  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (data.theme && typeof data.theme === "string") {
          const safeTheme = normalizeThemeId(data.theme);
          setSelectedThemeId(safeTheme);
          safeStorage.setItem("natureza_selected_theme", safeTheme);
        }

        if (data.groupId && typeof data.groupId === "string" && GROUPS_CONFIG[data.groupId]) {
          setSelectedGroupId(data.groupId);
          safeStorage.setItem("natureza_selected_group_id", data.groupId);
        }

        if (data.settings) {
          if (data.settings.preferredVideoQuality) {
            setPreferredVideoQuality(data.settings.preferredVideoQuality);
          }
          if (data.settings.videoFit) {
            setVideoFit("contain");
          }
          if (typeof data.settings.force1080pOnly === "boolean") {
            setForce1080pOnly(data.settings.force1080pOnly);
          }
        }

        showSaveSuccess("Backup restaurado com sucesso!");
      } catch (err: any) {
        console.warn("Falha ao carregar arquivo de backup:", err);
        showSaveSuccess("Erro: O arquivo selecionado não é um backup válido.");
      }
    };
    reader.readAsText(file);
  };

  // Active slot corresponds to either "intro" or any question id
  const [activeVideoSlot, setActiveVideoSlot] = useState<string>("intro");
  const [ytReloadKey, setYtReloadKey] = useState<number>(0);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Chat conversation state
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSpeechDetected, setLastSpeechDetected] = useState<string>("");
  const [realtimeSpeech, setRealtimeSpeech] = useState<string>("");
  const [speechError, setSpeechError] = useState("");
  const [aiResponseText, setAiResponseText] = useState<string>(
    "Canal pronto. Clique no microfone ou digite abaixo para falar um dos comandos configurados."
  );

  // Playback settings
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPlayError, setVideoPlayError] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [showReplayPrompt, setShowReplayPrompt] = useState(false);
  const [viewedSlots, setViewedSlots] = useState<string[]>([]);
  const [videoFinished, setVideoFinished] = useState<boolean>(false);
  // Video starts when the user clicks "Iniciar Apresentação"
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Advanced Microphone & Audio States (for 100% Mobile & Desktop Compatibility)
  const [isRecordingMedia, setIsRecordingMedia] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [micPermission, setMicPermission] = useState<"unknown" | "granted" | "denied" | "prompt" | "unsupported">("unknown");
  const [showMicModal, setShowMicModal] = useState<boolean>(false);
  const [preferredSpeechEngine, setPreferredSpeechEngine] = useState<"auto" | "gemini" | "native">(() => {
    const saved = safeStorage.getItem("eco_speech_engine");
    if (saved === "gemini" || saved === "native" || saved === "auto") return saved;
    return "auto";
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<any>(null);
  const autoStopTimeoutRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Identificadores estáveis e referências síncronas para eliminar closures obsoletas
  const executionIdRef = useRef<number>(0);
  const activeExecutionIdRef = useRef<number>(0);
  const hasEndedCurrentExecutionRef = useRef<number>(-1);
  const handleVideoEndedRef = useRef<(source: string, execId?: number) => void>(() => {});
  const videoFinishedRef = useRef<boolean>(false);
  const currentGroupRef = useRef<GroupDefinition>(currentGroup);
  const activeVideoSlotRef = useRef<string>(activeVideoSlot);
  const micPermissionRef = useRef<"unknown" | "granted" | "denied" | "prompt" | "unsupported">(micPermission);
  const presentationEndedRef = useRef<boolean>(presentationEnded);
  const isListeningRef = useRef<boolean>(isListening);
  const isRecordingMediaRef = useRef<boolean>(isRecordingMedia);
  const handleIncomingCommandRef = useRef<(text: string) => void>(() => {});
  const attachedIframeNodeRef = useRef<HTMLIFrameElement | null>(null);

  currentGroupRef.current = currentGroup;
  micPermissionRef.current = micPermission;
  presentationEndedRef.current = presentationEnded;
  isListeningRef.current = isListening;
  isRecordingMediaRef.current = isRecordingMedia;
  
  // Mobile & Fullscreen States
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [mobileFullscreenAuto, setMobileFullscreenAuto] = useState<boolean>(() => {
    const saved = safeStorage.getItem("eco_mobile_fullscreen_auto");
    return saved !== null ? saved === "true" : false;
  });

  const [videoFit, setVideoFit] = useState<"contain" | "cover">(() => {
    // Modo Ajustado (Fit / object-fit: contain) como padrão estrito para manter proporção original
    safeStorage.setItem("eco_video_fit", "contain");
    return "contain";
  });

  // Quality Configuration States (1080p, 720p, 480p, 360p, auto)
  const [preferredVideoQuality, setPreferredVideoQuality] = useState<VideoQualityPreference>(() => {
    const saved = safeStorage.getItem("eco_video_quality");
    if (saved === "hd1080" || saved === "hd720" || saved === "large" || saved === "medium" || saved === "auto") {
      return saved as VideoQualityPreference;
    }
    return "hd1080";
  });

  const preferredVideoQualityRef = useRef<VideoQualityPreference>(preferredVideoQuality);

  useEffect(() => {
    preferredVideoQualityRef.current = preferredVideoQuality;
    safeStorage.setItem("eco_video_quality", preferredVideoQuality);
  }, [preferredVideoQuality]);

  // Extension Module: Force 1080p Only Lock Extension ("Extensão 1080p Only")
  const [force1080pOnly, setForce1080pOnly] = useState<boolean>(() => {
    const saved = safeStorage.getItem("eco_force_1080p_only");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    safeStorage.setItem("eco_force_1080p_only", String(force1080pOnly));
    if (force1080pOnly) {
      setPreferredVideoQuality("hd1080");
    }
  }, [force1080pOnly]);

  // Active Extension Watcher: Intercepts playback and locks resolution to 1080p continuously
  useEffect(() => {
    if (!force1080pOnly || !hasStarted || videoFinished) return;
    const interval = setInterval(() => {
      enforceYtQuality("hd1080");
    }, 1200);
    return () => clearInterval(interval);
  }, [force1080pOnly, hasStarted, videoFinished, activeVideoSlot]);

  useEffect(() => {
    safeStorage.setItem("eco_video_fit", videoFit);
  }, [videoFit]);

  useEffect(() => {
    safeStorage.setItem("eco_mobile_fullscreen_auto", String(mobileFullscreenAuto));
  }, [mobileFullscreenAuto]);

  useEffect(() => {
    safeStorage.setItem("eco_speech_engine", preferredSpeechEngine);
  }, [preferredSpeechEngine]);

  // Check initial microphone permission status if supported by the browser
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.permissions && (navigator.permissions as any).query) {
      try {
        navigator.permissions.query({ name: "microphone" as PermissionName })
          .then((status) => {
            setMicPermission(status.state as any);
            status.onchange = () => {
              setMicPermission(status.state as any);
            };
          })
          .catch(() => {
            setMicPermission("unknown");
          });
      } catch (_) {
        setMicPermission("unknown");
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, [isFullscreen]);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTapRef = useRef<number>(0);

  // Automatic Fullscreen Management:
  // "Quando o vídeo começar a ferramenta por si só deve colocar o vídeo em tela cheia e depois que terminar voltar para mostrar os gatilhos que podem ser usados, mas sempre depois de uma pergunta o vídeo deve começar em tela cheia"
  const enterFullscreenAuto = async () => {
    setIsFullscreen(true);
    try {
      if (videoContainerRef.current && !document.fullscreenElement) {
        if (videoContainerRef.current.requestFullscreen) {
          await videoContainerRef.current.requestFullscreen().catch(() => {});
        } else if ((videoRef.current as any)?.webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      }
    } catch (err) {
      console.info("Using CSS fixed viewport fullscreen:", err);
    }
  };

  const exitFullscreenAuto = async () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen().catch(() => {});
      }
    } catch (err) {
      console.info("Exit full screen note:", err);
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      await enterFullscreenAuto();
    } else {
      await exitFullscreenAuto();
    }
  };

  // Full HD 1080p Canvas Engine:
  // YouTube defaults to 240p when the iframe DOM canvas is rendered at smaller sizes (< 640px).
  // By maintaining an internal 1920x1080 viewport scaled down with CSS transform,
  // YouTube detects a native Full HD 1080p canvas and directly serves the 1080p stream from frame 0.
  const [ytStageScale, setYtStageScale] = useState<number>(1);

  useEffect(() => {
    const updateScale = () => {
      const el = videoContainerRef.current;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        const scaleX = w / 1920;
        const scaleY = h / 1080;
        const s = videoFit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
        setYtStageScale(s > 0 ? s : 1);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && videoContainerRef.current) {
      ro = new ResizeObserver(updateScale);
      ro.observe(videoContainerRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateScale);
      if (ro) ro.disconnect();
    };
  }, [videoFit, isFullscreen, hasStarted]);

  // YouTube IFrame API Player Instance reference for direct JavaScript control
  const ytPlayerInstanceRef = useRef<any>(null);

  // Load official YouTube IFrame API script once & hook onYouTubeIframeAPIReady
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prevReady = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === "function") {
        try { prevReady(); } catch (_) {}
      }
      if (hasStarted && !videoFinishedRef.current && ytIframeRef.current) {
        attachYtPlayer();
      }
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Helper to enforce user configured resolution automatically on YouTube player (1080p, 720p, etc.)
  const enforceYtQuality = (qualityOverride?: VideoQualityPreference) => {
    const q = qualityOverride || preferredVideoQualityRef.current || preferredVideoQuality;
    const targetQ = q === "auto" ? "hd1080" : q;

    // 1. Direct YouTube Player API call if instance is mounted
    if (ytPlayerInstanceRef.current) {
      try {
        ytPlayerInstanceRef.current.setPlaybackQuality?.(targetQ);
        ytPlayerInstanceRef.current.setPlaybackQualityRange?.(targetQ, "highres");
        ytPlayerInstanceRef.current.setSuggestedQuality?.(targetQ);
      } catch (_) {}
    }

    // 2. Fallback postMessage commands (both stringified and JSON) with origin handshake
    if (ytIframeRef.current?.contentWindow) {
      try {
        const win = ytIframeRef.current.contentWindow;
        // YouTube API: listening handshake so player broadcasts playback state events
        win.postMessage('{"event":"listening","id":1,"channel":"widget"}', '*');
        
        // Command 1: setPlaybackQuality
        win.postMessage(JSON.stringify({
          event: "command",
          func: "setPlaybackQuality",
          args: [targetQ]
        }), '*');

        // Command 2: setPlaybackQualityRange (forces minimum to 1080p)
        win.postMessage(JSON.stringify({
          event: "command",
          func: "setPlaybackQualityRange",
          args: [targetQ, "highres"]
        }), '*');

        // Command 3: setSuggestedQuality
        win.postMessage(JSON.stringify({
          event: "command",
          func: "setSuggestedQuality",
          args: [targetQ]
        }), '*');
      } catch (_) {}
    }
  };

  const enforceYtMaxQuality = enforceYtQuality;

  // Repeatedly pulse the quality command during video start, playback, and buffering so YouTube locks into 1080p resolution automatically
  const triggerQualityAutoPulse = (qualityOverride?: VideoQualityPreference) => {
    enforceYtQuality(qualityOverride);
    const intervals = [50, 150, 300, 600, 1000, 1800, 2800, 4000];
    intervals.forEach(delay => {
      setTimeout(() => {
        enforceYtQuality(qualityOverride);
      }, delay);
    });
  };

  const trigger1080pAutoPulse = triggerQualityAutoPulse;

  // 2. Suspende temporariamente o reconhecimento de voz durante reprodução de vídeos
  const suspendSpeechRecognition = () => {
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    } catch (_) {}
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch (_) {}
      }
    } catch (_) {}
    try {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
    } catch (_) {}
    setIsRecordingMedia(false);
    setIsListening(false);
    setIsTranscribing(false);
    setAudioLevel(0);
  };

  // Attach YouTube Player API instance to the iframe for real-time HD enforcement and ended event capture
  const attachYtPlayer = () => {
    if (typeof window === "undefined") return;
    const iframeEl = ytIframeRef.current;
    if (!iframeEl || attachedIframeNodeRef.current === iframeEl) return;

    const currentExec = activeExecutionIdRef.current;
    try {
      const YT = (window as any).YT;
      if (YT && YT.Player) {
        attachedIframeNodeRef.current = iframeEl;
        ytPlayerInstanceRef.current = new YT.Player(iframeEl, {
          events: {
            onReady: (e: any) => {
              if (activeExecutionIdRef.current !== currentExec) return;
              try {
                e.target.setPlaybackQuality?.("hd1080");
                e.target.setPlaybackQualityRange?.("hd1080", "highres");
                e.target.setSuggestedQuality?.("hd1080");
                if (videoFinishedRef.current) {
                  e.target.pauseVideo?.();
                  e.target.stopVideo?.();
                }
              } catch (_) {}
            },
            onStateChange: (e: any) => {
              if (activeExecutionIdRef.current !== currentExec) return;

              // Bloqueio imediato se o vídeo já estiver marcado como finalizado
              if (videoFinishedRef.current && (e.data === 1 || e.data === 3)) {
                try {
                  e.target.pauseVideo?.();
                  e.target.stopVideo?.();
                } catch (_) {}
                return;
              }

              // 1 = PLAYING, 3 = BUFFERING
              if (e.data === 1 || e.data === 3) {
                try {
                  e.target.setPlaybackQuality?.("hd1080");
                  e.target.setPlaybackQualityRange?.("hd1080", "highres");
                  e.target.setSuggestedQuality?.("hd1080");
                } catch (_) {}
              }
              // 0 = ENDED (YT.PlayerState.ENDED) - Interrompe loop imediatamente
              if (e.data === 0) {
                try {
                  e.target.pauseVideo?.();
                  e.target.stopVideo?.();
                } catch (_) {}
                handleVideoEndedRef.current("yt_player_ended", currentExec);
              }
            },
            onPlaybackQualityChange: (e: any) => {
              if (e.data && e.data !== "hd1080" && e.data !== "highres") {
                try { e.target.setPlaybackQuality?.("hd1080"); } catch (_) {}
              }
            }
          }
        });
      }
    } catch (err) {
      attachedIframeNodeRef.current = null;
      console.warn("attachYtPlayer fallback error:", err);
    }
  };

  // Centralized Video Slot Trigger: Execução Única Confiável com Isolamento por Grupo
  const triggerVideoSlot = (slotId: string, announceText?: string, groupOverride?: GroupDefinition) => {
    const execId = ++executionIdRef.current;
    activeExecutionIdRef.current = execId;
    hasEndedCurrentExecutionRef.current = -1;

    const targetGroup = groupOverride || currentGroupRef.current;
    if (groupOverride) {
      currentGroupRef.current = groupOverride;
    }

    // Atualizar referências síncronas antes de re-renderizar
    videoFinishedRef.current = false;
    presentationEndedRef.current = false;
    activeVideoSlotRef.current = slotId;
    attachedIframeNodeRef.current = null;
    ytPlayerInstanceRef.current = null;

    // 1. Preparar player em modo ajustado (contain) sem fullscreen automático
    setVideoFit("contain");
    try { safeStorage.setItem("eco_video_fit", "contain"); } catch (_) {}
    setHasEnteredApp(true);
    setHasSelectedGroup(true);
    setHasStarted(true);
    setVideoFinished(false);
    setPresentationEnded(false);
    setShowReplayPrompt(false);

    // 2. Suspender reconhecimento de voz durante a reprodução do vídeo
    suspendSpeechRecognition();

    // 3. Atualizar slot ativo e forçar remontagem limpa do player para reprodução única
    setActiveVideoSlot(slotId);
    setYtReloadKey(prev => prev + 1);
    setExperienceState(slotId === "intro" ? "INTRODUCAO" : "REPRODUZINDO");

    if (announceText) {
      setAiResponseText(announceText);
    }

    if (slotId !== "intro" && slotId !== "full_video") {
      setViewedSlots(prev => prev.includes(slotId) ? prev : [...prev, slotId]);
    }

    // 4. Iniciar pulso de qualidade 1080p e reprodução HTML5 se aplicável
    trigger1080pAutoPulse();

    setTimeout(() => {
      const targetVideo = getVideoById(targetGroup.id, slotId);
      const currentUrl = targetVideo?.videoUrl || "";
      if (currentUrl && !isYouTubeUrl(currentUrl) && videoRef.current) {
        videoRef.current.currentTime = 0;
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.catch(err => console.warn("Video auto-play catch:", err));
        }
      }
    }, 70);
  };

  // Seleção de Grupo de Apresentação (inicia automaticamente a introdução desse grupo)
  const handleSelectGroup = (groupId: string, autoStartIntro: boolean = true) => {
    const target = getGroupById(groupId);
    setSelectedGroupId(target.id);
    currentGroupRef.current = target;
    try {
      safeStorage.setItem("natureza_selected_group_id", target.id);
      safeStorage.setItem("wit_selected_group_id", target.id);
    } catch (_) {}

    setHasEnteredApp(true);
    setHasSelectedGroup(true);
    setPresentationEnded(false);
    presentationEndedRef.current = false;
    setViewedSlots([]);
    setLastSpeechDetected("");
    setRealtimeSpeech("");
    setSpeechError("");
    setVideoMuted(false);

    const initialSlot = target.presentationType === "full_video" ? "full_video" : "intro";

    if (autoStartIntro) {
      triggerVideoSlot(
        initialSlot,
        target.presentationType === "full_video"
          ? `Iniciando apresentação completa do grupo ${target.name}.`
          : `Iniciando apresentação do grupo ${target.name}.`,
        target
      );
    } else {
      setHasStarted(false);
      setVideoFinished(false);
      videoFinishedRef.current = false;
      setActiveVideoSlot(initialSlot);
      activeVideoSlotRef.current = initialSlot;
      setAiResponseText(`Grupo "${target.name}" selecionado. Toque em "Iniciar Apresentação".`);
    }
  };

  const openEcosystemQuiz = (themeOverride?: ThemeId) => {
    suspendSpeechRecognition();
    setQuizTargetThemeId(themeOverride || selectedThemeId);
    setQuizModalOpen(true);
  };

  const handleVideoTouch = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      toggleFullscreen();
    }
    lastTapRef.current = now;
  };

  const [hidePanels, setHidePanels] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Background Image State (Amazon Rainforest Wildlife)
  const [showBgImage, setShowBgImage] = useState<boolean>(() => {
    const saved = safeStorage.getItem("eco_show_bg_image");
    return saved !== null ? saved === "true" : true;
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    const saved = safeStorage.getItem("eco_bg_opacity");
    return saved !== null ? Number(saved) : 35;
  });

  useEffect(() => {
    safeStorage.setItem("eco_show_bg_image", String(showBgImage));
  }, [showBgImage]);

  useEffect(() => {
    safeStorage.setItem("eco_bg_opacity", String(bgOpacity));
  }, [bgOpacity]);

  // Trepadeiras & Drones de Monitoramento Eco-Design
  const [showVines, setShowVines] = useState<boolean>(() => {
    const saved = safeStorage.getItem("eco_show_vines");
    return saved !== null ? saved === "true" : true;
  });
  const [showDrones, setShowDrones] = useState<boolean>(() => {
    const saved = safeStorage.getItem("eco_show_drones");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    safeStorage.setItem("eco_show_vines", String(showVines));
  }, [showVines]);

  useEffect(() => {
    safeStorage.setItem("eco_show_drones", String(showDrones));
  }, [showDrones]);

  // Helper helper to clean and evaluate similarity between recognized text and target phrases
  const getFuzzyMatchScore = (input: string, targetPhrase: string): number => {
    if (!input || !targetPhrase) return 0;
    
    const cleanString = (s: string) => {
      return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9\s]/g, "") // remove punctuation
        .trim();
    };

    const inputClean = cleanString(input);
    const targetClean = cleanString(targetPhrase);

    if (!inputClean || !targetClean) return 0;

    // Exact match
    if (inputClean === targetClean) return 1.0;

    // Substring contains
    if (inputClean.includes(targetClean) || targetClean.includes(inputClean)) {
      return 0.95;
    }

    // Split words to see the intersection of keywords (plurals and verb stems)
    const inputWords = inputClean.split(/\s+/).filter(w => w.length > 1);
    const targetWords = targetClean.split(/\s+/).filter(w => w.length > 2);

    if (targetWords.length === 0) return 0;

    let matchCount = 0;
    for (const tWord of targetWords) {
      const matched = inputWords.some(iWord => {
        if (iWord === tWord) return true;
        // Check partial word prefixes to match e.g. "mostra" and "mostrar", "chuva" and "chuvas", etc.
        const minLen = Math.min(tWord.length, iWord.length);
        if (minLen >= 4) {
          const prefixT = tWord.substring(0, 4);
          const prefixI = iWord.substring(0, 4);
          if (prefixT === prefixI) return true;
        }
        return false;
      });
      if (matched) matchCount++;
    }

    return matchCount / targetWords.length;
  };

  // Sincroniza referência de término do vídeo e slot ativo
  useEffect(() => {
    videoFinishedRef.current = videoFinished;
  }, [videoFinished]);

  useEffect(() => {
    activeVideoSlotRef.current = activeVideoSlot;
  }, [activeVideoSlot]);

  // Tratamento unificado de término de vídeo com suporte ao gatilho finalizador ("Tchau")
  const handleVideoEnded = (source: string = "unknown", execId?: number) => {
    const targetExec = execId ?? activeExecutionIdRef.current;

    // Proteção: Garante que o evento de término seja tratado uma única vez por reprodução
    if (hasEndedCurrentExecutionRef.current === targetExec) {
      return;
    }
    hasEndedCurrentExecutionRef.current = targetExec;

    // Atualização síncrona imediata para bloquear qualquer loop
    videoFinishedRef.current = true;

    // 1. Interrompe reprodução no player do YouTube
    try {
      if (ytPlayerInstanceRef.current && typeof ytPlayerInstanceRef.current.pauseVideo === "function") {
        ytPlayerInstanceRef.current.pauseVideo();
        ytPlayerInstanceRef.current.stopVideo?.();
      }
    } catch (_) {}

    // 2. Comandos postMessage para pausar e parar o iframe
    try {
      if (ytIframeRef.current?.contentWindow) {
        ytIframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        ytIframeRef.current.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
      }
    } catch (_) {}

    // 3. Pausa vídeo HTML5 direto se houver
    try {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } catch (_) {}

    const endedSlot = activeVideoSlotRef.current;
    const grp = currentGroupRef.current;
    const finishedTrigger = grp.triggers.find(t => t.id === endedSlot);
    const isEnding = Boolean(finishedTrigger?.isEndingTrigger);

    // 4. Encerra estado de reprodução sem voltar automaticamente para a intro
    setVideoFinished(true);
    setShowReplayPrompt(true);
    setViewedSlots((prev) => (prev.includes(endedSlot) ? prev : [...prev, endedSlot]));
    exitFullscreenAuto();

    if (grp.presentationType === "full_video" || endedSlot === "full_video") {
      // Grupo 5 (vídeo único completo): interromper sem ativar microfone nem iniciar quiz automaticamente
      presentationEndedRef.current = false;
      setPresentationEnded(false);
      setExperienceState("AGUARDANDO");
      suspendSpeechRecognition();
      setAiResponseText(`Apresentação de ${grp.name} finalizada. Escolha "Assistir Novamente" ou "Fazer Quiz da Caatinga".`);
      return;
    }

    if (isEnding) {
      // Comportamento especial do gatilho "Tchau": encerrar apresentação sem reativar microfone nem exibir gatilhos
      presentationEndedRef.current = true;
      setPresentationEnded(true);
      setExperienceState("AGUARDANDO");
      suspendSpeechRecognition();
      setAiResponseText(`Apresentação do grupo ${grp.name} encerrada. Obrigado pela participação!`);
      return;
    }

    // 5. Após introdução ou vídeo informativo: retornar ao modo de escuta com os gatilhos disponíveis
    presentationEndedRef.current = false;
    setPresentationEnded(false);
    setExperienceState("ESCUTANDO");
    setAiResponseText(`Vídeo finalizado. Fale no microfone ou selecione um dos ${grp.triggers.length} gatilhos abaixo.`);

    // 6. Reativar reconhecimento de voz de forma limpa se houver permissão concedida
    setTimeout(() => {
      if (!presentationEndedRef.current && micPermissionRef.current === "granted") {
        startListeningIfAllowed();
      }
    }, 350);
  };

  // Mantém a referência da função sempre atualizada para chamadas externas sem recriar listeners
  useEffect(() => {
    handleVideoEndedRef.current = handleVideoEnded;
  });

  const handleReplayVideo = () => {
    triggerVideoSlot(activeVideoSlotRef.current, "Reiniciando vídeo.");
  };

  // Monitoramento contínuo: Handshake do YouTube IFrame, late-binding do YT.Player e fallback seguro de término
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      try {
        if (ytIframeRef.current && attachedIframeNodeRef.current !== ytIframeRef.current && (window as any).YT?.Player) {
          attachYtPlayer();
        }

        if (ytIframeRef.current?.contentWindow) {
          ytIframeRef.current.contentWindow.postMessage('{"event":"listening","id":1,"channel":"widget"}', '*');
        }

        if (!videoFinishedRef.current) {
          const currentExec = activeExecutionIdRef.current;
          if (ytPlayerInstanceRef.current && typeof ytPlayerInstanceRef.current.getCurrentTime === "function") {
            const curr = ytPlayerInstanceRef.current.getCurrentTime();
            const dur = ytPlayerInstanceRef.current.getDuration();
            if (dur > 2 && curr > 1 && curr >= dur - 0.35) {
              try {
                ytPlayerInstanceRef.current.pauseVideo?.();
                ytPlayerInstanceRef.current.stopVideo?.();
              } catch (_) {}
              handleVideoEndedRef.current("interval_time_fallback", currentExec);
            }
          }
        }
      } catch (_) {}
    }, 300);

    return () => clearInterval(interval);
  }, [hasStarted]);

  // Listener estável para postMessage do YouTube Player: detecta onStateChange 0 e infoDelivery playerState 0
  useEffect(() => {
    const handleYtMessage = (event: MessageEvent) => {
      try {
        let payload: any = event.data;
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch (_) {
            return;
          }
        }
        if (payload) {
          const currentExec = activeExecutionIdRef.current;

          // Proteção Anti-Loop: Se o vídeo já foi finalizado, bloquear categoricamente qualquer reprodução
          if (videoFinishedRef.current && (payload.info === 1 || payload.info?.playerState === 1 || payload.info === 3 || payload.info?.playerState === 3)) {
            console.log(`[ANTI-LOOP] Bloqueada tentativa de reinício automático do YouTube.`);
            try {
              ytPlayerInstanceRef.current?.pauseVideo?.();
              ytPlayerInstanceRef.current?.stopVideo?.();
              ytIframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              ytIframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            } catch (_) {}
            return;
          }

          if (
            payload.event === "onReady" ||
            payload.event === "initialDelivery" ||
            payload.event === "listening" ||
            payload.info === 1 ||
            payload.info === 3 ||
            (payload.info && (payload.info.playerState === 1 || payload.info.playerState === 3))
          ) {
            enforceYtMaxQuality();
          }

          // YouTube API onStateChange: 0 é ENDED
          if (payload.event === "onStateChange" && payload.info === 0) {
            console.log(`[EXEC #${currentExec}] PostMessage onStateChange: 0 recebido.`);
            handleVideoEndedRef.current("postMessage_onStateChange", currentExec);
          } else if (payload.info && payload.info.playerState === 0) {
            console.log(`[EXEC #${currentExec}] PostMessage infoDelivery playerState: 0 recebido.`);
            handleVideoEndedRef.current("postMessage_playerState0", currentExec);
          }
        }
      } catch (_) {}
    };

    window.addEventListener("message", handleYtMessage);
    return () => window.removeEventListener("message", handleYtMessage);
  }, []);

  // Sync mute to YouTube iframe via postMessage
  useEffect(() => {
    if (ytIframeRef.current?.contentWindow) {
      try {
        const cmd = videoMuted ? "mute" : "unMute";
        ytIframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${cmd}","args":""}`, '*');
        enforceYtMaxQuality();
      } catch (_) {}
    }
  }, [videoMuted, ytReloadKey]);

  // Keyboard shortcut: Escape key allows concluding video early during presentations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && hasStarted && !videoFinishedRef.current) {
        handleVideoEndedRef.current("escape_key", activeExecutionIdRef.current);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted]);

  // Dynamic audio and speech recognition lifecycle is managed on-demand via toggleListening

  // Play and reload helper triggered on video changes
  const activeVideoUrl = (() => {
    if (activeVideoSlot === "full_video") {
      return currentGroup.fullVideo?.videoUrl || "";
    }
    if (activeVideoSlot === "intro") {
      return currentGroup.intro?.videoUrl || "";
    }
    const match = effectiveQuestions.find(q => q.id === activeVideoSlot);
    if (match) {
      return match.videoUrl;
    }
    return "";
  })();

  useEffect(() => {
    setShowReplayPrompt(false);
    setVideoFinished(false);
    const currentUrl = activeVideoUrl;
    const isYt = isYouTubeUrl(currentUrl);

    if (isYt) {
      setVideoPlayError("");
    } else if (videoRef.current) {
      const v = videoRef.current;
      setVideoPlayError("");
      try {
        v.load();
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Automatic play delayed/prevented:", err);
          });
        }
      } catch (err) {
        console.error("Video load error:", err);
      }
    }
  }, [activeVideoSlot, activeVideoUrl]);

  const getActiveVideoUrl = () => {
    return activeVideoUrl;
  };

  const getActiveVideoTitle = () => {
    if (activeVideoSlot === "full_video") return `VÍDEO COMPLETO: ${currentGroup.fullVideo?.videoName || currentGroup.name}`;
    if (activeVideoSlot === "intro") return `INTRODUÇÃO: ${effectiveIntroName || currentGroup.name}`;
    const match = effectiveQuestions.find(q => q.id === activeVideoSlot);
    if (match) {
      return `GATILHO: ${match.phrase.toUpperCase()}`;
    }
    return currentGroup.name;
  };

  const resetAllTriggers = () => {
    setConfirmModal({
      isOpen: true,
      title: "Reiniciar Preferências",
      message: "Deseja restaurar o tema visual e as preferências do reprodutor para o padrão da plataforma?",
      onConfirm: () => {
        setSelectedThemeId("amazonia");
        setPreferredVideoQuality("hd1080");
        setForce1080pOnly(true);
        setVideoFit("contain");
        setShowBgImage(true);
        setBgOpacity(35);
        setLastSpeechDetected("");
        setRealtimeSpeech("");
        safeStorage.removeItem("natureza_selected_theme");
        safeStorage.removeItem("wit_selected_theme");
        setAiResponseText("Preferências restauradas para a configuração padrão ASSISTENTES DA NATUREZA.");
      }
    });
  };

  // Reconhecimento e acionamento exclusivo para as frases do grupo ativo selecionado
  const handleIncomingCommand = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (presentationEndedRef.current) return;

    const activeGrp = currentGroupRef.current;
    if (activeGrp.presentationType === "full_video" || activeGrp.triggers.length === 0) {
      return;
    }

    setLastSpeechDetected(trimmed);
    setInputText("");
    setIsAnalyzing(true);
    setSpeechError("");
    setExperienceState("PROCESSANDO");

    // 1. Identificação contextual exclusiva para os 4 gatilhos do grupo ativo
    const matchedSlotId = matchTriggerForActiveGroup(trimmed, activeGrp.id);
    if (matchedSlotId) {
      const found = activeGrp.triggers.find(t => t.id === matchedSlotId);
      if (found) {
        triggerVideoSlot(found.id, `Reproduzindo: "${found.phrase}"`, activeGrp);
        setIsAnalyzing(false);
        return;
      }
    }

    // 2. Fallback semântico restrito exclusivamente aos 4 gatilhos do grupo ativo
    try {
      const virtualTriggers: Trigger[] = activeGrp.triggers.map(t => ({
        id: t.id,
        phrase: t.phrase,
        videoUrl: t.videoUrl,
        description: t.description
      }));

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          triggers: virtualTriggers
        })
      });

      if (response.ok) {
        const result = await response.json();
        const matchedId = result.matchedTriggerId;
        if (matchedId) {
          const found = activeGrp.triggers.find(t => t.id === matchedId);
          if (found) {
            triggerVideoSlot(found.id, result.response || `Reproduzindo: "${found.phrase}"`, activeGrp);
            setIsAnalyzing(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn("AI analysis fallback:", err);
    }

    const availablePhrases = activeGrp.triggers.map(t => `"${t.phrase}"`).join(", ");
    setAiResponseText(`Comando não identificado para ${activeGrp.name}. Fale ou selecione um dos gatilhos: ${availablePhrases}.`);
    setIsAnalyzing(false);
    if (videoFinishedRef.current && !presentationEndedRef.current) {
      setExperienceState(micPermissionRef.current === "granted" ? "ESCUTANDO" : "AGUARDANDO");
    }
  };

  handleIncomingCommandRef.current = handleIncomingCommand;

  // Request microphone permission explicitly (triggers browser dialog on mobile iOS/Android)
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError("Navegador não possui suporte para acesso ao microfone.");
        setMicPermission("unsupported");
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      setMicPermission("granted");
      setSpeechError("");
      // Release tracks immediately
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      console.warn("Microphone permission error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setSpeechError("Microfone bloqueado pelo navegador. Toque em 'Habilitar Microfone' para liberar.");
        setShowMicModal(true);
      } else {
        setSpeechError(`Erro no microfone: ${err.message || err.name}`);
      }
      return false;
    }
  };

  const cleanupAudioRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (_) {}
      audioStreamRef.current = null;
    }
    setAudioLevel(0);
    setIsRecordingMedia(false);
  };

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("Error stopping MediaRecorder:", err);
        cleanupAudioRecording();
        setIsListening(false);
      }
    } else {
      cleanupAudioRecording();
      setIsListening(false);
    }
  };

  const startMediaRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError("Captura de microfone indisponível neste navegador.");
        return;
      }

      setSpeechError("");
      setRealtimeSpeech("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      audioStreamRef.current = stream;
      setMicPermission("granted");
      setIsListening(true);
      setIsRecordingMedia(true);
      setRecordingDuration(0);
      setExperienceState("ESCUTANDO");

      // Real-time audio analyzer for visual sound feedback on mobile
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          const ctx = new AudioCtxClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.5;
          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);
          audioContextRef.current = ctx;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const tickLevel = () => {
            if (!audioStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const level = Math.min(100, Math.round((avg / 120) * 100));
            setAudioLevel(level);
            animationFrameRef.current = requestAnimationFrame(tickLevel);
          };
          tickLevel();
        }
      } catch (e) {
        console.warn("Audio meter setup skipped:", e);
      }

      // Check supported MIME type across mobile devices
      const candidateMimes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/aac",
        "audio/ogg;codecs=opus"
      ];
      let selectedMime = "";
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported) {
        for (const m of candidateMimes) {
          if (MediaRecorder.isTypeSupported(m)) {
            selectedMime = m;
            break;
          }
        }
      }

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const recordedMime = recorder.mimeType || selectedMime || "audio/webm";
        const chunks = [...audioChunksRef.current];
        cleanupAudioRecording();
        setIsListening(false);

        if (chunks.length === 0) {
          setSpeechError("Nenhum áudio detectado.");
          return;
        }

        const audioBlob = new Blob(chunks, { type: recordedMime });
        if (audioBlob.size < 400) {
          setSpeechError("Áudio muito curto. Fale um comando como 'mostrar natureza'.");
          return;
        }

        setIsAnalyzing(true);
        setIsTranscribing(true);
        setSpeechError("");

        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Data = reader.result as string;
              const res = await fetch("/api/transcribe-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  audioData: base64Data,
                  mimeType: recordedMime
                })
              });

              if (!res.ok) {
                throw new Error(`Servidor retornou status ${res.status}`);
              }

              const data = await res.json();
              setIsTranscribing(false);
              setIsAnalyzing(false);

              if (data.transcript && data.transcript.trim()) {
                const text = data.transcript.trim();
                setLastSpeechDetected(text);
                setRealtimeSpeech("");
                handleIncomingCommandRef.current(text);
              } else {
                setSpeechError("Nenhuma fala detectada no áudio gravado. Tente falar mais próximo ao celular.");
              }
            } catch (err: any) {
              console.error("Transcribe API error:", err);
              setIsTranscribing(false);
              setIsAnalyzing(false);
              setSpeechError("Não foi possível transcrever o áudio gravado.");
            }
          };
        } catch (err: any) {
          setIsTranscribing(false);
          setIsAnalyzing(false);
          setSpeechError("Erro ao processar áudio.");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);

      // Increment recording duration every second
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Auto stop after 7 seconds if user doesn't tap again
      autoStopTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 7000);

    } catch (err: any) {
      console.warn("MediaRecorder start error:", err);
      cleanupAudioRecording();
      setIsListening(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setSpeechError("Acesso ao microfone negado no celular.");
        setShowMicModal(true);
      } else {
        setSpeechError(`Erro ao abrir microfone: ${err.message || err.name}`);
      }
    }
  };

  // Native Web Speech API driver with clean per-session instantiation
  const startListeningNative = (SpeechRecognitionClass: any) => {
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.lang = "pt-BR";
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setIsRecordingMedia(false);
        setSpeechError("");
        setRealtimeSpeech("");
        setExperienceState("ESCUTANDO");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript) {
          setRealtimeSpeech(interimTranscript);
        }

        if (finalTranscript) {
          setLastSpeechDetected(finalTranscript);
          setRealtimeSpeech("");
          setIsListening(false);
          handleIncomingCommandRef.current(finalTranscript);
        }
      };

      rec.onerror = (event: any) => {
        setIsListening(false);
        setRealtimeSpeech("");
        console.warn("Native SpeechRecognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicPermission("denied");
          setSpeechError("Reconhecimento nativo bloqueado. Comutando para gravação de áudio...");
          // Fallback to MediaRecorder on mobile
          startMediaRecording();
        } else if (event.error === "no-speech") {
          setSpeechError("Nenhuma fala detectada. Toque e fale claramente.");
        } else if (event.error === "network") {
          setSpeechError("Rede indisponível no reconhecimento nativo. Comutando para gravação de áudio...");
          startMediaRecording();
        } else {
          setSpeechError(`Aviso do microfone: ${event.error}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      console.warn("Native SpeechRecognition start failed, falling back to MediaRecorder:", err);
      startMediaRecording();
    }
  };

  // Inicia reconhecimento de voz somente se o usuário concedeu permissão e não encerrou com Tchau
  const startListeningIfAllowed = () => {
    if (presentationEndedRef.current) return;
    if (micPermissionRef.current !== "granted") return;
    if (isListeningRef.current || isRecordingMediaRef.current) return;
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (isMobile || preferredSpeechEngine === "gemini" || !SpeechRecognitionClass) {
      startMediaRecording();
    } else {
      startListeningNative(SpeechRecognitionClass);
    }
  };

  // Unified voice listening toggle
  const toggleListening = async () => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isListening || isRecordingMedia) {
      if (isRecordingMedia) {
        stopMediaRecording();
      } else if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsListening(false);
      if (videoFinished) {
        setExperienceState("AGUARDANDO");
      }
      return;
    }

    setSpeechError("");
    setRealtimeSpeech("");
    setExperienceState("ESCUTANDO");

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // On mobile devices (iOS/Android), MediaRecorder + Gemini is the 100% reliable path:
    // It triggers the native browser microphone permission dialog instantly on tap without Web Speech drops or silent crashes.
    if (isMobile || preferredSpeechEngine === "gemini" || !SpeechRecognitionClass) {
      await startMediaRecording();
      return;
    }

    // On desktop, verify microphone permission and start native streaming Web Speech
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        setMicPermission("granted");
      }
      startListeningNative(SpeechRecognitionClass);
    } catch (err: any) {
      console.warn("Web Speech pre-check error, falling back to MediaRecorder:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setSpeechError("Permissão de microfone negada. Toque no cadeado do navegador para permitir o microfone.");
        setShowMicModal(true);
      } else {
        await startMediaRecording();
      }
    }
  };

  return (
    <div 
      id="wit-root" 
      className="min-h-screen font-sans flex flex-col selection:bg-white selection:text-black relative overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.colors.bgApp,
        color: currentTheme.colors.textPrimary
      }}
    >
      
      {/* Toast de Confirmação de Salvamento */}
      {saveToast && saveToast.visible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none animate-fade-in">
          <div className="bg-white text-black font-mono font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] border-2 border-black flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{saveToast.message}</span>
          </div>
        </div>
      )}

      {/* Background Image: Cenário Imersivo do Bioma Selecionado */}
      {showBgImage && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700" 
          aria-hidden="true"
          style={{ opacity: bgOpacity / 100 }}
        >
          <img
            key={currentTheme.id}
            src={currentTheme.bgImage || "/assets/images/amazonia_smart.jpg"}
            alt={`${currentTheme.name} - ${currentTheme.environmentTitle}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.01] filter contrast-105 transition-all duration-700 animate-fade-in"
          />
          {/* Subtle gradient vignette to preserve contrast and HUD readability */}
          <div className="absolute inset-0 bg-radial from-black/35 via-black/75 to-black pointer-events-none" />
        </div>
      )}

      {/* Partículas Ambientais Imersivas por Bioma (Vagalumes, Neve, Poeira Solar, Folhas, Ondulações) */}
      <SmartAmbientParticles 
        particleType={currentTheme.particleType} 
        glowColor={currentTheme.glowColor} 
      />

      {/* Ambient background overlay */}

      {/* Waveform keyframe for active recording state */}
      <style>{`
        @keyframes customGrow {
          0%, 100% { height: 6px; }
          50% { height: 24px; }
        }
        .v-wave-1 { animation: customGrow 0.5s infinite ease-in-out; }
        .v-wave-2 { animation: customGrow 0.7s infinite ease-in-out 0.12s; }
        .v-wave-3 { animation: customGrow 0.4s infinite ease-in-out 0.24s; }
        .v-wave-4 { animation: customGrow 0.6s infinite ease-in-out 0.36s; }
        .text-glow-white {
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.45);
        }
      `}</style>

      {/* Top Application Bar (Exibido após entrar na plataforma) */}
      {hasEnteredApp && !hidePanels && !isFullscreen && (
        <header 
          id="wit-nav" 
          className="backdrop-blur-md border-b py-3 px-3 sm:px-6 sticky top-0 z-20 transition-colors duration-300"
          style={{
            backgroundColor: currentTheme.colors.bgSurface,
            borderColor: currentTheme.colors.borderSubtle
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
            
            {/* Left side: Exclusive AppLogo, Brand title and status */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 select-none shrink-0">
              <button
                type="button"
                onClick={() => {
                  suspendSpeechRecognition();
                  setHasEnteredApp(false);
                  setHasSelectedGroup(false);
                  setHasStarted(false);
                  setVideoFinished(false);
                  setPresentationEnded(false);
                  setActiveTab("chat");
                }}
                className="flex items-center gap-2.5 cursor-pointer group text-left"
                title="Voltar à Tela Inicial"
              >
                <AppLogo size="sm" className="group-hover:scale-105 transition-transform" />
                <div className="flex flex-col">
                  <span 
                    className="font-display font-black text-sm sm:text-lg tracking-wider uppercase leading-none whitespace-nowrap transition-colors duration-300"
                    style={{ color: currentTheme.colors.textPrimary }}
                  >
                    ASSISTENTES DA NATUREZA
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span 
                      className="text-[9px] font-mono font-black uppercase tracking-widest leading-none whitespace-nowrap"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      9º A – OSMARINHO
                    </span>
                    <span className="text-[9px] opacity-40">•</span>
                    {/* Experience State Indicator Badge */}
                    <div 
                      className="text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1.5 transition-all whitespace-nowrap leading-none shrink-0"
                      style={{
                        backgroundColor: currentTheme.colors.bgCard,
                        borderColor: currentTheme.colors.borderSubtle,
                        color: experienceState === "ESCUTANDO" ? "#f87171" : experienceState === "PROCESSANDO" ? "#fbbf24" : experienceState === "REPRODUZINDO" ? "#34d399" : experienceState === "INTRODUCAO" ? "#60a5fa" : currentTheme.colors.textSecondary
                      }}
                      title={`Estado atual: ${experienceState}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        experienceState === "ESCUTANDO" ? "bg-red-500 animate-ping" : 
                        experienceState === "PROCESSANDO" ? "bg-amber-400 animate-spin" : 
                        experienceState === "REPRODUZINDO" ? "bg-emerald-400 animate-pulse" : 
                        experienceState === "INTRODUCAO" ? "bg-blue-400 animate-pulse" : 
                        "bg-zinc-400"
                      }`} />
                      <span>{experienceState}</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Theme Badge in Header with Quick Ecosystem Modal Trigger */}
              <button 
                type="button"
                onClick={() => setShowEcosystemModal(true)}
                className="hidden sm:flex text-[8px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase items-center gap-1.5 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  color: currentTheme.colors.primary,
                  borderColor: currentTheme.colors.borderMain,
                  boxShadow: `0 0 10px ${currentTheme.glowColor}`
                }}
                title={`Ver Dispositivos IoT e Fauna de ${currentTheme.name}`}
              >
                {renderThemeIcon(currentTheme.iconName, "w-3 h-3")}
                <span>{currentTheme.name}</span>
              </button>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap overflow-x-auto no-scrollbar py-0.5">
              
              {/* Return to Start Screen */}
              <button
                type="button"
                onClick={() => {
                  suspendSpeechRecognition();
                  setHasEnteredApp(false);
                  setHasSelectedGroup(false);
                  setHasStarted(false);
                  setVideoFinished(false);
                  setPresentationEnded(false);
                  setActiveTab("chat");
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap leading-none shrink-0"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  color: currentTheme.colors.textSecondary,
                  borderColor: currentTheme.colors.borderSubtle
                }}
                title="Voltar para a Tela Inicial"
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">Início</span>
              </button>

              {/* Quick Background Toggle */}
              <button
                type="button"
                onClick={() => setShowBgImage(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap leading-none shrink-0"
                style={{
                  backgroundColor: showBgImage ? currentTheme.colors.bgCard : currentTheme.colors.bgApp,
                  color: showBgImage ? currentTheme.colors.textPrimary : currentTheme.colors.textMuted,
                  borderColor: currentTheme.colors.borderSubtle
                }}
                title={showBgImage ? "Ocultar imagem de fundo" : "Ativar imagem de fundo"}
              >
                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">{showBgImage ? `Fundo ${bgOpacity}%` : "Fundo OFF"}</span>
              </button>

              {/* Salvar Preferências */}
              <button
                type="button"
                onClick={handleSaveAllData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap leading-none shrink-0 shadow-sm"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  color: currentTheme.colors.textPrimary,
                  borderColor: currentTheme.colors.borderSubtle
                }}
                title="Salvar preferências"
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Salvar</span>
              </button>

              {/* Quiz dos Ecossistemas (Acesso Geral no Cabeçalho) */}
              <button
                type="button"
                onClick={() => openEcosystemQuiz(selectedThemeId)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap leading-none shrink-0"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  color: currentTheme.colors.accent,
                  borderColor: currentTheme.colors.borderMain
                }}
                title="Abrir Quizzes Interativos dos Ecossistemas"
              >
                <Trophy className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Quizzes</span>
              </button>

              {activeTab === "chat" && hasSelectedGroup && !presentationEnded && !isFullVideoGroup && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-200 border-2 cursor-pointer whitespace-nowrap leading-none shrink-0 ${
                    isListening || isRecordingMedia
                      ? "bg-red-500 text-white border-white animate-pulse"
                      : ""
                  }`}
                  style={!(isListening || isRecordingMedia) ? {
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.primaryText,
                    borderColor: currentTheme.colors.borderMain
                  } : undefined}
                  title={isListening || isRecordingMedia ? "Desativar microfone" : "Ativar microfone por voz"}
                >
                  {isListening || isRecordingMedia ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{isRecordingMedia ? `Ouvindo (${recordingDuration}s)` : "Ouvindo..."}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">Falar</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "chat" ? "settings" : "chat")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap leading-none shrink-0"
                style={{
                  backgroundColor: activeTab === "settings" ? currentTheme.colors.primary : currentTheme.colors.bgCard,
                  color: activeTab === "settings" ? currentTheme.colors.primaryText : currentTheme.colors.textSecondary,
                  borderColor: activeTab === "settings" ? currentTheme.colors.borderMain : currentTheme.colors.borderSubtle
                }}
                title={activeTab === "chat" ? "Ir para Configurações" : "Ir para Apresentação"}
              >
                {activeTab === "chat" ? (
                  <>
                    <Settings className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Ajustes</span>
                  </>
                ) : (
                  <>
                    <Tv className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Apresentação</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Main Area */}
      <main className={`flex-1 w-full max-w-7xl mx-auto ${isFullscreen ? "p-0 sm:p-2 max-w-none" : "px-2 sm:px-6 py-3 sm:py-8"} flex flex-col justify-start transition-all duration-300 relative z-10`}>
        
        {/* VIEW 0: TELA INICIAL OFICIAL (ASSISTENTES DA NATUREZA | 9º A – OSMARINHO) */}
        {!hasEnteredApp && activeTab === "chat" && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10 animate-fade-in">
            <div 
              className="w-full max-w-4xl rounded-3xl border-2 p-6 sm:p-10 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.bgSurface,
                borderColor: currentTheme.colors.borderMain,
                boxShadow: `0 0 50px ${currentTheme.glowColor}, 0 20px 60px rgba(0,0,0,0.85)`
              }}
            >
              {/* Subtle futuristic grid aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08)_0%,transparent_60%)] pointer-events-none" />

              {/* Exclusive Transparent Nature-Tech Logo */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <AppLogo size="xl" />

                <div className="space-y-2">
                  <span 
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest border"
                    style={{
                      backgroundColor: currentTheme.colors.bgCard,
                      color: currentTheme.colors.primary,
                      borderColor: currentTheme.colors.borderMain
                    }}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>9º A – OSMARINHO</span>
                  </span>

                  <h1 
                    className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider leading-tight"
                    style={{ color: currentTheme.colors.textPrimary }}
                  >
                    ASSISTENTES DA NATUREZA
                  </h1>

                  <p 
                    className="text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    Plataforma interativa de projetos em Ambientes Inteligentes, Internet das Coisas (IoT), Inteligência Artificial e Monitoramento Ambiental.
                  </p>
                </div>
              </div>

              {/* Representação Sutil dos 5 Temas Oficiais do Aplicativo */}
              <div className="relative z-10 w-full space-y-2.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: currentTheme.colors.textMuted }}>
                  5 Biomas Inteligentes (Selecione a Aparência Visual)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full">
                  {THEME_LIST.map((th) => {
                    const isSelected = selectedThemeId === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => handleSelectTheme(th.id)}
                        className={`group rounded-2xl border p-2.5 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected ? "scale-[1.03] ring-2 shadow-lg" : "opacity-85 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                        style={{
                          backgroundColor: isSelected ? th.colors.bgElevated : th.colors.bgCard,
                          borderColor: isSelected ? th.colors.borderMain : th.colors.borderSubtle,
                          boxShadow: isSelected ? `0 0 18px ${th.glowColor}` : "none",
                          // @ts-ignore
                          "--tw-ring-color": th.colors.primary
                        }}
                      >
                        <div className="relative h-14 w-full rounded-xl overflow-hidden border" style={{ borderColor: th.colors.borderSubtle }}>
                          <img src={th.bgImage} alt={th.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                          <div 
                            className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: th.colors.primary, color: th.colors.primaryText }}
                          >
                            {renderThemeIcon(th.iconName, "w-3 h-3")}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-black text-xs uppercase truncate" style={{ color: th.colors.textPrimary }}>
                            {th.name}
                          </div>
                          <div className="text-[8.5px] font-mono leading-tight line-clamp-2 mt-0.5" style={{ color: th.colors.textMuted }}>
                            {th.shortCaracteristica}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão Principal INICIAR APRESENTAÇÃO e Acesso Geral aos Quizzes */}
              <div className="relative z-10 flex flex-col items-center gap-3 pt-2">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHasEnteredApp(true);
                      setHasSelectedGroup(false);
                      setHasStarted(false);
                      setVideoFinished(false);
                      setPresentationEnded(false);
                      setExperienceState("AGUARDANDO");
                    }}
                    className="px-8 sm:px-12 py-4 sm:py-4.5 font-display font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 group hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.primaryText,
                      borderColor: currentTheme.colors.borderMain,
                      boxShadow: `0 0 28px ${currentTheme.glowColor}`
                    }}
                  >
                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform shrink-0" />
                    <span>INICIAR APRESENTAÇÃO</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEcosystemQuiz(selectedThemeId)}
                    className="px-6 py-4 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2.5 hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                    style={{
                      backgroundColor: currentTheme.colors.bgCard,
                      color: currentTheme.colors.accent,
                      borderColor: currentTheme.colors.borderMain
                    }}
                  >
                    <Trophy className="w-4 h-4 shrink-0" />
                    <span>QUIZ DOS ECOSSISTEMAS</span>
                  </button>
                </div>
                <span className="text-[10px] font-mono" style={{ color: currentTheme.colors.textMuted }}>
                  5 Grupos de Apresentação • Gatilhos Interativos, Vídeo Completo e 5 Quizzes de Biomas
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1A: SELEÇÃO DO GRUPO DE APRESENTAÇÃO (Após clicar em INICIAR APRESENTAÇÃO) */}
        {hasEnteredApp && !hasSelectedGroup && activeTab === "chat" && (
          <div className="space-y-6 animate-fade-in max-w-5xl mx-auto w-full py-2">
            {/* Seletor de Aparência Visual dos 5 Temas */}
            <div 
              className="rounded-2xl p-3 sm:p-4 border-2 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
              style={{
                backgroundColor: currentTheme.colors.bgSurface,
                borderColor: currentTheme.colors.borderSubtle,
                boxShadow: `0 0 20px ${currentTheme.glowColor}`
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: currentTheme.colors.textMuted }}>
                  Aparência Visual:
                </span>
                {THEME_LIST.map((th) => {
                  const isSelected = selectedThemeId === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => handleSelectTheme(th.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected ? "scale-105 shadow-md" : "opacity-75 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: isSelected ? th.colors.primary : th.colors.bgCard,
                        color: isSelected ? th.colors.primaryText : th.colors.textPrimary,
                        borderColor: isSelected ? th.colors.borderMain : th.colors.borderSubtle
                      }}
                    >
                      {renderThemeIcon(th.iconName, "w-3 h-3")}
                      <span>{th.name}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setHasEnteredApp(false)}
                className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  color: currentTheme.colors.textSecondary,
                  borderColor: currentTheme.colors.borderSubtle
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tela Inicial</span>
              </button>
            </div>

            {/* Cards dos 5 Grupos Oficiais */}
            <div 
              className="rounded-3xl p-6 sm:p-8 border-2 backdrop-blur-md space-y-6 shadow-2xl"
              style={{
                backgroundColor: currentTheme.colors.bgSurface,
                borderColor: currentTheme.colors.borderMain,
                boxShadow: `0 0 30px ${currentTheme.glowColor}`
              }}
            >
              <div className="text-center space-y-2">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase border"
                  style={{
                    backgroundColor: currentTheme.colors.bgCard,
                    color: currentTheme.colors.primary,
                    borderColor: currentTheme.colors.borderMain
                  }}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>5 Grupos Oficiais • 9º A – Osmarinho</span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-3xl uppercase tracking-wider" style={{ color: currentTheme.colors.textPrimary }}>
                  Escolha o Grupo de Apresentação
                </h2>
                <p className="text-xs sm:text-sm font-mono max-w-2xl mx-auto" style={{ color: currentTheme.colors.textSecondary }}>
                  Selecione qualquer um dos 5 grupos para iniciar a apresentação com vídeo introdutório e gatilhos interativos ou vídeo completo com Quiz da Caatinga.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_GROUPS_LIST.map((grp, idx) => {
                  const isFullVideo = grp.presentationType === "full_video";
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => handleSelectGroup(grp.id, true)}
                      className="group text-left rounded-2xl border-2 p-5 transition-all cursor-pointer flex flex-col justify-between gap-4 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
                      style={{
                        backgroundColor: currentTheme.colors.bgCard,
                        borderColor: currentTheme.colors.borderSubtle,
                        boxShadow: `0 6px 24px rgba(0,0,0,0.45)`
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span 
                            className="text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: currentTheme.colors.bgElevated,
                              color: currentTheme.colors.primary,
                              borderColor: currentTheme.colors.borderMain
                            }}
                          >
                            Grupo {idx + 1} • {grp.temaReferenciaNome}
                          </span>
                          <span className="text-[9px] font-mono" style={{ color: currentTheme.colors.textMuted }}>
                            {isFullVideo ? "Vídeo Completo" : `Intro + ${grp.triggers.length} Gatilhos`}
                          </span>
                        </div>

                        <h3 className="font-display font-black text-base sm:text-lg uppercase tracking-wide leading-snug" style={{ color: currentTheme.colors.textPrimary }}>
                          {grp.name}
                        </h3>

                        <p className="text-[11px] font-mono leading-relaxed" style={{ color: currentTheme.colors.textMuted }}>
                          {grp.description}
                        </p>

                        <div className="space-y-1 pt-2 border-t" style={{ borderColor: currentTheme.colors.borderSubtle }}>
                          {isFullVideo ? (
                            <>
                              <span className="text-[9px] font-mono uppercase font-bold block" style={{ color: currentTheme.colors.textMuted }}>
                                Formato da Apresentação:
                              </span>
                              <p className="text-[10px] font-mono leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                                Reprodução contínua em vídeo único. Ao final: Assistir Novamente ou Fazer Quiz da Caatinga.
                              </p>
                            </>
                          ) : (
                            <>
                              <span className="text-[9px] font-mono uppercase font-bold block" style={{ color: currentTheme.colors.textMuted }}>
                                Gatilhos de Interação ({grp.triggers.length}):
                              </span>
                              <ul className="space-y-1">
                                {grp.triggers.map((tr, tIdx) => (
                                  <li key={tr.id} className="text-[10px] font-mono truncate flex items-center gap-1.5" style={{ color: currentTheme.colors.textSecondary }}>
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: currentTheme.colors.primary }} />
                                    <span className="truncate">{tIdx + 1}. {tr.phrase}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      <div 
                        className="w-full py-2.5 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all group-hover:brightness-110"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.primaryText,
                          borderColor: currentTheme.colors.borderMain
                        }}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Iniciar Grupo {idx + 1}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Barra de Acesso Geral aos 5 Quizzes dos Ecossistemas */}
              <div
                className="rounded-2xl p-4 sm:p-5 border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  borderColor: currentTheme.colors.borderSubtle
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-display font-black text-sm uppercase" style={{ color: currentTheme.colors.textPrimary }}>
                    <Trophy className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.accent }} />
                    <span>Quizzes Interativos dos 5 Ecossistemas</span>
                  </div>
                  <p className="text-[11px] font-mono" style={{ color: currentTheme.colors.textMuted }}>
                    Teste seus conhecimentos sobre cada bioma (5 perguntas • até 5.000 pontos).
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {ALL_QUIZZES_LIST.map((qz) => {
                    const th = THEMES[qz.themeId];
                    const isDefault = qz.themeId === selectedThemeId;
                    return (
                      <button
                        key={qz.id}
                        type="button"
                        onClick={() => openEcosystemQuiz(qz.themeId)}
                        className="min-h-[40px] px-3 py-2 rounded-xl font-mono text-[10px] font-black uppercase border flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
                        style={{
                          backgroundColor: isDefault ? th.colors.primary : currentTheme.colors.bgSurface,
                          color: isDefault ? th.colors.primaryText : th.colors.textPrimary,
                          borderColor: isDefault ? th.colors.borderMain : currentTheme.colors.borderSubtle
                        }}
                      >
                        {renderThemeIcon(th.iconName, "w-3.5 h-3.5 shrink-0")}
                        <span>Quiz {qz.ecosystemName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1B: PLAYER & INTERAÇÃO DO GRUPO SELECIONADO */}
        {hasEnteredApp && hasSelectedGroup && activeTab === "chat" && (
          <div className="space-y-6 animate-fade-in max-w-7xl mx-auto w-full transition-all duration-300">
            
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">

              {/* Biome & Presentation Group HUD Control Bar */}
              {!isFullscreen && (
                <div 
                  className="rounded-2xl p-3 sm:p-4 border-2 backdrop-blur-md flex flex-col gap-3 shadow-lg transition-all"
                  style={{
                    backgroundColor: currentTheme.colors.bgSurface,
                    borderColor: currentTheme.colors.borderSubtle,
                    boxShadow: `0 0 20px ${currentTheme.glowColor}`
                  }}
                >
                  {/* Line 1: Biomes Switcher (5 Official Themes - visual appearance only) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: currentTheme.colors.textMuted }}>
                        Tema Visual:
                      </span>
                      {THEME_LIST.map((th) => {
                        const isSelected = selectedThemeId === th.id;
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => handleSelectTheme(th.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected ? "scale-105 shadow-md" : "opacity-75 hover:opacity-100"
                            }`}
                            style={{
                              backgroundColor: isSelected ? th.colors.primary : th.colors.bgCard,
                              color: isSelected ? th.colors.primaryText : th.colors.textPrimary,
                              borderColor: isSelected ? th.colors.borderMain : th.colors.borderSubtle,
                              boxShadow: isSelected ? `0 0 10px ${th.colors.glow}` : "none"
                            }}
                          >
                            {renderThemeIcon(th.iconName, "w-3 h-3")}
                            <span>{th.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          suspendSpeechRecognition();
                          setHasSelectedGroup(false);
                          setHasStarted(false);
                          setVideoFinished(false);
                          setPresentationEnded(false);
                          setExperienceState("AGUARDANDO");
                        }}
                        className="text-[9px] font-mono font-bold px-2.5 py-1 rounded border uppercase flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                        style={{
                          backgroundColor: currentTheme.colors.bgCard,
                          color: currentTheme.colors.primary,
                          borderColor: currentTheme.colors.borderMain
                        }}
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Trocar Grupo</span>
                      </button>
                    </div>
                  </div>

                  {/* Line 2: Universal Presentation Groups (Strictly the 3 Official Groups) */}
                  <div 
                    className="pt-2.5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    style={{ borderColor: currentTheme.colors.borderSubtle }}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="text-[10px] font-mono font-bold uppercase flex items-center gap-1.5"
                        style={{ color: currentTheme.colors.primary }}
                      >
                        <Users className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                        <span>Grupo Ativo:</span>
                      </span>
                      <span 
                        className="text-[9px] font-mono px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: currentTheme.colors.bgCard,
                          color: currentTheme.colors.textMuted,
                          borderColor: currentTheme.colors.borderSubtle
                        }}
                      >
                        Integrantes: <strong style={{ color: currentTheme.colors.textPrimary }}>{currentGroup.integrantes.join(", ")}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {ALL_GROUPS_LIST.map((grp) => {
                        const isGroupActive = currentGroup.id === grp.id;
                        return (
                          <button
                            key={grp.id}
                            type="button"
                            onClick={() => handleSelectGroup(grp.id, true)}
                            className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-black uppercase border transition-all cursor-pointer flex items-center gap-2 ${
                              isGroupActive 
                                ? "scale-105 shadow-md ring-2" 
                                : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
                            }`}
                            style={{
                              backgroundColor: isGroupActive ? currentTheme.colors.primary : currentTheme.colors.bgCard,
                              color: isGroupActive ? currentTheme.colors.primaryText : currentTheme.colors.textPrimary,
                              borderColor: isGroupActive ? currentTheme.colors.borderMain : currentTheme.colors.borderSubtle,
                              boxShadow: isGroupActive ? `0 0 16px ${currentTheme.glowColor}` : "none",
                              // @ts-ignore
                              "--tw-ring-color": currentTheme.colors.primary
                            }}
                            title={`Apresentação: ${grp.name}`}
                          >
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: isGroupActive ? currentTheme.colors.primaryText : currentTheme.colors.accent }}
                            />
                            <span>{grp.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Centered Video Stream Box Container */}
              <div className={`w-full relative ${isFullscreen ? "pt-0" : "pt-1 sm:pt-2"}`}>
                
                {/* Main Video Box: 16:9 aspect-video for edge-to-edge fitted display without letterboxing */}
                <div 
                  ref={videoContainerRef}
                  onTouchEnd={handleVideoTouch}
                  className={
                    isFullscreen
                      ? "fixed inset-0 z-50 w-screen h-[100dvh] bg-black m-0 p-0 overflow-hidden flex flex-col justify-center items-center"
                      : "border-2 sm:border-3 rounded-2xl sm:rounded-3xl relative w-full aspect-video max-h-[75vh] sm:max-h-[580px] min-h-[250px] sm:min-h-[360px] flex flex-col justify-center items-center group transition-all duration-300 overflow-hidden"
                  }
                  style={!isFullscreen ? {
                    backgroundColor: currentTheme.colors.bgSurface,
                    borderColor: currentTheme.colors.borderMain,
                    boxShadow: `0 0 28px ${currentTheme.glowColor}, 0 12px 40px rgba(0,0,0,0.8)`
                  } : undefined}
                >
                  {/* Inner overflow-hidden container to round off borders correctly */}
                  <div className={`absolute inset-0 ${isFullscreen ? "rounded-none" : "rounded-[14px] sm:rounded-[22px]"} overflow-hidden flex flex-col justify-center items-center w-full h-full max-w-full max-h-full`}>
                    
                    {/* Floating Layout Toggles Overlay */}
                    {!isFullscreen && (
                      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-zinc-800 shadow-xl max-w-[calc(100%-1.25rem)] overflow-x-auto no-scrollbar">
                        {/* Fullscreen Button */}
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className={`bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0 ${
                            isFullscreen ? "bg-white text-black border-black font-extrabold" : ""
                          }`}
                          title={isFullscreen ? "Sair da Tela Inteira" : "Encaixar em Tela Inteira"}
                        >
                          {isFullscreen ? <Minimize className="w-3.5 h-3.5 shrink-0" /> : <Maximize className="w-3.5 h-3.5 shrink-0" />}
                          <span className="hidden sm:inline whitespace-nowrap leading-none">{isFullscreen ? "Sair" : "Tela Cheia"}</span>
                        </button>

                        {/* Video Fit Button: Ajustado (object-fit: contain) */}
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFit("contain");
                            showSaveSuccess("Modo Ajustado: vídeo proporcional dentro do container (sem cortes)");
                          }}
                          className="bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-700 bg-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0"
                          title="Enquadramento Ajustado Proporcional (object-fit: contain)"
                        >
                          <Tv className="w-3.5 h-3.5 shrink-0 text-white" />
                          <span className="hidden md:inline whitespace-nowrap leading-none">Ajustado</span>
                        </button>

                        {/* Video Quality Quick Toggle / Indicator: 1080p */}
                        <button
                          type="button"
                          onClick={() => {
                            const cycle: VideoQualityPreference[] = ["hd1080", "hd720", "large", "medium", "auto"];
                            const nextIdx = (cycle.indexOf(preferredVideoQuality) + 1) % cycle.length;
                            const nextQuality = cycle[nextIdx];
                            setPreferredVideoQuality(nextQuality);
                            triggerQualityAutoPulse(nextQuality);
                            setYtReloadKey(prev => prev + 1);
                          }}
                          className="bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0"
                          title={`Qualidade Inicial Atual: ${
                            preferredVideoQuality === "hd1080" ? "1080p (Full HD)" :
                            preferredVideoQuality === "hd720" ? "720p (HD)" :
                            preferredVideoQuality === "large" ? "480p (SD)" :
                            preferredVideoQuality === "medium" ? "360p" : "Automático"
                          }. Clique para alternar resolução.`}
                        >
                          <Sliders className="w-3 h-3 shrink-0 text-white" />
                          <span className="whitespace-nowrap leading-none font-bold">
                            {preferredVideoQuality === "hd1080" ? "1080p FHD" :
                             preferredVideoQuality === "hd720" ? "720p HD" :
                             preferredVideoQuality === "large" ? "480p" :
                             preferredVideoQuality === "medium" ? "360p" : "Auto"}
                          </span>
                        </button>

                        {/* Audio Button */}
                        <button
                          type="button"
                          onClick={() => setVideoMuted(prev => !prev)}
                          className="bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0"
                          title={videoMuted ? "Ativar Áudio" : "Silenciar Áudio"}
                        >
                          {videoMuted ? <VolumeX className="w-3.5 h-3.5 shrink-0 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 shrink-0 text-white" />}
                        </button>

                        {!isFullscreen && (
                          <button
                            type="button"
                            onClick={() => setHidePanels(prev => !prev)}
                            className={`bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm whitespace-nowrap leading-none shrink-0 ${hidePanels ? "bg-white text-black border-black" : ""}`}
                            title={hidePanels ? "Mostrar Painel, Chat e Opções de Controle" : "Ocultar Informações para Focar no Vídeo"}
                          >
                            {hidePanels ? <Eye className="w-3 h-3 shrink-0" /> : <EyeOff className="w-3 h-3 shrink-0" />}
                            <span className="hidden lg:inline whitespace-nowrap leading-none">{hidePanels ? "Ver Painel" : "Ocultar"}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Top Left Status Badge in Fullscreen */}
                    {isFullscreen && videoFinished && (
                      <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-300 shadow-md whitespace-nowrap leading-none">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                        <span className="font-bold text-white uppercase whitespace-nowrap leading-none">
                          {activeVideoSlot === "full_video"
                            ? "Vídeo Completo"
                            : activeVideoSlot === "intro"
                            ? "Apresentação (Intro)"
                            : `Canal ${effectiveQuestions.findIndex(q => q.id === activeVideoSlot) + 1}`}
                        </span>
                        <span className="text-[8px] bg-white/15 text-white px-1.5 py-0.5 rounded font-extrabold uppercase whitespace-nowrap leading-none">
                          1080p FHD
                        </span>
                        {isMobile && (
                          <span className="text-[8px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-extrabold uppercase whitespace-nowrap leading-none">
                            Mobile
                          </span>
                        )}
                      </div>
                    )}

                    {!hasStarted ? (
                      <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-8 text-center z-40 animate-fade-in text-zinc-300">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255, 255, 255, 0.08)_0%,transparent_70%)] opacity-80 pointer-events-none" />
                        
                        <div className="relative mb-4">
                          <AppLogo size="lg" />
                        </div>

                        <div className="space-y-2.5 max-w-md">
                          <div 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm"
                            style={{
                              backgroundColor: currentTheme.colors.bgCard,
                              color: currentTheme.colors.primary,
                              borderColor: currentTheme.colors.borderMain
                            }}
                          >
                            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentTheme.colors.primary }} />
                            <span>{currentGroup.temaReferenciaNome} • {currentGroup.name}</span>
                          </div>
                          <h4 
                            className="font-display font-black text-lg sm:text-2xl uppercase tracking-wider leading-tight"
                            style={{ color: currentTheme.colors.textPrimary }}
                          >
                            {currentGroup.name}
                          </h4>
                          <p className="text-xs sm:text-sm font-mono leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                            {effectiveIntroName}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setVideoMuted(false);
                            triggerVideoSlot(isFullVideoGroup ? "full_video" : "intro");
                            triggerQualityAutoPulse("hd1080");
                          }}
                          className="mt-5 px-8 sm:px-10 py-3.5 sm:py-4 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 group whitespace-nowrap leading-none shrink-0 hover:scale-105 active:scale-95 shadow-md"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.primaryText,
                            borderColor: currentTheme.colors.borderMain,
                            boxShadow: `0 0 20px ${currentTheme.glowColor}`
                          }}
                        >
                          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform shrink-0" />
                          <span className="whitespace-nowrap leading-none">Iniciar Apresentação</span>
                        </button>
                      </div>
                    ) : getActiveVideoUrl() ? (
                      <div className="absolute inset-0 bg-black flex items-center justify-center w-full h-full max-w-full max-h-full overflow-hidden">
                        {isYouTubeUrl(getActiveVideoUrl()) ? (
                          <div className="w-full h-full max-w-full max-h-full relative overflow-hidden bg-black flex items-center justify-center">
                            <iframe
                              ref={ytIframeRef}
                              id="wit-yt-iframe"
                              key={`${activeVideoSlot}-${getYouTubeVideoId(getActiveVideoUrl())}-${ytReloadKey}`}
                              src={videoFinished ? "about:blank" : `https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(getActiveVideoUrl())}?autoplay=1&mute=${videoMuted ? 1 : 0}&enablejsapi=1&origin=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}&playsinline=1&rel=0&modestbranding=1&controls=1&loop=0&vq=hd1080&hd=1&suggestedQuality=hd1080&fmt=22&highres=1`}
                              title={getActiveVideoTitle()}
                              onLoad={() => {
                                if (!videoFinishedRef.current) {
                                  triggerQualityAutoPulse("hd1080");
                                  attachYtPlayer();
                                }
                              }}
                              className={`w-full h-full max-w-full max-h-full aspect-video border-0 select-none pointer-events-auto transition-all duration-300 video-fit-contain ${videoFinished ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              style={{
                                objectFit: "contain",
                                width: "100%",
                                height: "100%",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                aspectRatio: "16 / 9",
                                imageRendering: "-webkit-optimize-contrast"
                              }}
                            />

                            {/* Extensão 1080p Only Lock Badge & Status */}
                            {force1080pOnly && isYouTubeUrl(getActiveVideoUrl()) && !isFullscreen && (
                              <div className="absolute top-2.5 left-2.5 z-30 hidden sm:flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-600 shadow-[0_0_15px_rgba(255, 255, 255, 0.15)] select-none">
                                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                                <span className="text-[10px] font-mono font-black text-white uppercase whitespace-nowrap leading-none">
                                   Extensão 1080p Ativa
                                </span>
                                <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase whitespace-nowrap leading-none flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 stroke-[3]" />
                                  <span>Travado em 1080</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerQualityAutoPulse("hd1080");
                                    setAiResponseText("Extensão: Resolução 1080p Full HD re-forçada com sucesso no reprodutor.");
                                  }}
                                  className="text-zinc-400 hover:text-white p-0.5 cursor-pointer ml-0.5"
                                  title="Reaplicar comando de 1080p da extensão"
                                >
                                  <RefreshCw className="w-2.5 h-2.5 hover:rotate-180 transition-transform text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <video
                            key={activeVideoSlot}
                            ref={videoRef}
                            src={getActiveVideoUrl()}
                            className={`w-full h-full max-w-full max-h-full object-contain aspect-video ${videoFinished ? "blur-[2.5px]" : ""} transition-all duration-300 video-fit-contain`}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                              maxWidth: "100%",
                              maxHeight: "100%",
                              aspectRatio: "16 / 9"
                            }}
                            autoPlay
                            loop={false}
                            muted={videoMuted}
                            playsInline
                            onEnded={() => handleVideoEnded("html5_video_ended")}
                            onError={() => {
                              setVideoPlayError("Não foi possível reproduzir este vídeo.");
                            }}
                          />
                        )}

                        {/* END OF VIDEO: TELA DE INTERAÇÃO OU ENCERRAMENTO ("TCHAU") */}
                        {videoFinished && (
                          <div className="absolute inset-0 bg-black/88 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-2 sm:p-6 z-40 select-none overflow-hidden animate-fade-in">
                            <div className="w-full max-w-2xl bg-zinc-950/95 border-t-4 sm:border-2 border-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_-12px_45px_rgba(255,255,255,0.12)] sm:shadow-[0_0_50px_rgba(0,0,0,0.95)] animate-slide-up flex flex-col max-h-[88vh] overflow-y-auto">
                              <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mb-3 sm:hidden" />

                              {presentationEnded ? (
                                /* TELA LIMPA DE ENCERRAMENTO APÓS O GATILHO "TCHAU" */
                                <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
                                  <AppLogo size="md" />
                                  <div 
                                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border"
                                    style={{
                                      backgroundColor: currentTheme.colors.bgCard,
                                      color: currentTheme.colors.primary,
                                      borderColor: currentTheme.colors.borderMain
                                    }}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Apresentação Encerrada</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <h3 className="font-display font-black text-lg sm:text-2xl uppercase tracking-wider text-white">
                                      Obrigado por acompanhar!
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-300 max-w-md mx-auto">
                                      A apresentação do grupo <strong className="text-white">{currentGroup.name}</strong> foi concluída.
                                    </p>
                                    <p className="text-[10px] font-mono text-zinc-400">
                                      ASSISTENTES DA NATUREZA • 9º A – OSMARINHO
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => openEcosystemQuiz(selectedThemeId)}
                                      className="px-4 py-2.5 font-mono text-[10px] font-black uppercase rounded-xl border-2 cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 whitespace-nowrap"
                                      style={{
                                        backgroundColor: currentTheme.colors.accent,
                                        color: currentTheme.colors.accentText,
                                        borderColor: currentTheme.colors.borderMain
                                      }}
                                    >
                                      <Trophy className="w-3.5 h-3.5 shrink-0" />
                                      <span>Quiz do Ecossistema</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHasSelectedGroup(false);
                                        setHasStarted(false);
                                        setVideoFinished(false);
                                        setPresentationEnded(false);
                                        presentationEndedRef.current = false;
                                        setExperienceState("AGUARDANDO");
                                      }}
                                      className="px-4 py-2.5 font-mono text-[10px] font-black uppercase rounded-xl border-2 cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 whitespace-nowrap"
                                      style={{
                                        backgroundColor: currentTheme.colors.primary,
                                        color: currentTheme.colors.primaryText,
                                        borderColor: currentTheme.colors.borderMain
                                      }}
                                    >
                                      <Users className="w-3.5 h-3.5 shrink-0" />
                                      <span>Escolher Outro Grupo</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHasEnteredApp(false);
                                        setHasSelectedGroup(false);
                                        setHasStarted(false);
                                        setVideoFinished(false);
                                        setPresentationEnded(false);
                                        presentationEndedRef.current = false;
                                        setExperienceState("AGUARDANDO");
                                      }}
                                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border-2 border-zinc-700 font-mono text-[10px] font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1.5 transition-all whitespace-nowrap"
                                    >
                                      <Home className="w-3.5 h-3.5 shrink-0" />
                                      <span>Tela Inicial</span>
                                    </button>
                                  </div>
                                </div>
                              ) : isFullVideoGroup ? (
                                /* TELA PÓS-VÍDEO EXCLUSIVA DO GRUPO 5 (MIGUEL, MARIANA, BIANCA E LETÍCIA) */
                                <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
                                  <AppLogo size="md" />
                                  <div 
                                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border"
                                    style={{
                                      backgroundColor: currentTheme.colors.bgCard,
                                      color: currentTheme.colors.primary,
                                      borderColor: currentTheme.colors.borderMain
                                    }}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Vídeo Completo Finalizado</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <h3 className="font-display font-black text-lg sm:text-2xl uppercase tracking-wider text-white">
                                      {currentGroup.name}
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-300 max-w-md mx-auto">
                                      O vídeo completo da Caatinga foi concluído. Escolha uma das opções abaixo para continuar:
                                    </p>
                                  </div>

                                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
                                    <button
                                      type="button"
                                      onClick={() => triggerVideoSlot("full_video")}
                                      className="w-full sm:w-auto min-h-[46px] px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white border-2 border-white/70 font-display font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
                                    >
                                      <RotateCcw className="w-4 h-4 shrink-0" />
                                      <span>ASSISTIR NOVAMENTE</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openEcosystemQuiz("caatinga")}
                                      className="w-full sm:w-auto min-h-[46px] px-6 py-3 font-display font-black text-xs uppercase tracking-wider rounded-xl border-2 cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap shadow-lg"
                                      style={{
                                        backgroundColor: currentTheme.colors.primary,
                                        color: currentTheme.colors.primaryText,
                                        borderColor: currentTheme.colors.borderMain
                                      }}
                                    >
                                      <Trophy className="w-4 h-4 shrink-0" />
                                      <span>FAZER QUIZ DA CAATINGA</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* MODO DE INTERAÇÃO COM MICROFONE + GATILHOS DO GRUPO ATIVO */
                                <>
                                  <div className="flex flex-col items-center justify-center text-center gap-2 mb-4">
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                      <div className="flex items-center gap-2 bg-white text-black px-3.5 py-1.5 rounded-full font-mono text-[9px] sm:text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap leading-none shrink-0">
                                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                        <span className="whitespace-nowrap leading-none">
                                          Vídeo Concluído • {effectiveQuestions.length} Gatilhos Disponíveis
                                        </span>
                                      </div>
                                      <span className="text-[9px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold uppercase flex items-center gap-1.5 shadow-sm">
                                        <span className={`w-1.5 h-1.5 rounded-full ${experienceState === "ESCUTANDO" ? "bg-red-500 animate-ping" : "bg-emerald-400"}`} />
                                        <span>{experienceState === "ESCUTANDO" ? "Escutando Fala" : "Aguardando Interação"}</span>
                                      </span>
                                    </div>

                                    <h3 className="font-display font-black text-sm sm:text-base md:text-lg uppercase tracking-wider text-white leading-snug">
                                      Escolha um gatilho ou fale no microfone
                                    </h3>
                                  </div>

                                  {/* Botão FALAR NO MICROFONE */}
                                  <div className="mb-3.5 flex flex-col items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={toggleListening}
                                      className={`px-5 py-2.5 rounded-xl border-2 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap leading-none shrink-0 ${
                                        isListening || isRecordingMedia
                                          ? "bg-red-500 text-white border-black animate-pulse"
                                          : isAnalyzing
                                          ? "bg-amber-400 text-black border-black animate-bounce"
                                          : "bg-white text-black hover:bg-zinc-200 border-black"
                                      }`}
                                    >
                                      <Mic className="w-4 h-4 shrink-0" />
                                      <span className="whitespace-nowrap leading-none font-extrabold">
                                        {isListening || isRecordingMedia
                                          ? "Ouvindo... Fale a pergunta agora"
                                          : isAnalyzing
                                          ? "Processando fala..."
                                          : "FALAR NO MICROFONE"}
                                      </span>
                                    </button>
                                  </div>

                                  {/* Exclusivamente os gatilhos do grupo ativo */}
                                  <div className="flex flex-col gap-2.5 w-full max-h-[260px] sm:max-h-[300px] overflow-y-auto pr-1">
                                    {effectiveQuestions.map((q, idx) => (
                                      <button
                                        key={q.id}
                                        type="button"
                                        onClick={() => triggerVideoSlot(q.id)}
                                        disabled={!q.videoUrl}
                                        className="w-full relative bg-zinc-900/90 hover:bg-black border-2 border-zinc-800 hover:border-white px-4 py-3 rounded-2xl text-left transition-all duration-200 cursor-pointer outline-none focus:outline-none flex items-center justify-between gap-3 select-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] active:scale-[0.99] group min-w-0"
                                      >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                          <div className="w-9 h-9 rounded-xl bg-black border border-zinc-700 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:border-black shrink-0 transition-colors shadow-sm font-mono font-black text-xs">
                                            {idx + 1}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate leading-snug">
                                              "{q.phrase}"
                                            </div>
                                            <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5 leading-normal">
                                              {q.isEndingTrigger ? "Encerrar apresentação do grupo" : q.videoName}
                                            </div>
                                          </div>
                                        </div>

                                        <span className="shrink-0 text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded-lg bg-white text-black border border-black flex items-center gap-1.5 group-hover:bg-zinc-200 transition-colors whitespace-nowrap leading-none">
                                          <Play className="w-3 h-3 fill-black shrink-0" />
                                          <span className="whitespace-nowrap leading-none">Assistir</span>
                                        </span>
                                      </button>
                                    ))}
                                  </div>

                                  {/* Bottom action buttons + Quiz do Ecossistema */}
                                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-4 pt-3 border-t border-zinc-800 w-full">
                                    <button
                                      type="button"
                                      onClick={handleReplayVideo}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-2 border-black hover:border-zinc-600 text-white font-mono text-[10px] font-bold uppercase rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap leading-none shrink-0"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                      <span className="whitespace-nowrap leading-none">Rever Vídeo</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => triggerVideoSlot("intro")}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-2 border-black hover:border-white text-zinc-200 font-mono text-[10px] font-bold uppercase rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap leading-none shrink-0"
                                    >
                                      <Play className="w-3.5 h-3.5 text-white shrink-0" />
                                      <span className="whitespace-nowrap leading-none">Introdução</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => openEcosystemQuiz(selectedThemeId)}
                                      className="flex items-center gap-1.5 px-3.5 py-2 border-2 font-mono text-[10px] font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap leading-none shrink-0"
                                      style={{
                                        backgroundColor: currentTheme.colors.primary,
                                        color: currentTheme.colors.primaryText,
                                        borderColor: currentTheme.colors.borderMain
                                      }}
                                    >
                                      <Trophy className="w-3.5 h-3.5 shrink-0" />
                                      <span className="whitespace-nowrap leading-none">QUIZ DO ECOSSISTEMA</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center max-w-sm flex flex-col items-center gap-4 bg-white/5 backdrop-blur-md text-zinc-300">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255, 255, 255, 0.15)] animate-pulse">
                          <Video className="w-7 h-7 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-white uppercase tracking-wider">Nenhum Vídeo Carregado</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Selecione um grupo para carregar seus vídeos configurados.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Sub-system Alerts inside screen */}
                    {videoPlayError && (
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-5 text-center z-10 border-2 border-red-500">
                        <AlertTriangle className="w-8 h-8 text-red-500 mb-1" />
                        <span className="text-[10px] font-mono font-bold text-red-600 block">FALHA DE CARREGAMENTO</span>
                        <p className="text-[11px] text-zinc-600 max-w-xs mt-1 leading-normal font-sans">
                          {videoPlayError}
                        </p>
                        <button
                          onClick={() => setVideoPlayError("")}
                          className="mt-3 px-3 py-1 bg-black text-white hover:bg-zinc-800 text-[10px] font-mono font-bold rounded-lg transition-all border border-black cursor-pointer"
                        >
                          IGNORAR
                        </button>
                      </div>
                    )}
                    
                    {/* Quality & Resolution Indicator on Bottom Left */}
                    {!isFullscreen && (
                      <div className="absolute bottom-3 left-3 z-10 hidden xs:flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[9px] font-mono shadow-sm pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-white font-extrabold uppercase">1080p HD</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-300 font-bold uppercase truncate max-w-[140px] sm:max-w-[220px]">
                          {getActiveVideoTitle()}
                        </span>
                      </div>
                    )}

                    {/* Active Route Slot Indicators on the bottom right corner */}
                    {!isFullscreen && (
                      <div className="absolute bottom-3 right-3 z-10 flex flex-wrap gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-lg border border-zinc-800 text-[10px] font-mono shadow-sm max-w-[230px]">
                        {isFullVideoGroup ? (
                          <button
                            onClick={() => triggerVideoSlot("full_video")}
                            className="px-2 py-0.5 rounded font-bold transition-all cursor-pointer bg-white text-black border border-black"
                            title="Reproduzir vídeo completo"
                          >
                            Vídeo Completo
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => triggerVideoSlot("intro")}
                              disabled={!effectiveIntroUrl}
                              className={`px-2 py-0.5 rounded font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${activeVideoSlot === "intro" ? "bg-white text-black border border-black" : "text-zinc-400 hover:text-white"}`}
                              title="Ir para o vídeo inicial"
                            >
                              Intro
                            </button>
                            {effectiveQuestions.map((q, idx) => {
                              const isWatched = viewedSlots.includes(q.id);
                              return (
                                <button
                                  key={q.id}
                                  onClick={() => triggerVideoSlot(q.id)}
                                  disabled={!q.videoUrl}
                                  className={`px-2 py-0.5 rounded font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                                    activeVideoSlot === q.id 
                                      ? "bg-white text-black border border-black" 
                                      : isWatched
                                      ? "text-emerald-300 hover:text-white"
                                      : "text-zinc-400 hover:text-white"
                                  }`}
                                  title={`Gatilho ${idx + 1}: ${q.phrase}`}
                                >
                                  G{idx + 1}
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                    )}

                    {/* Floating Voice & Quick Control Dock when in Fullscreen */}
                    {isFullscreen && videoFinished && !presentationEnded && (
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.9)] max-w-[95vw]">
                        {!isFullVideoGroup ? (
                          <button
                            onClick={toggleListening}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] font-black uppercase border transition-all cursor-pointer ${
                              isListening
                                ? "bg-red-500 text-white border-white shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"
                                : "bg-white text-black border-black hover:bg-white active:scale-95"
                            }`}
                          >
                            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                            <span>{isListening ? "Ouvindo..." : "Falar"}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              exitFullscreenAuto();
                              openEcosystemQuiz("caatinga");
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] font-black uppercase border transition-all cursor-pointer bg-white text-black border-black"
                          >
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Fazer Quiz da Caatinga</span>
                          </button>
                        )}
                        
                        <div className="h-4 w-px bg-zinc-800" />

                        <button
                          onClick={handleReplayVideo}
                          className="text-zinc-400 hover:text-white p-1.5 rounded transition-colors cursor-pointer"
                          title="Rever Vídeo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setVideoFit(prev => prev === "cover" ? "contain" : "cover")}
                          className="text-zinc-400 hover:text-white text-[9px] font-mono px-2 py-1 rounded border border-zinc-800 cursor-pointer"
                          title="Alternar Encaixe de Vídeo"
                        >
                          {videoFit === "cover" ? "Preenchido" : "Original"}
                        </button>

                        <div className="h-4 w-px bg-zinc-800" />

                        <button
                          onClick={toggleFullscreen}
                          className="flex items-center gap-1 text-zinc-300 hover:text-white text-[9px] font-mono font-bold bg-zinc-900 px-2 py-1 rounded border border-zinc-800 cursor-pointer"
                          title="Sair da Tela Inteira"
                        >
                          <Minimize className="w-3 h-3 text-white" />
                          <span>Sair</span>
                        </button>
                      </div>
                    )}

                  </div>

                </div>

                {/* Mobile Quick Bar for Voice, Fullscreen and Fit */}
                {isMobile && !isFullscreen && !hidePanels && (
                  <div className="mt-2.5 flex flex-col gap-2 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-xl p-2.5 text-[10px] font-mono text-zinc-300 shadow-md">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Smartphone className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="truncate">Modo: <strong className="text-white">Ajustado (Fit)</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFit("contain");
                            showSaveSuccess("Modo Ajustado: proporção 100% preservada");
                          }}
                          className="text-white px-2 py-1 rounded border border-zinc-700 bg-zinc-800 font-bold active:scale-95 transition-all text-[9px]"
                          title="Ajustado ao container"
                        >
                          Ajustado
                        </button>
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="flex items-center gap-1 text-black font-black bg-white hover:bg-white/90 px-2.5 py-1 rounded border border-black cursor-pointer shadow-sm active:scale-95 transition-all text-[9px]"
                        >
                          <Maximize className="w-3 h-3" />
                          <span>Tela Cheia</span>
                        </button>
                      </div>
                    </div>

                    {/* Dedicated Primary Mobile Voice Button (Apenas grupos com gatilhos de voz) */}
                    {!presentationEnded && !isFullVideoGroup && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`w-full py-2.5 px-3 rounded-lg border-2 font-mono text-[11px] font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 ${
                          isListening || isRecordingMedia
                            ? "bg-red-500 text-white border-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                            : "bg-white text-black border-black hover:bg-white/90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                      >
                        {isListening || isRecordingMedia ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            <span>Ouvindo no Celular... ({recordingDuration}s) Toque p/ Parar</span>
                          </>
                        ) : isTranscribing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>Transcrevendo Fala com IA...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span>Toque Aqui para Falar (Microfone)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

              </div>

              {/* Gatilhos Disponíveis ou Tela de Encerramento */}
              {!hidePanels && !isFullscreen && (
                <div 
                  className={`backdrop-blur-md border-2 sm:border-3 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 text-left transition-all duration-300 ${
                    videoFinished ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: currentTheme.colors.bgSurface,
                    borderColor: currentTheme.colors.borderSubtle,
                    boxShadow: `5px 5px 0px 0px rgba(0,0,0,1), 0 0 20px ${currentTheme.colors.glow}`,
                    // @ts-ignore
                    "--tw-ring-color": currentTheme.colors.primary
                  }}
                >
                  {presentationEnded ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-7 h-7 shrink-0" style={{ color: currentTheme.colors.primary }} />
                        <div>
                          <h3 className="font-display font-black text-sm uppercase tracking-wider" style={{ color: currentTheme.colors.textPrimary }}>
                            Apresentação de {currentGroup.name} Encerrada
                          </h3>
                          <p className="text-[11px] font-mono mt-0.5" style={{ color: currentTheme.colors.textMuted }}>
                            O microfone foi desativado após o encerramento. Selecione outro grupo ou volte à tela inicial.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setHasSelectedGroup(false);
                            setHasStarted(false);
                            setVideoFinished(false);
                            setPresentationEnded(false);
                            presentationEndedRef.current = false;
                            setExperienceState("AGUARDANDO");
                          }}
                          className="px-4 py-2 font-mono font-black text-[10px] uppercase rounded-xl border cursor-pointer flex items-center gap-1.5"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.primaryText,
                            borderColor: currentTheme.colors.borderMain
                          }}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Outros Grupos</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHasEnteredApp(false);
                            setHasSelectedGroup(false);
                            setHasStarted(false);
                            setVideoFinished(false);
                            setPresentationEnded(false);
                            presentationEndedRef.current = false;
                            setExperienceState("AGUARDANDO");
                          }}
                          className="px-4 py-2 font-mono font-bold text-[10px] uppercase rounded-xl border cursor-pointer flex items-center gap-1.5"
                          style={{
                            backgroundColor: currentTheme.colors.bgCard,
                            color: currentTheme.colors.textPrimary,
                            borderColor: currentTheme.colors.borderSubtle
                          }}
                        >
                          <Home className="w-3.5 h-3.5" />
                          <span>Início</span>
                        </button>
                      </div>
                    </div>
                  ) : isFullVideoGroup ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-wider" style={{ color: currentTheme.colors.textPrimary }}>
                          {currentGroup.name} • Apresentação Completa (Caatinga)
                        </h3>
                        <p className="text-[11px] font-mono" style={{ color: currentTheme.colors.textMuted }}>
                          {videoFinished
                            ? "Apresentação finalizada. Escolha assistir novamente ou iniciar o Quiz da Caatinga."
                            : "Reproduzindo vídeo completo da apresentação. Ao término, você poderá assistir novamente ou fazer o Quiz da Caatinga."}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => triggerVideoSlot("full_video")}
                          className="min-h-[42px] px-4 py-2 font-mono font-bold text-[10px] uppercase rounded-xl border cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                          style={{
                            backgroundColor: currentTheme.colors.bgCard,
                            color: currentTheme.colors.textPrimary,
                            borderColor: currentTheme.colors.borderSubtle
                          }}
                        >
                          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                          <span>ASSISTIR NOVAMENTE</span>
                        </button>
                        {videoFinished && (
                          <button
                            type="button"
                            onClick={() => openEcosystemQuiz("caatinga")}
                            className="min-h-[42px] px-4 py-2 font-mono font-black text-[10px] uppercase rounded-xl border-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-md"
                            style={{
                              backgroundColor: currentTheme.colors.primary,
                              color: currentTheme.colors.primaryText,
                              borderColor: currentTheme.colors.borderMain
                            }}
                          >
                            <Trophy className="w-3.5 h-3.5 shrink-0" />
                            <span>FAZER QUIZ DA CAATINGA</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3"
                        style={{ borderColor: currentTheme.colors.borderSubtle }}
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span 
                            className={`w-2.5 h-2.5 rounded-full ${videoFinished ? "animate-ping" : ""}`}
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          />
                          <h3 
                            className="font-display font-black text-xs sm:text-sm uppercase tracking-wider"
                            style={{ color: currentTheme.colors.textPrimary }}
                          >
                            Gatilhos do Grupo ({effectiveQuestions.length})
                          </h3>
                          <span 
                            className="text-[9px] font-mono px-2 py-0.5 rounded font-extrabold border uppercase"
                            style={{
                              backgroundColor: currentTheme.colors.bgCard,
                              color: currentTheme.colors.textSecondary,
                              borderColor: currentTheme.colors.borderSubtle
                            }}
                          >
                            {videoFinished ? "Fale no Microfone ou Toque" : "Selecione a Qualquer Momento"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => openEcosystemQuiz(selectedThemeId)}
                            className="text-[10px] font-mono font-black uppercase flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-all hover:scale-105 whitespace-nowrap"
                            style={{
                              backgroundColor: currentTheme.colors.primary,
                              color: currentTheme.colors.primaryText,
                              borderColor: currentTheme.colors.borderMain
                            }}
                          >
                            <Trophy className="w-3 h-3 shrink-0" />
                            <span>QUIZ DO ECOSSISTEMA</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerVideoSlot("intro")}
                            className="text-[10px] font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-lg border whitespace-nowrap"
                            style={{
                              backgroundColor: currentTheme.colors.bgCard,
                              color: currentTheme.colors.primary,
                              borderColor: currentTheme.colors.borderSubtle
                            }}
                          >
                            <RotateCcw className="w-3 h-3 shrink-0" />
                            <span>Rever Introdução</span>
                          </button>
                        </div>
                      </div>

                      {/* Exclusivamente os gatilhos do grupo ativo (sem remoção nem duplicação) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {effectiveQuestions.map((q, idx) => {
                          const isActive = activeVideoSlot === q.id && !videoFinished;
                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => triggerVideoSlot(q.id)}
                              disabled={!q.videoUrl}
                              className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left min-w-0 ${
                                isActive ? "scale-[1.01]" : "hover:brightness-110 active:scale-98"
                              } disabled:opacity-30 disabled:pointer-events-none`}
                              style={{
                                backgroundColor: isActive ? currentTheme.colors.bgElevated : currentTheme.colors.bgCard,
                                borderColor: isActive ? currentTheme.colors.borderMain : currentTheme.colors.borderSubtle,
                                boxShadow: isActive ? `0 0 14px ${currentTheme.colors.glow}` : "2px 2px 0px 0px rgba(0,0,0,1)"
                              }}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border font-mono font-black text-xs ${
                                  isActive ? "bg-white text-black border-black" : "bg-black text-white border-zinc-800"
                                }`}>
                                  {idx + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider leading-none mb-1">
                                    Gatilho {idx + 1}
                                  </div>
                                  <div className="font-display font-black text-xs sm:text-sm text-white group-hover:text-white truncate leading-snug">
                                    "{q.phrase}"
                                  </div>
                                </div>
                              </div>

                              <span className="shrink-0 text-[9px] font-mono font-bold uppercase px-2.5 py-1.5 rounded bg-black border border-zinc-800 text-zinc-300 flex items-center gap-1 group-hover:border-white group-hover:text-white whitespace-nowrap leading-none">
                                <Play className="w-2.5 h-2.5 fill-current text-white shrink-0" />
                                <span className="whitespace-nowrap leading-none">Assistir</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Painel de Voz & Interação (Ocultado automaticamente após encerrar com "Tchau" ou no Grupo 5 Vídeo Completo) */}
              {!hidePanels && !isFullscreen && !presentationEnded && !isFullVideoGroup && (
                <div 
                  className="backdrop-blur-md border-3 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col md:flex-row gap-6 items-stretch transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.bgSurface,
                    borderColor: currentTheme.colors.borderSubtle,
                    boxShadow: `6px 6px 0px 0px rgba(0,0,0,1), 0 0 25px ${currentTheme.colors.glow}`
                  }}
                >
                  {/* Speaking Control Badge */}
                  <div 
                    className="border-2 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 min-w-[220px] shrink-0"
                    style={{
                      backgroundColor: currentTheme.colors.bgCard,
                      borderColor: currentTheme.colors.borderSubtle
                    }}
                  >
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-3 cursor-pointer ${
                        isListening || isRecordingMedia
                          ? "bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.6)] animate-pulse border-white"
                          : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[3px] active:shadow-none"
                      }`}
                      style={!(isListening || isRecordingMedia) ? {
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.primaryText,
                        borderColor: currentTheme.colors.borderMain
                      } : undefined}
                      title={isListening || isRecordingMedia ? "Desativar escuta de voz" : "Ativar microfone para ouvir"}
                    >
                      {isListening || isRecordingMedia ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    <div className="space-y-1 w-full">
                      {isTranscribing ? (
                        <div className="flex flex-col items-center gap-1.5 py-1">
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                          <span className="text-[10px] font-mono font-bold text-white uppercase animate-pulse">
                            Transcrevendo áudio...
                          </span>
                        </div>
                      ) : isListening || isRecordingMedia ? (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider block animate-pulse">
                            {isRecordingMedia ? `GRAVANDO VOZ (${recordingDuration}s)` : "ESCUTA ATIVA..."}
                          </span>
                          <div className="flex items-end justify-center gap-1.5 h-6 pt-1">
                            <div className="w-1.5 bg-red-400 rounded-full transition-all duration-75" style={{ height: `${Math.max(6, Math.min(24, Math.round(audioLevel * 0.25)))}px` }} />
                            <div className="w-1.5 bg-white rounded-full border border-black transition-all duration-75" style={{ height: `${Math.max(10, Math.min(24, Math.round(audioLevel * 0.4)))}px` }} />
                            <div className="w-1.5 bg-white rounded-full border border-black transition-all duration-75" style={{ height: `${Math.max(8, Math.min(24, Math.round(audioLevel * 0.35)))}px` }} />
                            <div className="w-1.5 bg-red-400 rounded-full transition-all duration-75" style={{ height: `${Math.max(6, Math.min(24, Math.round(audioLevel * 0.2)))}px` }} />
                          </div>
                        </div>
                      ) : isAnalyzing ? (
                        <span className="text-xs font-bold text-zinc-300 animate-pulse block">
                          Analisando comando...
                        </span>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-xs font-bold block" style={{ color: currentTheme.colors.textSecondary }}>
                            Fale no microfone
                          </span>
                          <div 
                            className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-md whitespace-nowrap leading-none border"
                            style={{
                              backgroundColor: currentTheme.colors.bgApp,
                              borderColor: currentTheme.colors.borderSubtle
                            }}
                          >
                            <span className={`w-2 h-2 rounded-full border border-black/25 shrink-0 ${micPermission === "granted" ? "bg-white" : micPermission === "denied" ? "bg-red-500" : "bg-amber-400"}`} />
                            <span className="font-bold text-[9px] whitespace-nowrap leading-none" style={{ color: currentTheme.colors.textMuted }}>
                              {micPermission === "granted" ? "MICROFONE PRONTO" : micPermission === "denied" ? "MICROFONE BLOQUEADO" : "FALAR NO MICROFONE"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {speechError && (
                      <div className="w-full p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-[10px] text-red-300 font-mono space-y-1.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-red-400 font-bold whitespace-nowrap leading-none">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap leading-none">Aviso de Microfone</span>
                        </div>
                        <p className="leading-tight text-[9px]">{speechError}</p>
                        <button
                          type="button"
                          onClick={requestMicrophonePermission}
                          className="w-full mt-1 py-1.5 px-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[9px] uppercase tracking-wide cursor-pointer transition-colors shadow-sm whitespace-nowrap leading-none"
                        >
                          Habilitar Microfone
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Speech transcript & manual fallback */}
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div 
                      className="border-2 rounded-2xl p-5 text-xs flex-1 flex flex-col justify-center"
                      style={{
                        backgroundColor: currentTheme.colors.bgCard,
                        borderColor: currentTheme.colors.borderSubtle
                      }}
                    >
                      <div>
                        <span className="text-[9px] font-mono block uppercase font-bold tracking-wider mb-2" style={{ color: currentTheme.colors.textMuted }}>
                          {isListening ? "Transcrição em Tempo Real:" : "Retorno do Sistema:"}
                        </span>
                        <p 
                          className={`font-display font-extrabold italic text-sm mt-0.5 transition-all ${isListening ? "bg-black/30 border border-dashed px-3 py-2 rounded animate-pulse" : ""}`}
                          style={{
                            color: currentTheme.colors.textPrimary,
                            borderColor: currentTheme.colors.borderSubtle
                          }}
                        >
                          {isListening 
                            ? (realtimeSpeech ? `"${realtimeSpeech}"` : `Ouvindo atentamente... fale um dos ${effectiveQuestions.length} gatilhos`) 
                            : (lastSpeechDetected ? `"${lastSpeechDetected}" — ${aiResponseText}` : aiResponseText)
                          }
                        </p>
                      </div>
                    </div>

                    {/* Backup input bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleIncomingCommand(inputText);
                      }}
                      className="relative"
                    >
                      <input
                        type="text"
                        className="w-full border-2 focus:ring-0 rounded-xl pl-3.5 pr-11 py-2.5 text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] focus:outline-none transition-all"
                        style={{
                          backgroundColor: currentTheme.colors.bgInput,
                          borderColor: currentTheme.colors.borderSubtle,
                          color: currentTheme.colors.textPrimary
                        }}
                        placeholder={`Digite exatamente um dos ${effectiveQuestions.length} gatilhos do grupo...`}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isAnalyzing}
                      />
                      <button
                        type="submit"
                        disabled={isAnalyzing || !inputText.trim()}
                        className="absolute right-1.5 top-1.5 w-7.5 h-7.5 rounded border transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-40"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.primaryText,
                          borderColor: currentTheme.colors.borderMain
                        }}
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>

            {/* Minimalist Configuration Action Bar */}
            {!hidePanels && !isFullscreen && (
              <div className="bg-zinc-900/20 backdrop-blur-md rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-zinc-800/80 gap-4 text-left max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-950 border border-zinc-800 text-[10px] h-6 px-2.5 rounded-lg font-mono text-zinc-400 font-bold flex items-center shrink-0">
                    SISTEMA ATIVO
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-none font-mono">
                    Gatilhos de voz sintonizados e prontos para interação.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("settings")}
                  className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 font-mono text-[10px] font-bold text-white hover:border-white/35 transition-all cursor-pointer shadow-sm flex items-center gap-2 uppercase tracking-wider"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar Canais</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: AJUSTES DA CENTRAL (Optimized, Simplified and Professional Settings Tab) */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fade-in">
            
            <div 
              className="border-3 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-6 transition-all duration-300"
              style={{
                backgroundColor: currentTheme.colors.bgSurface,
                borderColor: currentTheme.colors.borderSubtle,
                boxShadow: `6px 6px 0px 0px rgba(0,0,0,1), 0 0 25px ${currentTheme.colors.glow}`,
                color: currentTheme.colors.textPrimary
              }}
            >
              
              {/* Header section with clean typography & solid controls */}
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
                style={{ borderColor: currentTheme.colors.borderSubtle }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[9px] font-mono font-bold border px-2 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.primaryText,
                        borderColor: currentTheme.colors.borderMain
                      }}
                    >
                      Painel do Operador
                    </span>
                    <span 
                      className="text-[9px] font-mono font-bold border px-2 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: currentTheme.colors.bgCard,
                        color: currentTheme.colors.textMuted,
                        borderColor: currentTheme.colors.borderSubtle
                      }}
                    >
                      v2.6 • {currentTheme.name}
                    </span>
                  </div>
                  <h2 
                    className="text-sm font-display font-black uppercase tracking-wider mt-1.5"
                    style={{ color: currentTheme.colors.textPrimary }}
                  >
                    Configuração de Canais, Voz e Visual
                  </h2>
                  <p 
                    className="text-[11px] mt-0.5 font-mono"
                    style={{ color: currentTheme.colors.textMuted }}
                  >
                    Gerencie a identidade visual, transmissão e comandos falados dos canais de vídeo.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSaveAllData}
                    className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer shadow-sm font-mono uppercase"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.primaryText,
                      borderColor: currentTheme.colors.borderMain
                    }}
                    title="Salvar todos os dados do app agora"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Dados</span>
                  </button>

                  <button
                    onClick={resetAllTriggers}
                    className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer shadow-sm font-mono uppercase"
                    style={{
                      backgroundColor: currentTheme.colors.bgCard,
                      color: currentTheme.colors.textSecondary,
                      borderColor: currentTheme.colors.borderSubtle
                    }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Redefinir</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("chat")}
                    className="flex items-center gap-1.5 text-[10px] font-black px-4 py-2 rounded-lg transition-all cursor-pointer uppercase font-mono tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.primaryText,
                      borderColor: currentTheme.colors.borderMain
                    }}
                  >
                    <span>Concluído</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* NOVA SEÇÃO: APARÊNCIA DO APLICATIVO (5 TEMAS: Amazônia, Taiga, Caatinga, Bambuçal, Manguezal) */}
              <section 
                aria-label="Aparência do Aplicativo"
                className="rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300"
                style={{
                  backgroundColor: currentTheme.colors.bgCard,
                  borderColor: currentTheme.colors.borderSubtle,
                  boxShadow: `0 4px 20px ${currentTheme.colors.glow}`
                }}
              >
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-4"
                  style={{ borderColor: currentTheme.colors.borderSubtle }}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.primaryText,
                        borderColor: currentTheme.colors.borderMain
                      }}
                    >
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 
                          className="text-xs sm:text-sm font-display font-black uppercase tracking-wider"
                          style={{ color: currentTheme.colors.textPrimary }}
                        >
                          APARÊNCIA DO APLICATIVO
                        </h3>
                        <span 
                          className="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1"
                          style={{
                            backgroundColor: currentTheme.colors.bgApp,
                            borderColor: currentTheme.colors.borderMain,
                            color: currentTheme.colors.primary
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentTheme.colors.primary }} />
                          {currentTheme.name} Ativo
                        </span>
                      </div>
                      <p 
                        className="text-[10px] sm:text-[11px] font-mono mt-0.5"
                        style={{ color: currentTheme.colors.textMuted }}
                      >
                        Personalize o template visual do aplicativo selecionando um dos 5 biomas temáticos. A mudança é instantânea e preserva reproduções ativas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span 
                      className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: currentTheme.colors.bgElevated,
                        color: currentTheme.colors.textMuted,
                        borderColor: currentTheme.colors.borderSubtle
                      }}
                    >
                      5 Temas Disponíveis
                    </span>
                  </div>
                </div>

                {/* Grid dos 5 Temas com Cenários Inteligentes, Fauna e IoT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {THEME_LIST.map((th) => {
                    const isCurrent = selectedThemeId === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => handleSelectTheme(th.id)}
                        className={`group relative text-left rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden ${
                          isCurrent 
                            ? "ring-2 scale-[1.02] shadow-xl" 
                            : "hover:scale-[1.01] hover:brightness-110 active:scale-98"
                        }`}
                        style={{
                          backgroundColor: isCurrent ? th.colors.bgElevated : th.colors.bgSurface,
                          borderColor: isCurrent ? th.colors.borderMain : th.colors.borderSubtle,
                          boxShadow: isCurrent ? `0 0 22px ${th.glowColor}` : "none",
                          // @ts-ignore
                          "--tw-ring-color": th.colors.primary
                        }}
                        title={`Ativar ${th.name} (${th.environmentTitle})`}
                      >
                        {/* Biome Image Thumbnail Banner */}
                        <div className="relative h-24 w-full overflow-hidden border-b" style={{ borderColor: th.colors.borderSubtle }}>
                          <img 
                            src={th.bgImage} 
                            alt={th.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                          
                          {/* Top Icon and Active Badge */}
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1.5">
                            <div 
                              className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 backdrop-blur-sm"
                              style={{
                                backgroundColor: th.colors.primary,
                                color: th.colors.primaryText,
                                borderColor: th.colors.borderMain
                              }}
                            >
                              {renderThemeIcon(th.iconName, "w-4 h-4")}
                            </div>

                            {isCurrent ? (
                              <span 
                                className="inline-flex items-center gap-1 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full border shadow-md"
                                style={{
                                  backgroundColor: th.colors.primary,
                                  color: th.colors.primaryText,
                                  borderColor: th.colors.borderMain
                                }}
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                ATIVO
                              </span>
                            ) : (
                              <span 
                                className="text-[7.5px] font-mono uppercase px-1.5 py-0.5 rounded border bg-black/60 text-zinc-300 border-white/20 backdrop-blur-sm group-hover:bg-black/90 transition-all"
                              >
                                Selecionar
                              </span>
                            )}
                          </div>

                          {/* Biome Name on Banner */}
                          <div className="absolute bottom-1.5 left-2.5 right-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display font-black text-sm text-white tracking-wide drop-shadow-sm truncate">
                                {th.name}
                              </span>
                              {isCurrent && (
                                <span 
                                  className="w-1.5 h-1.5 rounded-full animate-ping"
                                  style={{ backgroundColor: th.colors.primary }}
                                />
                              )}
                            </div>
                            <span className="text-[8.5px] font-mono font-semibold text-emerald-300 drop-shadow-sm truncate block" style={{ color: th.colors.accent }}>
                              {th.environmentTitle}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                          {/* Biome classification & colors description */}
                          <div className="space-y-1.5">
                            <p 
                              className="text-[9px] font-mono leading-tight truncate"
                              style={{ color: th.colors.textMuted }}
                              title={th.biome}
                            >
                              {th.biome}
                            </p>

                            {/* Fauna preview badges */}
                            <div 
                              className="p-1.5 rounded-lg border text-[8px] font-mono space-y-0.5"
                              style={{
                                backgroundColor: th.colors.bgCard,
                                borderColor: th.colors.borderSubtle
                              }}
                            >
                              <div className="flex items-center gap-1 font-bold" style={{ color: th.colors.textPrimary }}>
                                <span>🐾</span>
                                <span className="uppercase tracking-wider">Fauna (5):</span>
                              </div>
                              <p className="truncate text-zinc-300" style={{ color: th.colors.textSecondary }}>
                                {th.animals.map(a => a.name).join(", ")}
                              </p>
                            </div>

                            {/* Smart IoT devices preview badges */}
                            <div 
                              className="p-1.5 rounded-lg border text-[8px] font-mono space-y-0.5"
                              style={{
                                backgroundColor: th.colors.bgCard,
                                borderColor: th.colors.borderSubtle
                              }}
                            >
                              <div className="flex items-center gap-1 font-bold" style={{ color: th.colors.textPrimary }}>
                                <span>📡</span>
                                <span className="uppercase tracking-wider">IoT & Sensores (5):</span>
                              </div>
                              <p className="truncate text-zinc-300" style={{ color: th.colors.textSecondary }}>
                                {th.smartDevices.map(d => d.name).slice(0, 3).join(", ")}...
                              </p>
                            </div>
                          </div>

                          {/* Bottom Swatches Preview */}
                          <div 
                            className="pt-2 border-t flex items-center justify-between gap-1.5"
                            style={{ borderColor: th.colors.borderSubtle }}
                          >
                            <div className="flex items-center gap-1">
                              {th.swatches.map((color, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-black/50 shadow-xs transition-transform group-hover:scale-110"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                            <span 
                              className="text-[8px] font-mono font-bold uppercase tracking-wider"
                              style={{ color: th.colors.primary }}
                            >
                              {isCurrent ? "Tema Atual" : "Toque"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 12-Column Grid Layout for Settings Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: System & Intro Flow (Col Span: 4) */}
                <div className="lg:col-span-4 space-y-5">
                  
                  {/* Card 1: Intro Video config */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-white" />
                          Intro • {currentGroup.name}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded font-extrabold font-mono border bg-zinc-800 text-zinc-200 border-zinc-700 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>FIXO (5 TEMAS)</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal mt-2 font-mono">
                        Vídeo de introdução do grupo <strong>{currentGroup.name}</strong> ({currentGroup.integrantes.join(", ")}). Fixado no código em <code className="text-white">groupsConfig.ts</code> e disponível nos 5 temas.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {/* URL Input */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold flex items-center justify-between">
                          <span>URL da Introdução:</span>
                          <span className="text-[8px] text-zinc-300 font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Protegido
                          </span>
                        </label>
                        <input
                          type="text"
                          value={effectiveIntroUrl}
                          readOnly
                          className="w-full rounded-lg px-2.5 py-1.5 text-[10px] font-mono focus:outline-none bg-zinc-950/90 border border-zinc-850 text-zinc-300 cursor-not-allowed select-all"
                        />
                      </div>

                      <div className="p-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-[9px] font-mono text-zinc-300 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>Apresentação centralizada. A troca de tema modifica apenas a identidade visual.</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (effectiveIntroUrl) {
                            triggerVideoSlot(isFullVideoGroup ? "full_video" : "intro");
                            setActiveTab("chat");
                          }
                        }}
                        disabled={!effectiveIntroUrl}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer font-bold font-mono text-[9px] uppercase shadow-sm"
                      >
                        {isFullVideoGroup ? "Visualizar Vídeo Completo" : "Visualizar Intro"}
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Plano de Fundo do Bioma Ativo */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-white" />
                          Cenário: {currentTheme.name}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold font-mono border ${
                          showBgImage 
                            ? "bg-zinc-800 text-white border-zinc-800" 
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}>
                          {showBgImage ? "ATIVO" : "INATIVO"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal mt-2 font-mono">
                        Cenário do bioma ativo: <strong className="text-white">{currentTheme.name} ({currentTheme.environmentTitle})</strong>. Paisagem imersiva com fauna nativa e dispositivos de monitoramento IoT integrados.
                      </p>
                    </div>

                    {/* Preview Image with overlay effect */}
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 h-28 group">
                      <img 
                        src={currentTheme.bgImage || "/assets/images/amazonia_smart.jpg"} 
                        alt={`Miniatura ${currentTheme.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2 justify-between">
                        <span className="text-[9px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
                          {currentTheme.name} • {currentTheme.environmentTitle}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
                          {bgOpacity}% Opacidade
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-3 pt-1">
                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setShowBgImage(prev => !prev)}
                        className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono font-bold text-[10px] uppercase transition-all cursor-pointer border ${
                          showBgImage
                            ? "bg-white/10 text-white border-zinc-700 hover:bg-white/25"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{showBgImage ? "Ocultar Fundo" : "Ativar Fundo"}</span>
                      </button>

                      {/* Opacity Range Slider */}
                      {showBgImage && (
                        <div className="space-y-1.5 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-zinc-400">Transparência / Opacidade:</span>
                            <span className="text-white font-bold">{bgOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="85"
                            step="5"
                            value={bgOpacity}
                            onChange={(e) => setBgOpacity(Number(e.target.value))}
                            className="w-full accent-white cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                            <span>Mais Transparente (10%)</span>
                            <span>Recomendado (35%)</span>
                            <span>Mais Vívido (85%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Otimização de Enquadramento do Vídeo */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-white" />
                          Enquadramento do Vídeo
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded font-extrabold font-mono border bg-zinc-800 text-white border-zinc-700">
                          AJUSTADO (FIT)
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-2 font-mono">
                        Vídeo ajustado integralmente ao container (object-fit: contain), preservando a proporção original 16:9 sem cortes ou ampliações.
                      </p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* Encaixe de Vídeo */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold block">
                          Formato de Exibição Ativo:
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoFit("contain");
                              safeStorage.setItem("eco_video_fit", "contain");
                              showSaveSuccess("Modo Ajustado ativo: proporção original preservada");
                            }}
                            className="px-2.5 py-2.5 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer border flex items-center justify-center gap-2 text-center bg-white/10 text-white border-white shadow-sm"
                          >
                            <Tv className="w-3.5 h-3.5 text-white" />
                            <span>Ajustado ao Container (object-fit: contain)</span>
                          </button>
                        </div>
                      </div>

                      {/* Auto Fullscreen on Start Toggle */}
                      <div className="flex items-center justify-between p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-900">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-300 block">
                            Tela Cheia ao Iniciar no Mobile
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 block">
                            Abre o reprodutor em tela cheia automaticamente no celular
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMobileFullscreenAuto(prev => !prev)}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border border-zinc-800 shrink-0 ${
                            mobileFullscreenAuto ? "bg-white" : "bg-zinc-800"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-black block absolute top-0.5 transition-transform ${
                              mobileFullscreenAuto ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Test Fullscreen */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("chat");
                          setTimeout(() => {
                            toggleFullscreen();
                          }, 100);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 rounded-lg font-mono font-bold text-[9px] uppercase transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Maximize className="w-3.5 h-3.5 text-white" />
                        <span>Visualizar em Tela Cheia</span>
                      </button>
                    </div>
                  </div>

                  {/* Card: Ajuste de Qualidade Inicial do Vídeo (1080p, 720p, 480p, etc.) */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-white" />
                          Qualidade Inicial do Vídeo
                        </span>
                        <span className="text-[8px] px-2 py-0.5 rounded font-extrabold font-mono border bg-white/10 text-white border-zinc-700 uppercase">
                          {preferredVideoQuality === "hd1080" ? "1080p FHD" :
                           preferredVideoQuality === "hd720" ? "720p HD" :
                           preferredVideoQuality === "large" ? "480p SD" :
                           preferredVideoQuality === "medium" ? "360p" : "AUTOMÁTICO"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-2 font-mono">
                        Escolha em qual resolução os vídeos devem começar automaticamente ao reproduzir os gatilhos ou apresentação (1080p, 720p, etc.).
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold block">
                          Resolução Padrão de Início:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: "hd1080", label: "1080p", badge: "Full HD", desc: "Máxima Nitidez" },
                            { id: "hd720", label: "720p", badge: "HD", desc: "Equilibrado" },
                            { id: "large", label: "480p", badge: "SD", desc: "Mais Leve" },
                            { id: "medium", label: "360p", badge: "Econômico", desc: "Pouca Banda" },
                            { id: "auto", label: "Auto", badge: "Dinâmico", desc: "Adaptativo" },
                          ].map((item) => {
                            const isSelected = preferredVideoQuality === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setPreferredVideoQuality(item.id as VideoQualityPreference);
                                  triggerQualityAutoPulse(item.id as VideoQualityPreference);
                                  setYtReloadKey(prev => prev + 1);
                                }}
                                className={`px-2.5 py-2 rounded-xl font-mono flex flex-col items-start gap-1 transition-all cursor-pointer border text-left whitespace-nowrap ${
                                  isSelected
                                    ? "bg-white/15 text-white border-white shadow-[0_0_12px_rgba(255, 255, 255, 0.15)]"
                                    : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full gap-1">
                                  <span className="text-[12px] font-black leading-none whitespace-nowrap">{item.label}</span>
                                  <span className={`text-[7.5px] px-1 py-0.5 rounded font-extrabold uppercase whitespace-nowrap leading-none ${isSelected ? "bg-white text-black" : "bg-zinc-900 text-zinc-500"}`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <span className={`text-[8px] whitespace-nowrap leading-none ${isSelected ? "text-zinc-200" : "text-zinc-500"}`}>
                                  {item.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-900 text-[9px] font-mono text-zinc-400 space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="font-bold text-white text-[9.5px]">
                            {preferredVideoQuality === "hd1080" && "1080p (Full HD): Máxima qualidade visual de alta definição."}
                            {preferredVideoQuality === "hd720" && "720p (HD): Alta definição com menor consumo de dados."}
                            {preferredVideoQuality === "large" && "480p (SD): Reprodução suave, indicada para conexões intermediárias."}
                            {preferredVideoQuality === "medium" && "360p: Carregamento instantâneo para conexões 3G/4G oscilantes."}
                            {preferredVideoQuality === "auto" && "Automático: O YouTube ajusta a resolução de acordo com a banda da rede."}
                          </span>
                        </div>
                        <p className="text-[8px] text-zinc-500 leading-tight">
                          O sistema ASSISTENTES DA NATUREZA enviará os comandos de taxa e resolução inicial para manter a qualidade selecionada desde o primeiro segundo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card: Extensão Trava 1080p Only (Injetor & Interceptador de Resolução) */}
                  <div className="bg-gradient-to-br from-zinc-900/60 via-zinc-900/30 to-white/5 border border-zinc-700 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left shadow-[0_0_20px_rgba(255,255,255,0.06)]">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                        <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-white" />
                          Extensão: Trava 1080p Exclusiva
                        </span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black font-mono border uppercase tracking-wider flex items-center gap-1 ${
                          force1080pOnly
                            ? "bg-white/15 text-white border-zinc-700 shadow-[0_0_8px_rgba(255, 255, 255, 0.15)]"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}>
                          <Lock className="w-2.5 h-2.5" />
                          {force1080pOnly ? "EXTENSÃO ATIVA" : "EXTENSÃO PAUSADA"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-2 font-mono">
                        Módulo de extensão integrado que intercepta a API do YouTube Player e injeta parâmetros de alta definição (<code className="text-white bg-black/50 px-1 py-0.5 rounded">fmt=22</code>, <code className="text-white bg-black/50 px-1 py-0.5 rounded">vq=hd1080</code>) para impedir que o player caia para 360p/480p.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Toggle Extensão */}
                      <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-zinc-800">
                        <div className="space-y-0.5 pr-2">
                          <div className="text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-white" />
                            Forçar Apenas 1080p (Full HD Lock)
                          </div>
                          <div className="text-[8.5px] font-mono text-zinc-400">
                            Bloqueia resoluções inferiores e repete o comando HD continuamente durante o vídeo
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = !force1080pOnly;
                            setForce1080pOnly(next);
                            if (next) {
                              setPreferredVideoQuality("hd1080");
                              triggerQualityAutoPulse("hd1080");
                              setYtReloadKey(k => k + 1);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer whitespace-nowrap leading-none border shrink-0 ${
                            force1080pOnly
                              ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255, 255, 255, 0.2)]"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                          }`}
                        >
                          {force1080pOnly ? "ATIVADO" : "DESATIVADO"}
                        </button>
                      </div>

                      {/* Botão de Disparo Imediato e Detalhes da Extensão */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreferredVideoQuality("hd1080");
                            triggerQualityAutoPulse("hd1080");
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-white/60 hover:text-white text-zinc-300 font-mono text-[9.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap leading-none shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span>Pulsar Trava 1080p Agora</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const rawUrl = effectiveIntroUrl;
                            const cleanId = getYouTubeVideoId(rawUrl) || "";
                            const hdUrl = cleanId ? `https://www.youtube.com/watch?v=${cleanId}&vq=hd1080&fmt=22` : rawUrl;
                            navigator.clipboard?.writeText(hdUrl);
                            triggerQualityAutoPulse("hd1080");
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-[9.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap leading-none shadow-sm"
                          title="Copia link direto formatado com flags 1080p e fmt=22"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                          <span>Copiar URL Direta 1080p</span>
                        </button>
                      </div>

                      {/* Diagnóstico da Extensão */}
                      <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-900 text-[8.5px] font-mono text-zinc-400 space-y-1.5">
                        <div className="flex items-center justify-between text-zinc-300 font-bold border-b border-zinc-850 pb-1">
                          <span className="flex items-center gap-1.5 text-white">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            Parâmetros da Extensão Ativos no Iframe:
                          </span>
                          <span className="text-[7.5px] text-zinc-500 font-mono">Loop 1.2s Ativo</span>
                        </div>
                        <p className="text-zinc-400 leading-tight">
                          • <span className="text-zinc-200">vq=hd1080</span> & <span className="text-zinc-200">hd=1</span>: Notificam o YouTube a selecionar o stream Full HD de 1080 linhas.<br />
                          • <span className="text-zinc-200">fmt=22</span>: Força o container MP4 1080p/720p direto do servidor do Google.<br />
                          • <span className="text-zinc-200">setPlaybackQualityRange</span>: Limita o range mínimo para 1080p impedindo fallback automático.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Diagnóstico & Habilitação do Microfone (Mobile & Desktop) */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between text-left gap-3">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-white" />
                        Microfone no Celular (Mobile)
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold border ${
                        micPermission === "granted"
                          ? "bg-white/10 text-white border-zinc-700"
                          : micPermission === "denied"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}>
                        {micPermission === "granted" ? "LIBERADO" : micPermission === "denied" ? "BLOQUEADO" : "PENDENTE"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Permission status & action button */}
                      <div className="p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-400">Status de Permissão:</span>
                          <span className="text-[9px] font-mono font-bold text-zinc-200">
                            {micPermission === "granted" 
                              ? "Acesso Permitido" 
                              : micPermission === "denied"
                              ? "Bloqueado pelo Navegador"
                              : "Não Solicitado / Pendente"}
                          </span>
                        </div>

                        {/* Test / Enable Button */}
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await requestMicrophonePermission();
                            if (ok) {
                              setSpeechError("");
                            }
                          }}
                          className={`w-full py-2 px-3 rounded-lg font-mono font-black text-[9px] uppercase tracking-wide flex items-center justify-center gap-1.5 border transition-all cursor-pointer shadow-sm active:scale-95 ${
                            micPermission === "granted"
                              ? "bg-white/15 text-white border-zinc-700 hover:bg-white hover:text-black"
                              : "bg-white text-black border-black hover:bg-white/90"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{micPermission === "granted" ? "Testar Microfone Novamente" : "Habilitar Microfone no Celular"}</span>
                        </button>
                      </div>

                      {/* Live Audio Level Bar (when listening or testing) */}
                      {(isListening || isRecordingMedia || audioLevel > 0) && (
                        <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                          <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                            <span>Sinal do Microfone:</span>
                            <span className="text-white font-bold">{audioLevel}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                            <div 
                              className="bg-white h-full transition-all duration-75"
                              style={{ width: `${audioLevel}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Engine Selector */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-zinc-400 block">
                          Motor de Reconhecimento:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setPreferredSpeechEngine("auto")}
                            className={`py-1.5 px-1 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer border text-center ${
                              preferredSpeechEngine === "auto"
                                ? "bg-white/10 text-white border-white"
                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
                            }`}
                          >
                            Auto (Mobile)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreferredSpeechEngine("gemini")}
                            className={`py-1.5 px-1 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer border text-center ${
                              preferredSpeechEngine === "gemini"
                                ? "bg-white/10 text-white border-white"
                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
                            }`}
                          >
                            IA Gemini
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreferredSpeechEngine("native")}
                            className={`py-1.5 px-1 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer border text-center ${
                              preferredSpeechEngine === "native"
                                ? "bg-white/10 text-white border-white"
                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
                            }`}
                          >
                            Nativo Web
                          </button>
                        </div>
                      </div>

                      {/* Help button for blocked permissions */}
                      <button
                        type="button"
                        onClick={() => setShowMicModal(true)}
                        className="w-full text-center text-[8px] font-mono text-zinc-400 hover:text-white underline cursor-pointer py-0.5"
                      >
                        O microfone não funciona? Ver instruções de desbloqueio
                      </button>
                    </div>
                  </div>

                  {/* Card: Salvar e Backup de Todos os Dados (Request #10) */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between text-left gap-3.5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                      <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                        <Save className="w-3.5 h-3.5 text-white" />
                        Salvar e Backup de Dados
                      </span>
                      <span className="text-[8px] font-mono bg-white text-black px-2 py-0.5 rounded font-black border border-white uppercase">
                        SEGURO
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-400 leading-normal font-mono">
                      Salve todas as perguntas configuradas, vídeos, sugestões e preferências no navegador ou exporte um arquivo de backup para restaurar quando quiser.
                    </p>

                    <div className="space-y-2">
                      {/* Botão Salvar Agora */}
                      <button
                        type="button"
                        onClick={handleSaveAllData}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-black hover:bg-zinc-200 border border-white rounded-xl font-mono text-[10px] font-black uppercase transition-all cursor-pointer shadow-sm active:scale-98"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Todos os Dados Agora</span>
                      </button>

                      {/* Botões Exportar e Importar Backup */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleExportBackup}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-700 hover:border-zinc-500 rounded-xl font-mono text-[9px] font-bold uppercase transition-all cursor-pointer"
                          title="Baixar arquivo JSON com todas as configurações"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Exportar (.JSON)</span>
                        </button>

                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-700 hover:border-zinc-500 rounded-xl font-mono text-[9px] font-bold uppercase transition-all cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Importar Backup</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImportBackup(file);
                            }}
                          />
                        </label>
                      </div>

                      {/* Resumo do Armazenamento */}
                      <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850 text-[9px] font-mono text-zinc-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Gatilhos do Grupo:</span>
                          <strong className="text-white">{effectiveQuestions.length} gatilhos</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Grupo Ativo:</span>
                          <strong className="text-white truncate max-w-[160px]">{currentGroup.name}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Apresentação (Intro):</span>
                          <strong className="text-white">{effectiveIntroUrl ? "Configurada" : "Pendente"}</strong>
                        </div>
                        <div className="flex justify-between border-t border-zinc-800 pt-1 mt-1 text-[8.5px]">
                          <span>Status do Navegador:</span>
                          <span className="text-white font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Auto-salvamento Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Voice Triggers Grid (Col Span: 8) */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Card: Seletor de Grupo de Apresentação no Painel */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 text-left shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-white" />
                        <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                          5 Grupos Oficiais Centralizados (5 Temas)
                        </span>
                      </div>
                      <span className="text-[8px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>groupsConfig.ts</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {ALL_GROUPS_LIST.map((grp) => {
                        const isGroupActive = currentGroup.id === grp.id;
                        return (
                          <button
                            key={grp.id}
                            type="button"
                            onClick={() => handleSelectGroup(grp.id, false)}
                            className={`px-3 py-2 rounded-xl font-mono text-[10px] font-black uppercase border transition-all cursor-pointer flex items-center gap-2 ${
                              isGroupActive 
                                ? "bg-white text-black border-white shadow-md ring-2 ring-white/50" 
                                : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-white hover:border-zinc-500"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isGroupActive ? "bg-black animate-pulse" : "bg-zinc-500"}`} />
                            <span>{grp.name}</span>
                            <span className="text-[8px] opacity-75">
                              ({grp.presentationType === "full_video" ? "Vídeo Único" : `${grp.triggers.length + 1} Vídeos`})
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-white font-bold text-[11px]">
                          Grupo Selecionado: {currentGroup.name}
                        </div>
                        <div className="text-[9px] text-zinc-400">
                          Integrantes: <span className="text-zinc-200">{currentGroup.integrantes.join(", ")}</span> • Tema de Referência: <span className="text-zinc-200">{currentGroup.temaReferenciaNome}</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 uppercase whitespace-nowrap self-start sm:self-auto">
                        Disponível nos 5 Temas
                      </span>
                    </div>
                  </div>

                  {/* Mini control bar */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-white" />
                        {isFullVideoGroup
                          ? `Vídeo Completo: ${currentGroup.name}`
                          : `Gatilhos do Grupo: ${currentGroup.name} (${effectiveQuestions.length})`}
                      </span>
                      <span className="text-[8px] bg-zinc-800 text-zinc-200 border border-zinc-700 px-2 py-0.5 rounded font-black font-mono uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{isFullVideoGroup ? "Sem Gatilhos (Vídeo Único)" : `${effectiveQuestions.length} Gatilhos Fixos`}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-300 flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>
                      As frases ativadoras e URLs do grupo <strong>{currentGroup.name}</strong> estão centralizadas no arquivo <code className="text-white">groupsConfig.ts</code> e protegidas contra alterações no painel.
                    </span>
                  </div>

                  {/* Elegant Cards Grid (or Full Video Card for Group 5) */}
                  {isFullVideoGroup ? (
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 text-left">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                        <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-white" />
                          Apresentação Completa em Vídeo Único
                        </span>
                        <span className="text-[8px] bg-zinc-800 text-zinc-200 border border-zinc-700 px-2 py-0.5 rounded font-black font-mono uppercase">
                          CAATINGA · VÍDEO ÚNICO
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-300 leading-relaxed">
                        O grupo <strong>{currentGroup.name}</strong> utiliza apresentação contínua sem gatilhos de voz. Ao término do vídeo, o usuário escolhe entre <strong>ASSISTIR NOVAMENTE</strong> ou <strong>FAZER QUIZ DA CAATINGA</strong>.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            triggerVideoSlot("full_video");
                            setActiveTab("chat");
                          }}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Testar Vídeo Completo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEcosystemQuiz("caatinga")}
                          className="px-4 py-2 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer flex items-center gap-1.5"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.primaryText,
                            borderColor: currentTheme.colors.borderMain
                          }}
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Abrir Quiz da Caatinga</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                      {effectiveQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-3 text-left transition-all duration-200"
                        >
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                              Gatilho {idx + 1} • {currentGroup.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded font-black font-mono flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>FIXO</span>
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {/* Phrase input */}
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-mono font-bold flex items-center justify-between">
                                <span>Frase Ativadora:</span>
                                <span className="text-[8px] text-zinc-400 font-mono">Fixa</span>
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-bold font-mono focus:outline-none bg-zinc-950/90 border border-zinc-850 text-zinc-300 cursor-not-allowed select-all"
                                value={q.phrase}
                                readOnly
                              />
                            </div>

                            {/* URL Input (YouTube / Web) */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-mono font-bold">
                                <span>URL Fixa:</span>
                                {isYouTubeUrl(q.videoUrl) ? (
                                  <span className="text-[8px] bg-red-600/25 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-black">
                                    YOUTUBE
                                  </span>
                                ) : null}
                              </div>
                              <input
                                type="text"
                                className="w-full rounded-lg px-2.5 py-1.5 text-[10px] font-mono focus:outline-none bg-zinc-950/90 border border-zinc-850 text-zinc-400 cursor-not-allowed select-all"
                                value={q.videoUrl}
                                readOnly
                              />
                            </div>

                            {/* Trigger test button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (q.videoUrl) {
                                  triggerVideoSlot(q.id);
                                  setActiveTab("chat");
                                }
                              }}
                              disabled={!q.videoUrl}
                              className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-350 hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer font-bold font-mono text-[9px] uppercase shadow-sm"
                            >
                              Testar Gatilho no Reprodutor
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Quizzes Launcher in Settings */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 text-left">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-white" />
                        Quizzes dos 5 Ecossistemas (5.000 pts)
                      </span>
                      <span className="text-[8px] font-mono text-zinc-400 uppercase">5 Perguntas por Bioma</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ALL_QUIZZES_LIST.map((qz) => (
                        <button
                          key={qz.id}
                          type="button"
                          onClick={() => openEcosystemQuiz(qz.themeId)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 text-zinc-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer transition-all"
                        >
                          Quiz {qz.ecosystemName}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Clean Aesthetic Footer */}
      {!hidePanels && !isFullscreen && (
        <footer id="wit-footer" className="mt-auto py-6 border-t border-zinc-900 bg-black">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-400 gap-2">
            <span>ASSISTENTES DA NATUREZA • 9º A – OSMARINHO</span>
            <span>AMBIENTES INTELIGENTES • IoT • IA • MONITORAMENTO AMBIENTAL</span>
          </div>
        </footer>
      )}

      {/* Mode: Painel Oculto (Microfone + Gatilhos do Grupo Ativo ou Controles de Vídeo Completo) */}
      {hasEnteredApp && hasSelectedGroup && hidePanels && !isFullscreen && (
        <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3 sm:px-4 z-50 select-none pointer-events-auto animate-fade-in">
          <div className="bg-black/92 backdrop-blur-md border-2 border-white/80 rounded-2xl p-3 sm:p-4 shadow-[0_8px_35px_rgba(0,0,0,0.95)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {!presentationEnded && !isFullVideoGroup && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-black uppercase transition-all cursor-pointer border-2 shrink-0 ${
                      isListening || isRecordingMedia
                        ? "bg-red-600 text-white border-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                        : "bg-white text-black border-black hover:bg-zinc-200 shadow-sm active:scale-95"
                    }`}
                    title="Falar no Microfone"
                  >
                    {isListening || isRecordingMedia ? (
                      <>
                        <MicOff className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">{isRecordingMedia ? `Gravando (${recordingDuration}s)` : "Ouvindo..."}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">Falar no Microfone</span>
                      </>
                    )}
                  </button>
                )}

                {(isListening || realtimeSpeech) && !presentationEnded && !isFullVideoGroup && (
                  <div className="text-xs font-mono text-white/90 italic truncate bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-700 min-w-0 flex-1">
                    {realtimeSpeech ? `"${realtimeSpeech}"` : `Fale um dos ${effectiveQuestions.length} gatilhos...`}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEcosystemQuiz(isFullVideoGroup ? "caatinga" : selectedThemeId)}
                  className="px-2.5 py-1.5 font-mono text-[10px] font-black uppercase cursor-pointer flex items-center gap-1 rounded-lg border whitespace-nowrap"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.primaryText,
                    borderColor: currentTheme.colors.borderMain
                  }}
                >
                  <Trophy className="w-3.5 h-3.5 shrink-0" />
                  <span>{isFullVideoGroup ? "Quiz Caatinga" : "Quiz"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReplayVideo}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Rever Vídeo Atual"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rever</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHidePanels(false)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black text-white border border-zinc-700 hover:border-white rounded-lg text-[10px] font-mono font-black uppercase cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                  title="Mostrar Painel Completo"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Painel</span>
                </button>
              </div>
            </div>

            {!presentationEnded && !isFullVideoGroup && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1.5 border-t border-zinc-850">
                <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 whitespace-nowrap shrink-0">
                  Gatilhos:
                </span>
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {effectiveQuestions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => triggerVideoSlot(q.id)}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 hover:border-white text-zinc-200 text-[11px] font-mono font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-sm active:scale-95"
                    >
                      "{q.phrase}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Microphone Action Button (Apenas grupos com gatilhos, painel visível e apresentação ativa) */}
      {hasEnteredApp && hasSelectedGroup && activeTab === "chat" && !hidePanels && !isFullscreen && !presentationEnded && !isFullVideoGroup && (
        <div className="fixed bottom-6 right-6 z-[45] flex flex-col items-end gap-1.5 pointer-events-auto animate-fade-in">
          <div className="flex items-center gap-1.5 bg-black/95 border-2 border-white px-2.5 py-1 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[8px] font-mono font-bold uppercase transition-all duration-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isListening || isRecordingMedia ? "bg-red-500 animate-pulse" : "bg-white"}`} />
            <span className={isListening || isRecordingMedia ? "text-red-400 font-extrabold animate-pulse" : "text-white"}>
              {isListening || isRecordingMedia ? (isRecordingMedia ? `GRAVANDO ${recordingDuration}s` : "ESCUTA ATIVA") : "FALAR NO MICROFONE"}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-3 border-black cursor-pointer shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              isListening || isRecordingMedia
                ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.45)]"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
            title={isListening || isRecordingMedia ? "Desativar escuta de voz" : "Ativar microfone por voz"}
          >
            {isListening || isRecordingMedia ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 animate-pulse" />}
          </button>
        </div>
      )}

      {/* Mobile Microphone Permission Guide Modal */}
      {showMicModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border-3 border-black rounded-3xl w-full max-w-lg p-6 flex flex-col gap-4 text-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-white" />
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                  Como Habilitar o Microfone no Celular
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMicModal(false)}
                className="text-zinc-500 hover:text-white p-1 text-xs font-mono font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <p className="text-zinc-300 leading-relaxed">
                Para responder por voz aos vídeos da Assistente Virtual no celular, o navegador precisa da sua autorização para captar áudio:
              </p>

              {/* Android Instructions */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-white font-bold block uppercase text-[10px] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  No Android (Google Chrome):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[11px]">
                  <li>Toque no ícone de <strong>configurações de site</strong> (à esquerda da URL).</li>
                  <li>Toque em <strong>Permissões</strong> &gt; <strong>Microfone</strong>.</li>
                  <li>Marque como <strong>Permitir</strong>.</li>
                </ol>
              </div>

              {/* iPhone / Safari Instructions */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-white font-bold block uppercase text-[10px] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  No iPhone / iPad (Safari):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[11px]">
                  <li>Toque no botão <strong>aA</strong> na barra de endereços do Safari.</li>
                  <li>Selecione <strong>Ajustes do Site</strong>.</li>
                  <li>Em <strong>Microfone</strong>, escolha <strong>Permitir</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2.5 mt-2 border-t border-zinc-900 pt-3">
              <button
                type="button"
                onClick={() => setShowMicModal(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold uppercase rounded-lg border border-zinc-800 transition-all cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await requestMicrophonePermission();
                  if (ok) {
                    setShowMicModal(false);
                    setSpeechError("");
                  }
                }}
                className="px-4 py-2 bg-white hover:bg-white/90 text-black font-mono text-[10px] font-black uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Autorizar e Testar Microfone Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border-3 border-black rounded-3xl w-full max-w-md p-6 flex flex-col gap-4 text-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-white border-b border-zinc-900 pb-2">
              {confirmModal.title}
            </h3>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold uppercase rounded-lg border border-zinc-800 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-black uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Ecosystem & Biome Telemetry Modal */}
      <SmartEcosystemModal
        isOpen={showEcosystemModal}
        onClose={() => setShowEcosystemModal(false)}
        theme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onOpenSettings={() => setActiveTab("settings")}
      />

      {/* Interactive Kahoot-Inspired Ecosystem Quiz Modal */}
      <EcosystemQuizModal
        isOpen={quizModalOpen}
        initialThemeId={quizTargetThemeId}
        onClose={() => setQuizModalOpen(false)}
      />

    </div>
  );
}
