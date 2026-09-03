import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

type SectionTitleProps = {
  title: string;
  highContrast?: boolean;
  justify?: "center" | "flex-start" | "flex-end";
};

/*
 * A plain section heading.
 *
 * ui-001 split every title into two colours with StyledWords and appended a full stop in
 * the secondary colour — "Kdo Smo." — which is the old theme's signature and not in this
 * design. Here the heading is one colour and carries no punctuation of its own, so it reads
 * as whatever the customer actually wrote.
 */
export default function SectionTitle({
  title,
  highContrast = false,
  justify = "center",
}: SectionTitleProps) {
  return (
    <Box display="flex" justifyContent={justify} width="100%">
      <Typography
        variant="h3"
        component="h2"
        sx={{ color: highContrast ? "common.white" : "inherit" }}
      >
        {title}
      </Typography>
    </Box>
  );
}
