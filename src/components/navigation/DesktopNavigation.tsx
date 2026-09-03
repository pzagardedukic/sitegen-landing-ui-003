"use client";

import { Box, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import HoverDropdown, { DropdownItem } from "../common/HoverDropdown";
import { isCurrentPath, isNavActive } from "@/core/static";

type NavItem = {
  label: string;
  href?: string;
  subItems?: {
    label: string;
    href: string;
  }[];
};

type DesktopNavigationProps = {
  items: NavItem[];
};

export default function DesktopNavigation({ items }: DesktopNavigationProps) {
  const pathname = usePathname();
  const theme = useTheme();

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (isCurrentPath(pathname, href)) {
      event.preventDefault();
    }
  };

  /* Design system: navigation is the body face at bold 14 — the `navLink` variant. */
  const linkSx = {
    ...theme.typography.navLink,
    color: theme.palette.header.text,
    px: 1.5,
    borderRadius: 999,
    "&:hover": {
      color: theme.palette.header.hoverText,
      backgroundColor: "transparent",
    },
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {items.map((item) => {
        const hasSubItems = item.subItems?.length;

        if (hasSubItems) {
          const dropdownItems: DropdownItem[] = item.subItems!.map((sub) => ({
            label: sub.label,
            href: sub.href,
          }));

          return (
            <HoverDropdown
              key={item.label}
              trigger={
                <Button
                  color="inherit"
                  endIcon={<ArrowDropDownIcon />}
                  sx={linkSx}
                >
                  {item.label}
                </Button>
              }
              items={dropdownItems}
              onItemClick={handleLinkClick}
            />
          );
        }

        const active = isNavActive(pathname, item.href);

        return (
          <Button
            key={item.label}
            component="a"
            href={item.href || "#"}
            onClick={(event) => {
              if (item.href) {
                handleLinkClick(event, item.href);
              }
            }}
            color="inherit"
            sx={{
              ...linkSx,
              position: "relative",
              color: active
                ? theme.palette.header.selectedText
                : theme.palette.header.text,

              // Current page is marked with the brand gradient rather than a heavier weight,
              // so the marker survives a customer's font choice.
              ...(active && {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: 4,
                  height: 2,
                  borderRadius: 999,
                  backgroundImage: theme.palette.brandGradient,
                },
              }),
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}
