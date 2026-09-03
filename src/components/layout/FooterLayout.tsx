import { Box, Container } from "@mui/material";

type FooterLayoutProps = {
  children: React.ReactNode;
};

export default function FooterLayout({ children }: FooterLayoutProps) {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        backgroundColor: theme.palette.footer.background,
        color: theme.palette.footer.text.primary,
        borderTop: `1px solid ${theme.palette.surfaces.border}`,
        py: { xs: 6, sm: 8, md: 10 },
        mt: "auto",
      })}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
