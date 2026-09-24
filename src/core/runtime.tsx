"use client";

import {
  BUILD_YEAR,
  createLanguageRuntime,
  createWebsiteRuntime,
} from "@ptlabTadej/sitegen-landing-core/runtime";

import { BASE_PATH, primaryLanguage } from "./static";

/*
 * The same preference the head bootstrap reads before first paint: its storage key carries
 * the deployment's base path, so two demos on one host do not share a saved language. The
 * React runtime has to write the key the bootstrap reads, or the choice survives only
 * through the legacy fallback.
 */
import { languagePreference } from "./language-startup";

const websiteRuntime = createWebsiteRuntime({
  primaryLanguage,
  basePath: BASE_PATH,
});

const languageRuntime = createLanguageRuntime({
  ...languagePreference,
  loadWebsiteJsonForLang: websiteRuntime.loadWebsiteJsonForLang,
});

export const {
  getWebsiteJson,
  loadWebsiteJsonForLang,
  getThemeSettings,
  getHome,
  getLegalSection,
  getAboutSection,
  getAboutItems,
  getExperienceSection,
  getExperienceItems,
  getTeamSection,
  getTeamItems,
  getPricingSection,
  getPricingItems,
  getCareersItems,
  getCareersSection,
  getServicesSection,
  getServiceItems,
  getPortfolioSection,
  getPortfolioItems,
  getReviewSection,
  getReviewItems,
  getBlogSection,
  getBlogItems,
  getGalleryItems,
  getCompany,
  getMap,
  getContacts,
  getWorkingHours,
  getWorkingHoursNote,
  getClients,
  getCatalogueSection,
  getVideoSection,
  getFaqSection,
  getEventsSection,
  getEventItems,
  getScheduleSection,
  getScheduleTables,
} = websiteRuntime;

export const {
  LanguageProvider,
  LanguageHtmlSetter,
  useLanguage,
  languageMap,
} = languageRuntime;

export { BUILD_YEAR };
export { getLocalized } from "@ptlabTadej/sitegen-landing-core";
export type {
  Career,
  ContactType,
  SupportedLang,
} from "@ptlabTadej/sitegen-landing-core/runtime";
