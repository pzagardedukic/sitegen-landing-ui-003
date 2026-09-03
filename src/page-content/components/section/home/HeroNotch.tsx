import { Box } from "@mui/material";

/*
 * The white notch in the hero card's top-left corner, with the two concave fillets that
 * carry it back into the card edge. Copied from the Aiero reference the design system is
 * derived from: 350x102 with a 25px radius on the top-left and bottom-right, and 24x23
 * fillets to its right and below it.
 *
 * The fillets are quarter-circle cut-outs rather than shapes: a white square with a
 * transparent circle bitten out of its far corner reads as the notch curving away.
 * The site header sits over this, which is why the notch is light — a customer's logo is
 * usually dark artwork and would disappear against the photograph otherwise.
 *
 * It is a sibling of the card, not a child of it, and it positions itself against the
 * section's padding — that is what CARD_INSET is. Inside the card it was clipped by the
 * card's own `overflow: hidden`, which cut it on exactly the curve it was meant to cover:
 * the card's dark edge and the white notch then carried the same antialiasing coverage,
 * the notch could only paint over that fraction of it, and what was left read as a thin
 * grey arc across the corner. Outside the clip it can overhang the card by a pixel and
 * cover the edge outright.
 */
const CARD_INSET = { xs: 12, sm: 24, md: 20 };
const OVERHANG = 1;

const shift = (steps: Record<string, number>, by: number) =>
  Object.fromEntries(Object.entries(steps).map(([key, value]) => [key, value + by]));

export default function HeroNotch() {
  const width = { xs: 190, sm: 260, md: 350 };
  const height = { xs: 64, sm: 82, md: 102 };
  const fillet = { xs: 16, sm: 20, md: 24 };
  const radius = { xs: 14, sm: 20, md: 25 };

  const filletSx = (theme: import("@mui/material/styles").Theme) => ({
    position: "absolute" as const,
    width: fillet,
    height: fillet,
    background: `radial-gradient(circle at 100% 100%, transparent 0, transparent ${fillet.md - 1}px, ${theme.palette.background.default} ${fillet.md}px)`,
    [theme.breakpoints.down("sm")]: {
      background: `radial-gradient(circle at 100% 100%, transparent 0, transparent ${fillet.xs - 1}px, ${theme.palette.background.default} ${fillet.xs}px)`,
    },
    [theme.breakpoints.only("sm")]: {
      background: `radial-gradient(circle at 100% 100%, transparent 0, transparent ${fillet.sm - 1}px, ${theme.palette.background.default} ${fillet.sm}px)`,
    },
  });

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: shift(CARD_INSET, -OVERHANG),
        left: shift(CARD_INSET, -OVERHANG),
        zIndex: 2,
      }}
    >
      {/*
        The overhang is added to the top-left corner only — one pixel out and one pixel of
        extra radius, so the curve sits just outside the card's identical curve — and taken
        back out of the width and the height, so the notch keeps its drawn size and the
        fillets land where they were.
      */}
      <Box
        sx={(theme) => ({
          width: shift(width, OVERHANG),
          height: shift(height, OVERHANG),
          backgroundColor: theme.palette.background.default,
          borderTopLeftRadius: shift(radius, OVERHANG),
          borderBottomRightRadius: radius,
        })}
      />

      {/* to the right of the notch */}
      <Box
        sx={(theme) => ({
          ...filletSx(theme),
          top: OVERHANG,
          left: shift(width, OVERHANG),
        })}
      />

      {/* below the notch */}
      <Box
        sx={(theme) => ({
          ...filletSx(theme),
          top: shift(height, OVERHANG),
          left: OVERHANG,
        })}
      />
    </Box>
  );
}
