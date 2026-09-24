import React, { type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createPreviewTheme } from "@/app/theme/utils/createPreviewTheme";
import { configureSnapshotRuntime, getThemeSettings } from "./runtime";
import { setSnapshotPath } from "./navigation";
import type { WebsiteJson } from "@ptlabTadej/sitegen-landing-core/types";
import type {
  SnapshotRoute,
  SnapshotWebsite,
} from "../../src/core/snapshot-model";

import Home from "@/page-content/pages/home/Home";
import About from "@/page-content/pages/about/About";
import Contact from "@/page-content/pages/contact/Contact";
import Services from "@/page-content/pages/services/Services";
import Portfolio from "@/page-content/pages/portfolio/Portfolio";
import PortfolioItem from "@/page-content/pages/portfolio/PortfolioItem";
import Pricing from "@/page-content/pages/pricing/Pricing";
import PricingItem from "@/page-content/pages/pricing/PricingItem";
import Blog from "@/page-content/pages/blog/Blog";
import BlogPost from "@/page-content/pages/blog/BlogPost";
import Careers from "@/page-content/pages/careers/Careers";
import Career from "@/page-content/pages/careers/Career";
import Events from "@/page-content/pages/events/Events";
import Event from "@/page-content/pages/events/Event";
import Gallery from "@/page-content/pages/gallery/Gallery";
import Legal from "@/page-content/pages/legal/Legal";
import Videos from "@/page-content/pages/videos/Videos";
import Catalogues from "@/page-content/pages/catalogues/Catalogues";
import Schedule from "@/page-content/pages/schedule/Schedule";
import Faq from "@/page-content/pages/faq/FaqPage";
import NotFound from "@/page-content/pages/not-found/NotFound";

const pages: Record<string, ComponentType> = {
  home: Home,
  about: About,
  contact: Contact,
  services: Services,
  portfolio: Portfolio,
  pricing: Pricing,
  blog: Blog,
  careers: Careers,
  events: Events,
  gallery: Gallery,
  legal: Legal,
  videos: Videos,
  catalogues: Catalogues,
  schedule: Schedule,
  faq: Faq,
  "not-found": NotFound,
};
const details: Record<string, ComponentType<{ slug: string }>> = {
  portfolio: PortfolioItem,
  pricing: PricingItem,
  blog: BlogPost,
  careers: Career,
  events: Event,
};

/** Uses the actual UI components. Only primary content is rendered, sequentially. */
export function renderPrimarySnapshot(
  site: SnapshotWebsite,
  route: SnapshotRoute,
  basePath: string,
): string {
  configureSnapshotRuntime(site as unknown as WebsiteJson);
  setSnapshotPath(`${basePath}${route.path}`);
  // A separate Emotion key prevents disposal of the snapshot's styles from
  // interfering with the live application's own Emotion cache.
  const cache = createCache({ key: "sgsnapshot" });
  const theme = createPreviewTheme(getThemeSettings());
  const Detail = details[route.page];
  const Page = pages[route.page];
  if (!Page) throw new Error(`Unknown snapshot page: ${route.page}`);
  const markup = renderToStaticMarkup(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {route.slug && Detail ? <Detail slug={route.slug} /> : <Page />}
      </ThemeProvider>
    </CacheProvider>,
  );
  if (!markup.includes("<main"))
    throw new Error(`Snapshot has no main content: ${route.path}`);
  if (/<script\b/i.test(markup))
    throw new Error(`Executable script in snapshot: ${route.path}`);
  return markup;
}
