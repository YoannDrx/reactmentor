import { BRAND_LOGO_PATH } from "@/lib/brand";

export const SiteConfig = {
  title: "React Mentor",
  description:
    "Le cockpit d'entraînement pour préparer les entretiens React, React Native et TypeScript avec des explications profondes, un dashboard premium et une progression par compétence.",
  prodUrl: "https://reactmentor.dev",
  logoPath: BRAND_LOGO_PATH,
  appId: "react-mentor",
  domain: "reactmentor.dev",
  company: {
    name: "React Mentor",
    address: "",
  },
  brand: {
    primary: "#0ea5e9",
    secondary: "#ff6b4a",
    highlight: "#22c55e",
    canvas: "#f6efe6",
    ink: "#0f1720",
  },
  team: {
    name: "React Mentor Studio",
    website: "https://reactmentor.dev",
    image: BRAND_LOGO_PATH,
    twitter: "",
  },
  features: {
    enableLandingRedirection: false as boolean,
  },
} as const;
