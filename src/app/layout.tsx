/*
 * Content metadata is owned by `PrimarySeoHead`, not Next's build-time metadata payload:
 * the snapshot renderer refreshes the HTML and its JSON seed together, per route, so a
 * build-time payload here would only go stale and compete with it.
 */
const RootLayout =
  process.env.NEXT_PUBLIC_THEME_EDITOR_ENABLED === "true"
    ? require("./layout.editor").default
    : require("./layout.default").default;

export default RootLayout;
