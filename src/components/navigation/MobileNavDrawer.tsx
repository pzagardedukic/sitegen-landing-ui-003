"use client";

import { Drawer, Box, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname } from "next/navigation";
import { isCurrentPath, isNavActive } from "@/core/static";
import { getHome, useLanguage } from "@/core/runtime";
import { withBasePath } from "@/core/static";

type NavItem = {
  label: string;
  href?: string;
  subItems?: {
    label: string;
    href: string;
  }[];
};

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

export default function MobileNavDrawer({
  open,
  onClose,
  items,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const home = getHome(lang);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (isCurrentPath(pathname, href)) {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: (theme) => ({
            width: "100vw",
            // dvh, not vh: on a phone the URL bar is part of vh and the last item ends
            // up under it.
            height: "100dvh",
            position: "relative",
            /*
             * Opaque, unlike the bar. header.background is 8 % transparent so the bar can
             * sit over the hero photograph; at full screen that let the page underneath
             * read straight through the menu — page headings crossed the menu labels and
             * the logo in the bar showed through the panel.
             */
            backgroundColor: theme.palette.header.solid,
            backgroundImage: "none",
            color: theme.palette.header.text,
          }),
        },
      }}
    >
      {/*
        The menu carries its own logo rather than letting the bar's show through: the panel
        is opaque now, and at 28px the bar logo was a stamp in the corner of a full screen.
        It sits on the same 36px margin as the entries below it, so the menu has one left
        edge and not two.
      */}
      <Box
        sx={{
          px: "36px",
          pt: 3,
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          component="a"
          href={withBasePath("/")}
          sx={{ display: "flex", alignItems: "center", minWidth: 0 }}
        >
          {home.logo.image ? (
            <Box
              component="img"
              src={home.logo.image}
              alt={`${home.name} Logo`}
              sx={{
                height: 44,
                maxWidth: 200,
                width: "auto",
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
          ) : (
            <Typography variant="h4">{home.name}</Typography>
          )}
        </Box>

        <IconButton onClick={onClose} aria-label="Zapri meni" sx={{ color: "inherit" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: "36px", pt: 4, pb: 6 }}>
        <Stack spacing={4}>
          {items.map((item) => (
            <Box key={item.label}>
              {item.href && (
                <Typography
                  component="a"
                  href={item.href}
                  onClick={(event) => handleLinkClick(event, item.href!)}
                  variant="h3"
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    color: isNavActive(pathname, item.href)
                      ? "header.selectedText"
                      : "inherit",
                  }}
                >
                  {item.label}
                </Typography>
              )}

              {item.subItems && (
                <Stack spacing={2} sx={{ mt: 2, pl: 2 }}>
                  {item.subItems.map((sub) => {
                    const active = isNavActive(pathname, sub.href);

                    return (
                      <Typography
                        key={sub.href}
                        component="a"
                        href={sub.href}
                        onClick={(event) => handleLinkClick(event, sub.href)}
                        variant="h6"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          textDecoration: "none",
                          color: active ? "header.selectedText" : "inherit",
                          opacity: active ? 1 : 0.75,
                        }}
                      >
                        <Box
                          component="span"
                          sx={(theme) => ({
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundImage: theme.palette.brandGradient,
                            flexShrink: 0,
                            visibility: active ? "visible" : "hidden",
                          })}
                        />
                        {sub.label}
                      </Typography>
                    );
                  })}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
