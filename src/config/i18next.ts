import i18n from "i18next";
import Backend from "i18next-http-backend";
import translationEn from "src/locales/en/translation.json";
import translationVn from "src/locales/vi/translation.json";
import { initReactI18next } from "react-i18next";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // // detect user language
  // // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  .init({
    resources: {
      en: {
        translation: translationEn,
      },
      vi: {
        translation: translationVn,
      },
    },
    fallbackLng: "vi",
    // defaultNS: ["vi"],
    react: {
      useSuspense: false, //   <---- this will do the magic
    },
  });

export default i18n;
