import { getServerUrl } from "@/lib/server-url";

export const BRAND_LOGO_PATH = "/brand/react-mentor-mascot-logo.png";
export const BRAND_LOGO_ALT = "React Mentor mascot logo";
export const BRAND_LOGO_WIDTH = 500;
export const BRAND_LOGO_HEIGHT = 500;

export const getBrandLogoUrl = () =>
  new URL(BRAND_LOGO_PATH, getServerUrl()).toString();
