"use client";

import {
  BUILD_YEAR,
  createLanguageRuntime,
  createWebsiteRuntime,
} from "@ptlabTadej/sitegen-landing-core/runtime";

import {
  BASE_PATH,
  primaryLanguage,
  supportedLanguages,
} from "./static";

const websiteRuntime = createWebsiteRuntime({
  primaryLanguage,
  basePath: BASE_PATH,
});

const languageRuntime = createLanguageRuntime({
  primaryLanguage,
  supportedLanguages,
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
