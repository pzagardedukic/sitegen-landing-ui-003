"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { LanguageProvider } from "@/core/runtime";
import { LanguageHtmlSetter } from "@/core/runtime";
import { createPreviewTheme } from "@/app/theme/utils/createPreviewTheme";
import { loadGoogleFont } from "@/app/theme/utils/loadGoogleFont";
import { getThemeSettings } from "@/core/runtime";
import { PreviousLocationProvider } from "@/core/react";

type PreviewThemeParams = {
  primary: string | null;
  secondary: string | null;
  text: string | null;
  fontHeading: string | null;
  fontBody: string | null;
  fontBanner: string | null;
};

type ThemeEditorPayload = PreviewThemeParams & {
  banner?: string | null;
};

const STORAGE_KEY = "theme-editor-payload";

const defaultParams: PreviewThemeParams = {
  primary: null,
  secondary: null,
  text: null,
  fontHeading: null,
  fontBody: null,
  fontBanner: null,
};

const toThemeParams = (
  payload: Partial<ThemeEditorPayload>,
): PreviewThemeParams => ({
  primary: payload.primary || null,
  secondary: payload.secondary || null,
  text: payload.text || null,
  fontHeading: payload.fontHeading || null,
  fontBody: payload.fontBody || null,
  fontBanner: payload.fontBanner || null,
});

const isResetPayload = (payload: Partial<ThemeEditorPayload>) =>
  Object.values(payload).every(
    (value) => value === null || value === "" || value === undefined,
  );

function EditorThemeProvider({
  params,
  children,
}: {
  params: PreviewThemeParams;
  children: React.ReactNode;
}) {
  const resolvedThemeSettings = useMemo(() => {
    const jsonTheme = getThemeSettings();

    return {
      colors: {
        ...jsonTheme.colors,
        ...(params.primary && { primary: params.primary }),
        ...(params.secondary && { secondary: params.secondary }),
        ...(params.text && { text: params.text }),
      },
      fonts: {
        ...jsonTheme.fonts,
        ...(params.fontHeading && { heading: params.fontHeading }),
        ...(params.fontBody && { body: params.fontBody }),
        ...(params.fontBanner && { banner: params.fontBanner }),
      },
      images: {
        ...jsonTheme.images,
      },
    };
  }, [params]);

  const theme = useMemo(
    () => createPreviewTheme(resolvedThemeSettings),
    [resolvedThemeSettings],
  );

  useEffect(() => {
    loadGoogleFont(resolvedThemeSettings.fonts.heading);
    loadGoogleFont(resolvedThemeSettings.fonts.body);
    loadGoogleFont(resolvedThemeSettings.fonts.banner);
  }, [
    resolvedThemeSettings.fonts.heading,
    resolvedThemeSettings.fonts.body,
    resolvedThemeSettings.fonts.banner,
  ]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [params, setParams] = useState<PreviewThemeParams>(defaultParams);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const payload = JSON.parse(saved) as ThemeEditorPayload;

      setParams(toThemeParams(payload));

      window.dispatchEvent(
        new CustomEvent("theme-editor-banner-update", {
          detail: payload.banner || "",
        }),
      );
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "THEME_EDITOR_UPDATE") return;

      const payload = (event.data.payload ?? {}) as ThemeEditorPayload;

      if (isResetPayload(payload)) {
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      setParams(toThemeParams(payload));

      window.dispatchEvent(
        new CustomEvent("theme-editor-banner-update", {
          detail: payload.banner || "",
        }),
      );
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <LanguageProvider>
      <EditorThemeProvider params={params}>
        <CssBaseline />
        <LanguageHtmlSetter />
        <Suspense fallback={null}>
          <PreviousLocationProvider>{children}</PreviousLocationProvider>
        </Suspense>
      </EditorThemeProvider>
    </LanguageProvider>
  );
}
