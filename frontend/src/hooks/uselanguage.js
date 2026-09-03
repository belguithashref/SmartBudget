import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext.js";

export function useLanguage() {
  return useContext(LanguageContext);
}
