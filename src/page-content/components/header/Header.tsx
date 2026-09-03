"use client";

import { getHome } from "@/core/runtime";
import LanguageSelector from "@/components/language-selector/LanguageSelector";
import HeaderNavigation from "@/components/navigation/HeaderNavigation";
import { Box, Divider } from "@mui/material";
import { SupportedLang, useLanguage } from "@/core/runtime";
import { getNavigationTranslation } from "@/core/translations";
import { getPageSlugByKeyWithBasePath, isSectionEnabled } from "@/core/static";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import { withBasePath } from "@/core/static";

export default function Header() {
  const { lang, setLang, languageList } = useLanguage();
  const navTranslation = getNavigationTranslation(lang);
  const home = getHome(lang);
  const isMobile = useIsMobileDevice();

  const navItems = [
    { label: navTranslation.home, href: withBasePath("/") },
    {
      label: navTranslation.about,
      href: getPageSlugByKeyWithBasePath("about"),
    },
    {
      label: navTranslation.more,
      subItems: [
        {
          label: navTranslation.contact,
          href: getPageSlugByKeyWithBasePath("contact"),
        },
        isSectionEnabled("services") && {
          label: navTranslation.services,
          href: getPageSlugByKeyWithBasePath("services"),
        },
        isSectionEnabled("schedule") && {
          label: navTranslation.schedule,
          href: getPageSlugByKeyWithBasePath("schedule"),
        },
        isSectionEnabled("events") && {
          label: navTranslation.events,
          href: getPageSlugByKeyWithBasePath("events"),
        },
        isSectionEnabled("faq") && {
          label: navTranslation.faq,
          href: getPageSlugByKeyWithBasePath("faq"),
        },
        isSectionEnabled("portfolio") && {
          label: navTranslation.portfolio,
          href: getPageSlugByKeyWithBasePath("portfolio"),
        },
        isSectionEnabled("gallery") && {
          label: navTranslation.gallery,
          href: getPageSlugByKeyWithBasePath("gallery"),
        },
        isSectionEnabled("blog") && {
          label: navTranslation.blog,
          href: getPageSlugByKeyWithBasePath("blog"),
        },
        isSectionEnabled("videos") && {
          label: navTranslation.videos,
          href: getPageSlugByKeyWithBasePath("videos"),
        },
        isSectionEnabled("catalogues") && {
          label: navTranslation.catalogues,
          href: getPageSlugByKeyWithBasePath("catalogues"),
        },
        isSectionEnabled("pricing") && {
          label: navTranslation.pricing,
          href: getPageSlugByKeyWithBasePath("pricing"),
        },
        isSectionEnabled("careers") && {
          label: navTranslation.careers,
          href: getPageSlugByKeyWithBasePath("careers"),
        },
      ].filter(Boolean) as { label: string; href: string }[],
    },
  ];

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      alignItems="center"
      // The logo is positioned on the bar itself, so only the navigation is in this row.
      justifyContent="flex-end"
    >
      {/* Left: Logo, hung on the notch rather than on this row */}
      {home.logo.image ? (
        <LogoImage imageSrc={home.logo.image} name={home.name} />
      ) : (
        <LogoText name={home.name} />
      )}

      {/* Right: Navigation and, when the site has more than one, the language selector */}
      <Box
        sx={(theme) => ({
          /*
           * Hung on the bar like the logo, not carried in the row. In the row it centred
           * on the bar, which is not the middle of the white notch, so it sat higher than
           * the logo across from it. Same `--logo-y`, same centre line.
           */
          position: "fixed",
          top: "var(--logo-y)",
          right: "var(--nav-x)",
          transform: "translateY(-50%)",
          transition: theme.transitions.create(["top"], {
            duration: theme.transitions.duration.short,
          }),
          display: "flex",
          flexDirection: isMobile ? "row-reverse" : "row",
          alignItems: "center",
          // 36px margins leave ~318px on a 390 screen; a 32px gap plus a divider
          // pushed the menu button off the edge there.
          gap: { xs: 1, md: 3 },
          flexShrink: 0,
        })}
      >
        <HeaderNavigation items={navItems} />

        {languageList.length > 1 && (
          <>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "currentColor",
                opacity: 0.4,
              }}
            />

            <LanguageSelector
              supportedLanguages={languageList}
              defaultLanguage={lang as string}
              onChange={(code) => setLang(code as SupportedLang)}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
