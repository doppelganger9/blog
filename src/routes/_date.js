export function processDate(metadata) {
    const date = new Date(metadata.date);
    const lang = metadata.lang || 'en';
    return date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
  