const loadedFonts = new Set<string>();

export function loadGoogleFont(font: string | null | undefined) {
  if (!font) return;

  const normalized = font.trim();
  if (loadedFonts.has(normalized)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${normalized.replace(
    / /g,
    "+",
  )}:wght@300;400;500;600;700&display=swap`;

  document.head.appendChild(link);
  loadedFonts.add(normalized);
}
