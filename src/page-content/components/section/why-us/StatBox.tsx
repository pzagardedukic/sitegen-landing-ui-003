import { Box, Typography } from "@mui/material";

type StatBoxProps = {
  value: string;
  label: string;
};

/*
 * One figure from the Figma frame: the number set very large with its label underneath.
 * The number carries the brand gradient — it is the only place in this section that does.
 */
export default function StatBox({ value, label }: StatBoxProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        component="p"
        sx={(theme) => ({
          fontFamily: theme.typography.h1.fontFamily,
          fontSize: { xs: "56px", sm: "72px", md: "96px" },
          lineHeight: 1.05,
          letterSpacing: "-2px",
          backgroundImage: theme.palette.brandGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        })}
      >
        {value}
      </Typography>

      <Typography variant="body1" sx={{ color: "inherit", opacity: 0.72 }}>
        {label}
      </Typography>
    </Box>
  );
}
