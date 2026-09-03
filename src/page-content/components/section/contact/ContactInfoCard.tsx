import { Box, Typography } from "@mui/material";

type ContactInfoCardProps = {
  label: string;
  children: React.ReactNode;
};

/*
 * One labelled block of contact details: a small muted label with the value beneath it.
 *
 * ui-001 drew each of these as a card with a filled circular icon and its own link. The
 * Figma has no icons and no per-item action here — the details are a plain list, and the
 * icons were carrying the old theme's look into every page that shows contact information.
 */
export default function ContactInfoCard({
  label,
  children,
}: ContactInfoCardProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        variant="caption"
        component="h3"
        sx={{ opacity: 0.6, letterSpacing: "0.4px" }}
      >
        {label}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {children}
      </Box>
    </Box>
  );
}
