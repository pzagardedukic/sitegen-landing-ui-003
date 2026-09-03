import { getThemeSettings } from "@/core/runtime";
import { imgWithBasePath, BASE_PATH } from "@/core/static";

const DEFAULT_HEADER_IMAGE = `${BASE_PATH}/images/main-banner.webp`;

export function getBannerFromTheme(): string {
  const banner = getThemeSettings().images?.banner;

  return banner?.file
    ? imgWithBasePath(banner.file as string)
    : DEFAULT_HEADER_IMAGE;
}
