"use client";

import { useState } from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import MobileNavDrawer from "./MobileNavDrawer";
import DesktopNavigation from "./DesktopNavigation";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

type NavItem = {
  label: string;
  href?: string;
  subItems?: {
    label: string;
    href: string;
  }[];
};

type HeaderNavigationProps = {
  items: NavItem[];
};

export default function HeaderNavigation({ items }: HeaderNavigationProps) {
  const theme = useTheme();
  const isMobile = useIsMobileDevice();
  const [open, setOpen] = useState(false);

  /* ---------------- MOBILE ---------------- */
  if (isMobile) {
    return (
      <>
        <IconButton onClick={() => setOpen(true)} aria-label="open menu">
          <MenuIcon sx={{ color: theme.palette.header.text }} />
        </IconButton>

        <MobileNavDrawer
          open={open}
          onClose={() => setOpen(false)}
          items={items}
        />
      </>
    );
  }

  /* ---------------- DESKTOP ---------------- */
  return <DesktopNavigation items={items} />;
}
