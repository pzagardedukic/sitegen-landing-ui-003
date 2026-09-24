import { createElement, type ReactNode, type CSSProperties } from "react";
/** Show the final frame; an opacity:0 animation is useless in a static snapshot. */
function element(tag: "div" | "img") {
  return function StaticMotion({
    initial,
    animate,
    exit,
    transition,
    layout,
    children,
    style,
    ...props
  }: {
    initial?: unknown;
    animate?: CSSProperties;
    exit?: unknown;
    transition?: unknown;
    layout?: unknown;
    children?: ReactNode;
    style?: CSSProperties;
    [key: string]: unknown;
  }) {
    return createElement(
      tag,
      { ...props, style: { ...style, ...animate } },
      children,
    );
  };
}
export const motion = { div: element("div"), img: element("img") };
export function AnimatePresence({
  children,
}: {
  children?: ReactNode;
  mode?: string;
}) {
  return children;
}
