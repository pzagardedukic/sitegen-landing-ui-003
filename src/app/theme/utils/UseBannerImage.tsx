export const useBannerImage =
  process.env.NEXT_PUBLIC_THEME_EDITOR_ENABLED === "true"
    ? require("./useBannerImage.editor").useBannerImage
    : require("./useBannerImage.default").useBannerImage;
