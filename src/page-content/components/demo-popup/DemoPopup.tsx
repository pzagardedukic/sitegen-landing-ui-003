export const DemoPopup =
  process.env.NEXT_PUBLIC_DEMO_POPUP_ENABLED === "true"
    ? require("./DemoPopup.enabled").default
    : require("./DemoPopup.disabled").default;
