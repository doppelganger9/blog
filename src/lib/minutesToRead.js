// number of words is precomputed in mdsvex/remark pipeline
export function computeMinutesToRead(nbWords = 0, wpm = 180, lang = 'en') {
  const timeTaken = Math.round(nbWords / wpm);
  return lang === 'fr' 
    ? (timeTaken ? `environ ${timeTaken} min de lecture` : `moins d'une minute`)
    : (timeTaken ? `about ${timeTaken} min read` : 'less than a min read');
};
