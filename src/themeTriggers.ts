import { ThemeId } from "./themes";
import {
  GROUPS_CONFIG,
  ALL_GROUPS_LIST,
  VIDEOS_CATALOG,
  QUIZZES_CONFIG,
  ALL_QUIZZES_LIST,
  GroupDefinition,
  GroupTrigger,
  GroupVideoAsset,
  PresentationType,
  EcosystemQuiz,
  QuizQuestion,
  getGroupById,
  getVideoById,
  getQuizByThemeId,
  matchTriggerForActiveGroup,
  normalizeVoiceText
} from "./groupsConfig";

export type ThemeTrigger = GroupTrigger;
export type PresentationGroup = GroupDefinition;

export {
  GROUPS_CONFIG,
  ALL_GROUPS_LIST,
  VIDEOS_CATALOG,
  QUIZZES_CONFIG,
  ALL_QUIZZES_LIST,
  getGroupById,
  getVideoById,
  getQuizByThemeId,
  matchTriggerForActiveGroup,
  normalizeVoiceText
};
export type { GroupVideoAsset, PresentationType, EcosystemQuiz, QuizQuestion };

/**
 * Re-exportação compatível para módulos auxiliares que consultam os cinco temas oficiais:
 * Amazônia, Taiga, Caatinga, Bambuçal e Manguezal.
 */
export const ALL_BIOME_GROUPS: Record<ThemeId, GroupDefinition[]> = {
  amazonia: ALL_GROUPS_LIST,
  taiga: ALL_GROUPS_LIST,
  caatinga: ALL_GROUPS_LIST,
  bambucal: ALL_GROUPS_LIST,
  manguezal: ALL_GROUPS_LIST,
};
