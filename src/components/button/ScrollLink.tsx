import * as React from "react";
import { Box, Link, Typography } from "@mui/material";

interface ScrollLinkProps {
  label: string;
  href: string;
  color?: string;
  textPosition?: "top" | "bottom";
  cleanupUrl?: boolean;
}

const ScrollLink: React.FC<ScrollLinkProps> = ({
  label,
  href,
  color = "white",
  textPosition = "top",
  cleanupUrl = true,
}) => {
  const isTop = textPosition === "top";

  return (
    <Link
      href={href}
      underline="none"
      sx={{
        display: "flex",
        flexDirection: isTop ? "column" : "column-reverse",
        alignItems: "center",
        textDecoration: "none",
        color: color,
      }}
      onClick={() => {
        // if it's an anchor scroll, remove the hash afterward
        if (cleanupUrl && href?.startsWith("#")) {
          setTimeout(() => {
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            );
          }, 10);
        }
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          letterSpacing: "0.05em",
          fontSize: 12,
          mt: isTop ? 0 : 0.5,
          mb: isTop ? 0.5 : 0,
          textTransform: "uppercase",
          transition: "transform 0.15s ease-in-out",
          "&:hover": {
            transform: "scale(1.03)",
          },
        }}
      >
        {label}
      </Typography>
      {/* Figma draws this rule 56 tall, not 100. */}
      <Box
        className="line"
        sx={{
          width: "1px",
          height: 56,
          backgroundColor: color,
          opacity: 0.7,
        }}
      />
    </Link>
  );
};

export default ScrollLink;
