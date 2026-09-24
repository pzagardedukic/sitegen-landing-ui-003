import type { ReactNode } from "react";
import {
  createWebsiteRuntime,
  BUILD_YEAR,
  languageMap,
} from "@ptlabTadej/sitegen-landing-core/runtime";
import type { WebsiteJson } from "@ptlabTadej/sitegen-landing-core/types";
import {
  BASE_PATH,
  primaryLanguage,
  supportedLanguages,
} from "../../src/core/static";

type Runtime = ReturnType<typeof createWebsiteRuntime>;
let current: Runtime;
export function configureSnapshotRuntime(website: WebsiteJson) {
  current = createWebsiteRuntime({
    primaryLanguage,
    basePath: BASE_PATH,
    initialWebsiteJson: website,
    fetchImpl: async () => {
      throw new Error("Snapshot rendering must not fetch runtime JSON");
    },
  });
}
export function useLanguage() {
  return {
    lang: primaryLanguage,
    defaultLanguage: primaryLanguage,
    languageList: supportedLanguages.map((code) => ({
      code,
      label: languageMap[code],
    })),
    setLang: async () => {},
  };
}
export function LanguageProvider({ children }: { children: ReactNode }) {
  return children;
}
export function LanguageHtmlSetter() {
  return null;
}
export { BUILD_YEAR, languageMap };
export { getLocalized } from "@ptlabTadej/sitegen-landing-core";
export type {
  Career,
  ContactType,
  SupportedLang,
} from "@ptlabTadej/sitegen-landing-core/runtime";

export const getWebsiteJson: Runtime["getWebsiteJson"] = (...args) =>
  current.getWebsiteJson(...args);
export const loadWebsiteJsonForLang: Runtime["loadWebsiteJsonForLang"] = (
  ...args
) => current.loadWebsiteJsonForLang(...args);
export const getThemeSettings: Runtime["getThemeSettings"] = (...args) =>
  current.getThemeSettings(...args);
export const getHome: Runtime["getHome"] = (...args) =>
  current.getHome(...args);
export const getLegalSection: Runtime["getLegalSection"] = (...args) =>
  current.getLegalSection(...args);
export const getAboutSection: Runtime["getAboutSection"] = (...args) =>
  current.getAboutSection(...args);
export const getAboutItems: Runtime["getAboutItems"] = (...args) =>
  current.getAboutItems(...args);
export const getExperienceSection: Runtime["getExperienceSection"] = (
  ...args
) => current.getExperienceSection(...args);
export const getExperienceItems: Runtime["getExperienceItems"] = (...args) =>
  current.getExperienceItems(...args);
export const getTeamSection: Runtime["getTeamSection"] = (...args) =>
  current.getTeamSection(...args);
export const getTeamItems: Runtime["getTeamItems"] = (...args) =>
  current.getTeamItems(...args);
export const getPricingSection: Runtime["getPricingSection"] = (...args) =>
  current.getPricingSection(...args);
export const getPricingItems: Runtime["getPricingItems"] = (...args) =>
  current.getPricingItems(...args);
export const getCareersItems: Runtime["getCareersItems"] = (...args) =>
  current.getCareersItems(...args);
export const getCareersSection: Runtime["getCareersSection"] = (...args) =>
  current.getCareersSection(...args);
export const getServicesSection: Runtime["getServicesSection"] = (...args) =>
  current.getServicesSection(...args);
export const getServiceItems: Runtime["getServiceItems"] = (...args) =>
  current.getServiceItems(...args);
export const getPortfolioSection: Runtime["getPortfolioSection"] = (...args) =>
  current.getPortfolioSection(...args);
export const getPortfolioItems: Runtime["getPortfolioItems"] = (...args) =>
  current.getPortfolioItems(...args);
export const getReviewSection: Runtime["getReviewSection"] = (...args) =>
  current.getReviewSection(...args);
export const getReviewItems: Runtime["getReviewItems"] = (...args) =>
  current.getReviewItems(...args);
export const getBlogSection: Runtime["getBlogSection"] = (...args) =>
  current.getBlogSection(...args);
export const getBlogItems: Runtime["getBlogItems"] = (...args) =>
  current.getBlogItems(...args);
export const getGalleryItems: Runtime["getGalleryItems"] = (...args) =>
  current.getGalleryItems(...args);
export const getCompany: Runtime["getCompany"] = (...args) =>
  current.getCompany(...args);
export const getMap: Runtime["getMap"] = (...args) => current.getMap(...args);
export const getContacts: Runtime["getContacts"] = (...args) =>
  current.getContacts(...args);
export const getWorkingHours: Runtime["getWorkingHours"] = (...args) =>
  current.getWorkingHours(...args);
export const getWorkingHoursNote: Runtime["getWorkingHoursNote"] = (...args) =>
  current.getWorkingHoursNote(...args);
export const getClients: Runtime["getClients"] = (...args) =>
  current.getClients(...args);
export const getCatalogueSection: Runtime["getCatalogueSection"] = (...args) =>
  current.getCatalogueSection(...args);
export const getVideoSection: Runtime["getVideoSection"] = (...args) =>
  current.getVideoSection(...args);
export const getFaqSection: Runtime["getFaqSection"] = (...args) =>
  current.getFaqSection(...args);
export const getEventsSection: Runtime["getEventsSection"] = (...args) =>
  current.getEventsSection(...args);
export const getEventItems: Runtime["getEventItems"] = (...args) =>
  current.getEventItems(...args);
export const getScheduleSection: Runtime["getScheduleSection"] = (...args) =>
  current.getScheduleSection(...args);
export const getScheduleTables: Runtime["getScheduleTables"] = (...args) =>
  current.getScheduleTables(...args);
