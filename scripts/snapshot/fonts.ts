/**
 * Next's font compiler is not run during META rendering.
 *
 * These names are this theme's own: ui-002 sets headings in Sora and everything else in
 * Manrope (see `src/app/theme/fonts.ts`). The bundle resolves `next/font/google` to this
 * file, so a family imported there and missing here fails the standalone build rather than
 * falling back quietly.
 */
const font =
  (name: string) =>
  (options: { variable?: string } = {}) => ({
    style: { fontFamily: `'${name}', sans-serif` },
    variable: options.variable || "",
    className: "",
  });
export const Sora = font("Sora");
export const Manrope = font("Manrope");
