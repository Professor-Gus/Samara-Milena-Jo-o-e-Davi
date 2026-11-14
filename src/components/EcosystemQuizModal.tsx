import React, { useEffect, useState } from "react";
import {
  Trophy,
  X,
  ArrowRight,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trees,
  TreePine,
  Sun,
  Sprout,
  Waves
} from "lucide-react";
import { THEMES, THEME_LIST, ThemeId } from "../themes";
import { EcosystemQuiz, getQuizByThemeId, QuizQuestion } from "../groupsConfig";
import { AppLogo } from "./AppLogo";

interface EcosystemQuizModalProps {
  isOpen: boolean;
  initialThemeId: ThemeId;
  onClose: () => void;
}

const TOPIC_LABELS: Record<QuizQuestion["topic"], string> = {
  caracteristicas: "Características do Ecossistema",
  fauna_flora: "Fauna e Flora",
  importancia: "Importância Ambiental",
  ameacas_preservacao: "Ameaças e Preservação",
  tecnologia: "Tecnologia e Conservação IoT",
};

interface AnswerButtonStyle {
  letter: "A" | "B" | "C" | "D";
  bg: string;
  hoverBg: string;
  border: string;
  shape: "triangle" | "diamond" | "circle" | "square";
}

const KAHOOT_OPTIONS_STYLE: [AnswerButtonStyle, AnswerButtonStyle, AnswerButtonStyle, AnswerButtonStyle] = [
  { letter: "A", bg: "#C81E3A", hoverBg: "#A6162E", border: "#FB7185", shape: "triangle" },
  { letter: "B", bg: "#1368CE", hoverBg: "#0F54A8", border: "#60A5FA", shape: "diamond" },
  { letter: "C", bg: "#B45309", hoverBg: "#92400E", border: "#FBBF24", shape: "circle" },
  { letter: "D", bg: "#15803D", hoverBg: "#166534", border: "#4ADE80", shape: "square" },
];

function renderOptionShape(shape: AnswerButtonStyle["shape"]) {
  switch (shape) {
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
          <polygon points="12,3 22,20 2,20" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      );
  }
}

function renderBiomeMiniIcon(iconName: string, className = "w-3.5 h-3.5") {
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
      return <Sparkles className={className} />;
  }
}

function getEncouragingMessage(correctCount: number): { title: string; body: string } {
  if (correctCount === 5) {
    return {
      title: "Desempenho Extraordinário!",
      body: "Você dominou todos os desafios de ecologia e tecnologia ambiental deste ecossistema!"
    };
  }
  if (correctCount >= 4) {
    return {
      title: "Excelente Resultado!",
      body: "Ótimo domínio sobre a biodiversidade, conservação e monitoramento inteligente!"
    };
  }
  if (correctCount >= 3) {
    return {
      title: "Muito Bom!",
      body: "Você acertou a maioria das questões. Continue explorando as apresentações para chegar aos 5.000 pontos!"
    };
  }
  if (correctCount >= 1) {
    return {
      title: "Bom Começo!",
      body: "Cada tentativa fortalece seu conhecimento ambiental. Jogue novamente para superar sua marca!"
    };
  }
  return {
    title: "Continue Explorando!",
    body: "Assista novamente aos vídeos do ecossistema e tente outro desafio para conquistar seus primeiros pontos!"
  };
}

