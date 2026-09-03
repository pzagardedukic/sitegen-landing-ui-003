/*
 * The header's geometry, in one place because two files need to agree on it.
 *
 * CENTRE is the line the logo and the navigation are both hung on: the middle of the hero's
 * hero card, which is inset 12/24/20 from the page edge. The light theme cuts a notch
 * into that corner for the logo; this one leaves the card whole and lays the logo on the
 * photograph, but keeps the same numbers so the header sits identically in both.
 * HEIGHT is twice that, so the same line is also the middle of the bar and nothing moves
 * when the transparent bar turns into a solid one on scroll.
 *
 * `Section` needs HEIGHT as well: a section jumped to by its anchor has to clear the bar,
 * and a scroll margin smaller than the bar leaves the top of the section behind it.
 */
export const HEADER_CENTRE = { xs: 44, sm: 65, md: 71 } as const;

export const HEADER_HEIGHT = {
  xs: HEADER_CENTRE.xs * 2,
  sm: HEADER_CENTRE.sm * 2,
  md: HEADER_CENTRE.md * 2,
} as const;

/** Bar plus a little air, so an anchored section does not start flush against it. */
export const ANCHOR_OFFSET = {
  xs: HEADER_HEIGHT.xs + 16,
  sm: HEADER_HEIGHT.sm + 16,
  md: HEADER_HEIGHT.md + 16,
} as const;
