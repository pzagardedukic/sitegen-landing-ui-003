import type { ReactNode } from "react";
/** Only the static image markup is needed, not a browser lightbox implementation. */
export function Gallery({
  children,
}: {
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return children;
}
export function Item({
  children,
}: {
  children: (props: {
    ref: (node: HTMLElement | null) => void;
    open: () => void;
  }) => ReactNode;
  [key: string]: unknown;
}) {
  return children({ ref: () => {}, open: () => {} });
}