export const EcosystemQuizModal: React.FC<EcosystemQuizModalProps> = ({
  isOpen,
  initialThemeId,
  onClose,
}) => {
  const [quizThemeId, setQuizThemeId] = useState<ThemeId>(initialThemeId);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answersRecord, setAnswersRecord] = useState<boolean[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sync active biome & reset state whenever modal opens or initialThemeId changes
  useEffect(() => {
    if (isOpen) {
      setQuizThemeId(initialThemeId);
      setCurrentIndex(0);
      setSelectedOptionIndex(null);
      setAnswersRecord([]);
      setIsCompleted(false);
    }
  }, [isOpen, initialThemeId]);

  if (!isOpen) return null;

  const activeTheme = THEMES[quizThemeId] || THEMES.amazonia;
  const activeQuiz: EcosystemQuiz = getQuizByThemeId(quizThemeId);
  const totalQuestions = activeQuiz.questions.length; // 5
  const currentQuestion = activeQuiz.questions[currentIndex];
  const hasAnsweredCurrent = selectedOptionIndex !== null;
  const isCurrentCorrect = hasAnsweredCurrent && selectedOptionIndex === currentQuestion.correctIndex;

  const handleSelectBiomeQuiz = (themeId: ThemeId) => {
    setQuizThemeId(themeId);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setAnswersRecord([]);
    setIsCompleted(false);
  };

  const handleSelectOption = (optionIdx: number) => {
    // Impede alterar resposta após confirmada
    if (selectedOptionIndex !== null) return;
    setSelectedOptionIndex(optionIdx);
    const isCorrect = optionIdx === currentQuestion.correctIndex;
    setAnswersRecord((prev) => [...prev, isCorrect]);
  };

  const handleAdvance = () => {
    if (!hasAnsweredCurrent) return;
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReplayQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setAnswersRecord([]);
    setIsCompleted(false);
  };

  const correctCount = answersRecord.filter(Boolean).length;
  const wrongCount = totalQuestions - correctCount;
  const totalScore = correctCount * activeQuiz.pointsPerQuestion;
  const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);
  const encouragement = getEncouragingMessage(correctCount);
  const progressPercent = isCompleted ? 100 : Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/88 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={activeQuiz.title}
    >
      <div
        className="w-full max-w-4xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
        style={{
          backgroundColor: activeTheme.colors.bgSurface,
          borderColor: activeTheme.colors.borderMain,
          boxShadow: `0 0 45px ${activeTheme.glowColor}, 0 24px 60px rgba(0,0,0,0.95)`,
          color: activeTheme.colors.textPrimary,
        }}
      >
        {/* Top Modal Header: Identity & Close */}
        <div
          className="px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: activeTheme.colors.bgApp,
            borderColor: activeTheme.colors.borderSubtle,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <AppLogo size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border whitespace-nowrap"
                  style={{
                    backgroundColor: activeTheme.colors.bgCard,
                    color: activeTheme.colors.primary,
                    borderColor: activeTheme.colors.borderMain,
                  }}
                >
                  ASSISTENTES DA NATUREZA · 9º A
                </span>
                <span className="text-[9px] font-mono font-bold uppercase whitespace-nowrap" style={{ color: activeTheme.colors.textMuted }}>
                  {activeQuiz.ecosystemName}
                </span>
              </div>
              <h2 className="font-display font-black text-sm sm:text-lg uppercase tracking-wide truncate mt-0.5">
                {activeQuiz.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border font-mono text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:brightness-110 shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: activeTheme.colors.bgCard,
              color: activeTheme.colors.textSecondary,
              borderColor: activeTheme.colors.borderSubtle,
            }}
            title="Voltar à Apresentação"
          >
            <X className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Fechar</span>
          </button>
        </div>

        {/* Biome Quiz Switcher Strip (All 5 Ecosystem Quizzes directly accessible) */}
        <div
          className="px-4 sm:px-6 py-2.5 border-b flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0"
          style={{
            backgroundColor: activeTheme.colors.bgSurface,
            borderColor: activeTheme.colors.borderSubtle,
          }}
        >
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0"
            style={{ color: activeTheme.colors.textMuted }}
          >
            Ecossistemas:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {THEME_LIST.map((th) => {
              const isSelected = th.id === quizThemeId;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleSelectBiomeQuiz(th.id)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl font-mono text-[10px] font-black uppercase border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isSelected ? "shadow-md scale-[1.02]" : "opacity-75 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: isSelected ? th.colors.primary : th.colors.bgCard,
                    color: isSelected ? th.colors.primaryText : th.colors.textPrimary,
                    borderColor: isSelected ? th.colors.borderMain : th.colors.borderSubtle,
                  }}
                >
                  {renderBiomeMiniIcon(th.iconName, "w-3.5 h-3.5 shrink-0")}
                  <span>{th.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Quiz Content Area */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1">
          {!isCompleted ? (
            <div className="space-y-5 max-w-3xl mx-auto">
              {/* Progress Indicator (NO score exposed during questions 1-5) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs sm:text-sm font-black uppercase px-3 py-1 rounded-lg border whitespace-nowrap"
                      style={{
                        backgroundColor: activeTheme.colors.bgCard,
                        color: activeTheme.colors.primary,
                        borderColor: activeTheme.colors.borderMain,
                      }}
                    >
                      Pergunta {currentIndex + 1} de {totalQuestions}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ color: activeTheme.colors.textMuted }}
                    >
                      {TOPIC_LABELS[currentQuestion.topic]}
                    </span>
                  </div>

                  {/* Step Indicator Dots */}
                  <div className="flex items-center gap-1.5" aria-label={`Progresso: ${currentIndex + 1} de ${totalQuestions}`}>
                    {activeQuiz.questions.map((qItem, idx) => {
                      const answeredState = answersRecord[idx];
                      const isCurrent = idx === currentIndex;
                      let dotBg = activeTheme.colors.bgCard;
                      let dotBorder = activeTheme.colors.borderSubtle;
                      if (answeredState === true) {
                        dotBg = "#15803D";
                        dotBorder = "#4ADE80";
                      } else if (answeredState === false) {
                        dotBg = "#C81E3A";
                        dotBorder = "#FB7185";
                      } else if (isCurrent) {
                        dotBg = activeTheme.colors.primary;
                        dotBorder = activeTheme.colors.borderMain;
                      }
                      return (
                        <span
                          key={qItem.id}
                          className={`h-2.5 rounded-full border transition-all ${
                            isCurrent ? "w-7" : "w-2.5"
                          }`}
                          style={{ backgroundColor: dotBg, borderColor: dotBorder }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: activeTheme.colors.bgApp }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: activeTheme.colors.primary,
                    }}
                  />
                </div>
              </div>

              {/* Question Banner */}
              <div
                className="rounded-2xl p-5 sm:p-7 border text-center space-y-2 shadow-lg"
                style={{
                  backgroundColor: activeTheme.colors.bgCard,
                  borderColor: activeTheme.colors.borderSubtle,
                }}
              >
                <div
                  className="text-[10px] font-mono font-bold uppercase tracking-widest"
                  style={{ color: activeTheme.colors.accent }}
                >
                  Desafio {activeQuiz.ecosystemName} • Vale 1.000 Pontos
                </div>
                <h3
                  className="font-display font-black text-lg sm:text-2xl leading-snug tracking-tight"
                  style={{ color: activeTheme.colors.textPrimary }}
                >
                  {currentQuestion.question}
                </h3>
              </div>

              {/* 4 Large Colorful Kahoot-Style Answer Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const styleCfg = KAHOOT_OPTIONS_STYLE[optIdx];
                  const isPicked = selectedOptionIndex === optIdx;
                  const isCorrectOption = currentQuestion.correctIndex === optIdx;

                  let opacityClass = "opacity-100";
                  let ringStyle: string | undefined = undefined;
                  let badgeLabel: string | null = null;

                  if (hasAnsweredCurrent) {
                    if (isCorrectOption) {
                      ringStyle = "0 0 0 4px #4ADE80, 0 10px 28px rgba(21, 128, 61, 0.55)";
                      badgeLabel = "CORRETA";
                    } else if (isPicked && !isCorrectOption) {
                      ringStyle = "0 0 0 4px #FCA5A5, 0 8px 24px rgba(200, 30, 58, 0.55)";
                      badgeLabel = "SUA RESPOSTA";
                    } else {
                      opacityClass = "opacity-45";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`group relative min-h-[76px] sm:min-h-[88px] w-full rounded-2xl p-4 text-left text-white font-sans transition-all flex items-center gap-3.5 border-2 shadow-lg ${
                        !hasAnsweredCurrent
                          ? "cursor-pointer hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0.5"
                          : "cursor-default"
                      } ${opacityClass}`}
                      style={{
                        backgroundColor: styleCfg.bg,
                        borderColor: hasAnsweredCurrent && isCorrectOption ? "#4ADE80" : styleCfg.border,
                        boxShadow: ringStyle || "0 6px 0 rgba(0,0,0,0.45)",
                      }}
                    >
                      {/* Geometric Kahoot Badge + Letter */}
                      <div className="w-11 h-11 rounded-xl bg-black/25 border border-white/25 flex flex-col items-center justify-center shrink-0 text-white">
                        {renderOptionShape(styleCfg.shape)}
                        <span className="text-[9px] font-mono font-black leading-none mt-0.5">
                          {styleCfg.letter}
                        </span>
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm sm:text-[15px] font-bold leading-snug block text-white">
                          {optionText}
                        </span>
                        {badgeLabel && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/45 text-white">
                            {isCorrectOption ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-200 shrink-0" />
                            )}
                            <span>{badgeLabel}</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Visual Feedback + Advance Button */}
              {hasAnsweredCurrent && (
                <div
                  className="rounded-2xl p-4 sm:p-5 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
                  style={{
                    backgroundColor: isCurrentCorrect ? "rgba(21, 128, 61, 0.22)" : "rgba(200, 30, 58, 0.22)",
                    borderColor: isCurrentCorrect ? "#4ADE80" : "#FB7185",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {isCurrentCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-display font-black text-sm sm:text-base uppercase tracking-wide text-white">
                        {isCurrentCorrect
                          ? "Resposta Correta! (+1.000 pontos)"
                          : "Resposta Incorreta (0 pontos)"}
                      </div>
                      <p className="text-xs sm:text-sm font-mono leading-relaxed text-zinc-100">
                        {currentQuestion.feedback}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdvance}
                    className="min-h-[46px] px-6 py-3 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 shadow-lg"
                    style={{
                      backgroundColor: activeTheme.colors.primary,
                      color: activeTheme.colors.primaryText,
                      borderColor: activeTheme.colors.borderMain,
                    }}
                  >
                    <span>{currentIndex + 1 < totalQuestions ? "Avançar" : "Ver Resultado"}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* FINAL COMPLETION SCREEN */
            <div className="max-w-2xl mx-auto text-center space-y-6 py-2 animate-fade-in">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-18 h-18 rounded-2xl flex items-center justify-center border-2 shadow-xl"
                  style={{
                    backgroundColor: activeTheme.colors.bgCard,
                    color: activeTheme.colors.primary,
                    borderColor: activeTheme.colors.borderMain,
                    boxShadow: `0 0 28px ${activeTheme.glowColor}`,
                  }}
                >
                  <Trophy className="w-9 h-9" />
                </div>

                <span
                  className="text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: activeTheme.colors.bgCard,
                    color: activeTheme.colors.accent,
                    borderColor: activeTheme.colors.borderSubtle,
                  }}
                >
                  Ecossistema: {activeQuiz.ecosystemName}
                </span>

                <h3
                  className="font-display font-black text-2xl sm:text-4xl uppercase tracking-wider"
                  style={{ color: activeTheme.colors.textPrimary }}
                >
                  QUIZ CONCLUÍDO!
                </h3>
              </div>

              {/* Total Points Highlight */}
              <div
                className="rounded-3xl p-6 border-2 space-y-1.5 shadow-xl"
                style={{
                  backgroundColor: activeTheme.colors.bgCard,
                  borderColor: activeTheme.colors.borderMain,
                }}
              >
                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-widest block"
                  style={{ color: activeTheme.colors.textMuted }}
                >
                  Pontuação Total Alcançada
                </span>
                <div
                  className="font-display font-black text-4xl sm:text-5xl tracking-tight tabular-nums"
                  style={{ color: activeTheme.colors.primary }}
                >
                  {totalScore.toLocaleString("pt-BR")} <span className="text-lg sm:text-2xl opacity-80">/ 5.000 pts</span>
                </div>
              </div>

              {/* Metrics Grid: Correct, Wrong, Accuracy % */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-2xl p-4 space-y-1"
                  style={{ backgroundColor: "rgba(21, 128, 61, 0.22)" }}
                >
                  <div className="font-mono text-[10px] font-bold uppercase text-emerald-300">
                    Acertos
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-white tabular-nums">
                    {correctCount}
                  </div>
                </div>

                <div
                  className="rounded-2xl p-4 space-y-1"
                  style={{ backgroundColor: "rgba(200, 30, 58, 0.22)" }}
                >
                  <div className="font-mono text-[10px] font-bold uppercase text-rose-300">
                    Erros
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-white tabular-nums">
                    {wrongCount}
                  </div>
                </div>

                <div
                  className="rounded-2xl p-4 space-y-1"
                  style={{ backgroundColor: activeTheme.colors.bgCard }}
                >
                  <div
                    className="font-mono text-[10px] font-bold uppercase"
                    style={{ color: activeTheme.colors.textMuted }}
                  >
                    Aproveitamento
                  </div>
                  <div
                    className="font-display font-black text-2xl sm:text-3xl tabular-nums"
                    style={{ color: activeTheme.colors.primary }}
                  >
                    {accuracyPercent}%
                  </div>
                </div>
              </div>

              {/* Encouraging Feedback Banner */}
              <div
                className="rounded-2xl p-4 sm:p-5 border text-center space-y-1"
                style={{
                  backgroundColor: activeTheme.colors.bgCard,
                  borderColor: activeTheme.colors.borderSubtle,
                }}
              >
                <div className="font-display font-black text-base sm:text-lg uppercase text-white">
                  {encouragement.title}
                </div>
                <p className="text-xs sm:text-sm font-mono leading-relaxed" style={{ color: activeTheme.colors.textSecondary }}>
                  {encouragement.body}
                </p>
              </div>

              {/* Action Buttons: JOGAR NOVAMENTE & VOLTAR À APRESENTAÇÃO */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReplayQuiz}
                  className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg"
                  style={{
                    backgroundColor: activeTheme.colors.primary,
                    color: activeTheme.colors.primaryText,
                    borderColor: activeTheme.colors.borderMain,
                  }}
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>JOGAR NOVAMENTE</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
                  style={{
                    backgroundColor: activeTheme.colors.bgCard,
                    color: activeTheme.colors.textPrimary,
                    borderColor: activeTheme.colors.borderSubtle,
                  }}
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span>VOLTAR À APRESENTAÇÃO</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
