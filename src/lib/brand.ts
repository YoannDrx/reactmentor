import { getServerUrl } from "@/lib/server-url";

export const BRAND_LOGO_PATH =
  "/brand/react-mentor-logo-mark.png";
export const BRAND_LOGO_NAVBAR_PATH = BRAND_LOGO_PATH;
export const BRAND_LOGO_ALT = "React Mentor mascot logo";
export const BRAND_LOGO_WIDTH = 339;
export const BRAND_LOGO_HEIGHT = 369;

export const getBrandLogoUrl = () =>
  new URL(BRAND_LOGO_PATH, getServerUrl()).toString();
