import { AppBar, Toolbar } from "@mui/material";
import { HEADER_CENTRE, HEADER_HEIGHT } from "@/app/theme/headerMetrics";

type HeaderLayoutProps = {
  children: React.ReactNode;
  scrolled: boolean;
};

/*
 * Transparent over the hero, solid once the page moves.
 *
 * The bar carries no content container and nothing sits in its row: the logo hangs off the
 * left edge and the navigation off the right, both positioned against the bar itself. A
 * Container would have held the navigation on the 36 / 64 / 120 content grid, which at 1440
 * leaves it 144 from the edge against the logo's 24 and reads lopsided.
 *
 * Both are hung on the same `--logo-y`, so they share a centre line. In the row the
 * navigation centred on the bar instead and sat visibly higher than the logo beside it.
 */
export default function HeaderLayout({
  children,
  scrolled,
}: HeaderLayoutProps) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: scrolled
          ? theme.palette.header.background
          : "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        transition: theme.transitions.create(["background-color"], {
          duration: theme.transitions.duration.short,
        }),
      })}
    >
      <Toolbar
        disableGutters
        sx={(theme) => ({
          /*
           * Nothing sits in this bar's row. The logo and the navigation are both hung on
           * it, sharing `--logo-y` as their centre line, so the three variables below are
           * the whole geometry of the header.
           *
           * `--logo-y` and `--logo-x` come from the hero card, which is inset 12/24/20 from
           * the page edge. The light theme cuts a notch into its top-left corner for the
           * logo; this one does not — the card is a plain rounded rectangle and the logo
           * lies on the photograph itself. The numbers are kept so the two themes place
           * the header identically:
           *
           *   y   xs 44      sm 65      md 71
           *   x   xs 16      sm 28      md 24     (the card inset plus four)
           *
           * None of it changes when the page scrolls, and the bar is twice `--logo-y` tall
           * so that centre is also the middle of the bar. That is the point: the slab
           * appears behind the logo and the menu without either of them moving. An earlier
           * version shrank the bar and lifted the logo on scroll, and everything jumped.
           *
           * The bar height is written into these same breakpoint blocks on purpose. As a
           * responsive `minHeight: { xs, md }` beside an explicit `breakpoints.up("md")`
           * key, both produce a `@media (min-width:900px)` block and the later one wins
           * the whole block — the height silently reverted to the xs value on desktop.
           */
          minHeight: HEADER_HEIGHT.xs,
          "--logo-y": `${HEADER_CENTRE.xs}px`,
          "--logo-x": "16px",
          "--nav-x": "24px",
          /*
           * White at every scroll position, unlike the light theme, which only inverts the
           * artwork once the bar goes dark. Here the logo never has a light background:
           * unscrolled it lies on the hero photograph under a 60 % scrim, scrolled it lies
           * on the dark bar. `brightness(0) invert(1)` flattens artwork of any colour to
           * white and keeps its shape, which is the one treatment that works without
           * knowing what the customer uploaded.
           */
          "--logo-filter": "brightness(0) invert(1)",
          /*
           * For a customer who uploaded no logo, where the site name is set as type rather
           * than artwork. White in both states: unscrolled it sits on the hero photograph
           * under a 60 % scrim, scrolled it sits on the dark bar.
           */
          "--logo-color": "#ffffff",
          [theme.breakpoints.up("sm")]: {
            // MUI's own Toolbar rule drops the bar to 64 from 600 up; restated here so
            // the tablet bar keeps the height the rest of the header is measured against.
            minHeight: HEADER_HEIGHT.sm,
            "--logo-y": `${HEADER_CENTRE.sm}px`,
            "--logo-x": "28px",
            "--nav-x": "40px",
          },
          [theme.breakpoints.up("md")]: {
            minHeight: HEADER_HEIGHT.md,
            "--logo-y": `${HEADER_CENTRE.md}px`,
            "--logo-x": "24px",
            "--nav-x": "48px",
          },
          transition: theme.transitions.create(["min-height"], {
            duration: theme.transitions.duration.short,
          }),
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          color: theme.palette.header.text,
        })}
      >
        {children}
      </Toolbar>
    </AppBar>
  );
}
