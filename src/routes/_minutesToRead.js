export function computeMinutesToRead(text = '', wpm = 180) {
  const timeTaken = Math.round(text.split(' ').length / wpm);
  return `${timeTaken || 'less than a min read'}${!!timeTaken ? ' min read' : ''}`;
};
