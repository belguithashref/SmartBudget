// @ts-nocheck
import { useState } from "react";

import en from "../i18n/en";
import fr from "../i18n/fr";

import { LanguageContext } from "./LanguageContext.js";

const translations = {
  en,
  fr,
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") === "fr" ? "fr" : "en",
  );

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key) => {
    const languageTranslations = translations[language];

    return languageTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
