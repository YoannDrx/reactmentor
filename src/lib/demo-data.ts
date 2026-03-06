export const moduleCatalog = [
  {
    id: "react-rendering-systems",
    completion: 78,
    questions: 48,
    accent: "cyan",
    level: "mid",
  },
  {
    id: "effects-without-superstition",
    completion: 54,
    questions: 36,
    accent: "orange",
    level: "senior",
  },
  {
    id: "typescript-for-components",
    completion: 83,
    questions: 42,
    accent: "green",
    level: "mid",
  },
  {
    id: "react-native-interview-cases",
    completion: 39,
    questions: 28,
    accent: "violet",
    level: "mid",
  },
] as const;

export const skillRadar = [
  { id: "rendering", score: 86 },
  { id: "effects", score: 61 },
  { id: "typescript", score: 78 },
  { id: "testing", score: 52 },
  { id: "performance", score: 67 },
  { id: "rn", score: 49 },
] as const;

export const weeklyMomentum = [
  { id: "mon", score: 62 },
  { id: "tue", score: 70 },
  { id: "wed", score: 68 },
  { id: "thu", score: 74 },
  { id: "fri", score: 81 },
  { id: "sat", score: 76 },
  { id: "sun", score: 84 },
] as const;

export const masteryBands = [
  { id: "mastered", value: 32 },
  { id: "inProgress", value: 19 },
  { id: "review", value: 11 },
] as const;

export const recentSessionsMeta = [
  { id: "mock-react-mid", score: 84, duration: "28 min" },
  { id: "review-typescript", score: 91, duration: "14 min" },
  { id: "practice-rn", score: 68, duration: "12 min" },
] as const;
