import {
  createLanguageStorageKey,
  createLanguageBootstrapScript,
} from "@ptlabTadej/sitegen-landing-core/language";
import { BASE_PATH, primaryLanguage, supportedLanguages } from "./static";

export const languagePreference = {
  primaryLanguage,
  supportedLanguages,
  storageKey: createLanguageStorageKey(BASE_PATH),
  legacyStorageKey: "site_language",
};
export const languageBootstrapScript =
  createLanguageBootstrapScript(languagePreference);
export { markContentReady } from "@ptlabTadej/sitegen-landing-core/language";
