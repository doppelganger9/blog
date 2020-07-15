import { writable } from 'svelte/store';
/**
 * Dumb i18n
 *
 * How to use:
 *
 * In your component's <script> part:
 *     import { i18n } from '../stores/i18n.js';
 *
 * i18n is an ES6 template literals function.
 *
 * So in your component's HTML part:
 *    use {$i18n`key`}
 * or use {@html $i18n`key`} if your content has some markup.
 *
 * As it is a template literal, you can put placeholders in it:
 *    use {$i18n`${someVarValue}`}
 *
 * I don't know if it will be of any use, but there you have it.
 *
 **/

const langs = ['en', 'fr'];
const labelsByLang = {
  "en": {
    "title": "David's Blog",
    "built with": "built with",
    "and": "and",
    "Privacy Policy": "Privacy Policy",
    "article.footer.html": `Written by <strong>David Lacourt</strong> who lives in 
  <a href="https://en.wikipedia.org/wiki/Senlis">Senlis <span role="img" aria-label="Stag">🦌</span></a>, 
  works in Paris <span role="img" aria-label="France">🇫🇷</span>, 
  <span role="img" aria-label="Love">🧡</span>&nbsp;building things with code.`,
    "switch to English": "switch to English",
    "switch to French": "switch to French",
  },
  "fr": {
    "title": "Le Blog de David",
    "built with": "construit avec",
    "and": "et",
    "Privacy Policy": "Politique de Confidentialité",
    "article.footer.html": `Ecrit par <strong>David Lacourt</strong>, qui habite à 
  <a href="https://en.wikipedia.org/wiki/Senlis">Senlis <span role="img" aria-label="Stag">🦌</span></a>, 
  travaille à Paris <span role="img" aria-label="France">🇫🇷</span>, 
  <span role="img" aria-label="Love">🧡</span>&nbsp;construire des choses avec du code.`,
    "switch to English": "basculer en Anglais",
    "switch to French": "basculer en Français",
  }
};

export function switchLang(newLang) {
  if (langs.indexOf(newLang) < 0) {
    return;
  }
  lang.set(newLang);
  console.log(`i18n switching to "${newLang}"`);
  i18n.set(i18nTemplateLiteralCurried(newLang));
}

const DEFAULT_LANG = 'en';

const i18nTemplateLiteralCurried = (lang) => (literals, ...expressions) => {
  let safeXP = [...expressions, ''];
  return labelsByLang[lang][literals.map((literal, i) => literal + safeXP[i]).join('')];
}


console.log(`i18n defaulting to "${DEFAULT_LANG}"`);
export const lang = writable(DEFAULT_LANG);
export const i18n = writable(i18nTemplateLiteralCurried(DEFAULT_LANG));
