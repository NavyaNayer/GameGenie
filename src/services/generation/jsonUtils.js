// JSON extraction and validation helpers for GameGenerator

export function extractLargestJsonObject(text) {
  let best = null;
  let bestLength = 0;
  const stack = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') stack.push(i);
    if (text[i] === '}') {
      const start = stack.pop();
      if (start !== undefined) {
        const candidate = text.slice(start, i + 1);
        try {
          const parsed = JSON.parse(candidate);
          if (candidate.length > bestLength) {
            best = candidate;
            bestLength = candidate.length;
          }
        } catch (e) { /* not valid, skip */ }
      }
    }
  }
  return best;
}
