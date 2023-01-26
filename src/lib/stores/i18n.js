import { writable } from 'svelte/store';

/**
 * Dumb i18n
 *
 * How to use:
 *
 * In your component's <script> part:
 *     import { i18n } from '$lib/stores/i18n.js';
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
let labelsByLang = {
  "en": {
    "title": "David's Blog",
    "built with": "built with",
    "and": "and",
    "Privacy Policy": "Privacy Policy",
    "article.footer.html": `Written by <strong>David Lacourt</strong> who lives in 
  <a href="https://en.wikipedia.org/wiki/Senlis">Senlis <span role="img" aria-label="Stag">🦌</span></a>, 
  works in Paris <span role="img" aria-label="France">🇫🇷</span>, 
  <span role="img" aria-label="Love">🧡</span>&nbsp;building things with code.`,
    "label.encode.base64": "Type here to encode in Base64 (btoa)",
    "label.decode.base64": "Type here to decode from Base64 (atob)",
    "decoded.text.base64url": "Decoded text is in the Base64URL format",
    "encode.using.base64url": "Encode using Base64URL format",
    // JSONFormatter
    "label.json.textarea": "Type here some JSON Data to pretty-print",
    "button.format.json": "Pretty print JSON Data now!",
    "label.tab.size": "Tab size:",
    // URI Components De/Encoder
    "label.encode.uricomponents":"Type here to encode URI Components",
    "label.decode.uricomponents":"Type here to decode URI Components",

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
    // Base64Tool
    "label.encode.base64": "Ici, mettez le texte à encoder en Base64 (btoa)",
    "label.decode.base64": "Ici, mettez le Base64 à décoder en texte (atob)",
    "decoded.text.base64url": "Le texte décodé est au format Base64URL",
    "encode.using.base64url": "Encoder avec le format Base64URL",
    // JSONFormatter
    "label.json.textarea": "Ici, mettez des données JSON à formatter",
    "button.format.json": "Formatter le JSON maintenant",
    "label.tab.size": "Taille des tabulations :",
    // URI Components De/Encoder
    "label.encode.uricomponents": "Mettez ici le texte à encoder en URI Components",
    "label.decode.uricomponents": "Mettez ici le texte à décoder en URI Components",
  }
};

/**
 * Use it in some Svelte component to add more labels locally.
 * Or in another JS file, whatever, as long as it is not above.
 */
export function registerMoreLabels(labelsByLangToAdd) {
  let newLabels = {};
  for(let l of langs) {
    newLabels[l] = {
      ...labelsByLang[l],
      ...labelsByLangToAdd[l]
    };
  }
  labelsByLang = newLabels;
}

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
  const originalString = literals.map((literal, i) => literal + safeXP[i]).join('');
  const res = labelsByLang[lang][originalString];
  if (!res) {
    console.warn('i18n missing for '+ lang, originalString);
  }
  return res ? res : originalString;
}

console.log(`i18n defaulting to "${DEFAULT_LANG}"`);
export const lang = writable(DEFAULT_LANG);
export const i18n = writable(i18nTemplateLiteralCurried(DEFAULT_LANG));
