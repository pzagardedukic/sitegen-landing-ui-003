const AppProviders =
  process.env.NEXT_PUBLIC_THEME_EDITOR_ENABLED === "true"
    ? require("./AppProviders.editor").default
    : require("./AppProviders.default").default;

export default AppProviders;
