import { forwardRef, type CSSProperties, type ReactNode } from "react";

type StaticMarqueeProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: "left" | "right" | "up" | "down";
  // Call sites retain these animation options. The snapshot ignores them and
  // does not forward them to the DOM or invoke their callbacks.
  autoFill?: boolean;
  play?: boolean;
  pauseOnHover?: boolean;
  pauseOnClick?: boolean;
  speed?: number;
  delay?: number;
  loop?: number;
  gradient?: boolean;
  gradientColor?: string;
  gradientWidth?: number | string;
  onFinish?: () => void;
  onCycleComplete?: () => void;
  onMount?: () => void;
};

/**
 * Standalone-renderer adapter only. The live application still imports the
 * real react-fast-marquee package and keeps its normal animations.
 *
 * The published marquee is CommonJS; a default import in this ESM project can
 * resolve to a module wrapper instead of a component in the standalone bundle.
 * It also returns null until useEffect runs, so unwrapping that import alone
 * would still omit review text, client logos, and sliding text from SEO HTML.
 *
 * Render each supplied child once, immediately, without effects or browser APIs.
 */
const StaticMarquee = forwardRef<HTMLDivElement, StaticMarqueeProps>(
  function StaticMarquee(
    { children, className, style, direction = "left" },
    ref,
  ) {
    const vertical = direction === "up" || direction === "down";

    return (
      <div
        ref={ref}
        className={className}
        data-sitegen-static-marquee="true"
        style={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            alignItems: "center",
            flex: "0 0 auto",
            minWidth: vertical ? undefined : "100%",
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

export default StaticMarquee;
