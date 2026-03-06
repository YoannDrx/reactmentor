import type { Messages } from "@/i18n/messages";
import {
  masteryBands,
  moduleCatalog,
  recentSessionsMeta,
  skillRadar,
  weeklyMomentum,
} from "@/lib/demo-data";

export function getLocalizedModules(messages: Messages) {
  return messages.dashboard.modulesCatalog.map((module, index) => ({
    ...moduleCatalog[index],
    ...module,
  }));
}

export function getLocalizedReviewQueue(messages: Messages) {
  return messages.dashboard.reviewQueue;
}

export function getLocalizedRecentSessions(messages: Messages) {
  return messages.dashboard.recentSessions.map((session, index) => ({
    ...recentSessionsMeta[index],
    ...session,
  }));
}

export function getLocalizedMockTemplates(messages: Messages) {
  return messages.dashboard.mockTemplates;
}

export function getLocalizedSkillRadar(messages: Messages) {
  return skillRadar.map((item) => ({
    ...item,
    skill: messages.dashboard.skillLabels[item.id],
  }));
}

export function getLocalizedWeeklyMomentum(messages: Messages) {
  return weeklyMomentum.map((item) => ({
    ...item,
    day: messages.common.days[item.id],
  }));
}

export function getLocalizedMasteryBands(messages: Messages) {
  return masteryBands.map((item) => ({
    ...item,
    band: messages.dashboard.masteryLabels[item.id],
  }));
}
