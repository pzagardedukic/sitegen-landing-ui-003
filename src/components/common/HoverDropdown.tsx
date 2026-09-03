import React, { useRef, useState } from "react";
import {
  Box,
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Grow,
} from "@mui/material";

export type DropdownItem =
  | { label: string; href: string }
  | { label: string; onClick: () => void };

type HoverDropdownProps = {
  trigger: React.ReactElement;
  items: DropdownItem[];
  onItemClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => void;
};

export default function HoverDropdown({
  trigger,
  items,
  onItemClick,
}: HoverDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (el: HTMLElement) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorEl(el);
  };

  const closeMenuDelayed = () => {
    timeoutRef.current = setTimeout(() => setAnchorEl(null), 150);
  };

  const cancelClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={(theme) => ({
        color: theme.palette.text.secondary,
        "&:hover": { color: "white" },
      })}
    >
      <Box
        onMouseEnter={(e) => openMenu(e.currentTarget)}
        onMouseLeave={closeMenuDelayed}
        onClick={(e) => openMenu(e.currentTarget)}
        sx={{ display: "inline-block" }}
      >
        {trigger}

        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          disablePortal
          style={{ zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
              <Paper
                onMouseEnter={cancelClose}
                onMouseLeave={closeMenuDelayed}
                sx={(theme) => ({
                  backgroundColor: theme.palette.header.background,
                  borderRadius: "16px",
                  overflow: "hidden",
                  mt: 1,
                })}
              >
                <List dense>
                  {items.map((item, index) =>
                    "href" in item ? (
                      <ListItemButton
                        key={index}
                        component="a"
                        href={item.href}
                        onClick={(event) => {
                          event.stopPropagation();
                          onItemClick?.(event, item.href);
                          closeMenu();
                        }}
                        sx={(theme) => ({
                          color: theme.palette.header.text,
                          "&:hover": {
                            color: theme.palette.header.hoverText,
                            backgroundColor: theme.palette.header.hoverBg,
                          },
                        })}
                      >
                        <ListItemText
                          primary={item.label}
                          sx={(theme) => ({ ...theme.typography.body1 })}
                        />
                      </ListItemButton>
                    ) : (
                      <ListItemButton
                        key={index}
                        onClick={(event) => {
                          event.stopPropagation();
                          item.onClick();
                          closeMenu();
                        }}
                        sx={(theme) => ({
                          color: theme.palette.header.text,
                          "&:hover": {
                            color: theme.palette.header.hoverText,
                            backgroundColor: theme.palette.header.hoverBg,
                          },
                        })}
                      >
                        <ListItemText
                          primary={item.label}
                          sx={(theme) => ({ ...theme.typography.body1 })}
                        />
                      </ListItemButton>
                    ),
                  )}
                </List>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  );
}
