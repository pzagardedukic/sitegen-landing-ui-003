export type ThemeFontSettings = {
  heading?: string | null;
  body?: string | null;
  banner?: string | null;
};

export type ThemeFontDescriptor = {
  id: string;
  family: string;
  href: string;
};

const normalizeFont = (value: string | null | undefined): string =>
  typeof value === "string" ? value.trim() : "";

export function themeFontDescriptors(
  fonts: ThemeFontSettings | undefined,
): ThemeFontDescriptor[] {
  const families = [fonts?.heading, fonts?.body, fonts?.banner]
    .map(normalizeFont)
    .filter(Boolean);

  return [...new Set(families)].map((family, index) => ({
    id: `sitegen-theme-font-${index}`,
    family,
    // Keep this identical to the existing runtime loader. The bootstrap runs
    // it before first paint instead of waiting for a React effect.
    href: `https://fonts.googleapis.com/css2?family=${family.replace(
      / /g,
      "+",
    )}:wght@300;400;500;600;700&display=swap`,
  }));
}

/** Must run as a normal inline head script, before the body can paint. */
export function createThemeFontBootstrapScript(
  fonts: ThemeFontSettings | undefined,
): string {
  const descriptors = JSON.stringify(themeFontDescriptors(fonts)).replace(
    /</g,
    "\\u003c",
  );
  return `(${fontBootstrap.toString()})(${descriptors});`;
}

// Keep this function self-contained: its compiled source is the head script.
function fontBootstrap(fonts: ThemeFontDescriptor[]) {
  const root = document.documentElement;
  if (!fonts.length) {
    root.dataset.sitegenFontsReady = "true";
    return;
  }

  root.setAttribute("data-sitegen-fonts-pending", "true");

  const guard = document.createElement("style");
  guard.id = "sitegen-font-guard";
  guard.textContent =
    "html[data-sitegen-fonts-pending] body{visibility:hidden!important}";
  document.head.appendChild(guard);

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    root.removeAttribute("data-sitegen-fonts-pending");
    root.dataset.sitegenFontsReady = "true";
    window.dispatchEvent(new Event("sitegen:fonts-ready"));
  };

  const fallback = window.setTimeout(finish, 8000);

  const ensureStylesheet = (font: ThemeFontDescriptor) =>
    new Promise<void>((resolve) => {
      let link = document.getElementById(font.id) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = font.id;
        link.rel = "stylesheet";
        link.href = font.href;
        link.dataset.sitegenFontFamily = font.family;
        document.head.appendChild(link);
      }

      if (link.sheet) {
        resolve();
        return;
      }

      const done = () => resolve();
      link.addEventListener("load", done, { once: true });
      link.addEventListener("error", done, { once: true });
    });

  const loadFaces = async () => {
    if (!("fonts" in document) || !document.fonts?.load) return;

    const weights = [300, 400, 500, 600, 700];
    await Promise.all(
      fonts.flatMap((font) =>
        weights.map((weight) =>
          document.fonts.load(
            `${weight} 1em "${font.family.replace(/"/g, '\\"')}"`,
          ),
        ),
      ),
    );
    await document.fonts.ready;
  };

  void Promise.all(fonts.map(ensureStylesheet))
    .then(loadFaces)
    .catch(() => undefined)
    .finally(() => {
      window.clearTimeout(fallback);
      finish();
    });
}
