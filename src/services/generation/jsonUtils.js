// JSON extraction and validation helpers for GameGenerator
import { jsonrepair } from 'jsonrepair';

export function extractLargestJsonObject(text) {
  // Remove markdown code fences and triple backticks
  let cleanedText = text.replace(/```[a-zA-Z]*[\r\n]+/g, '').replace(/```/g, '');

  // Extract the largest curly-brace block first
  let best = null;
  let bestLength = 0;
  const stack = [];
  for (let i = 0; i < cleanedText.length; i++) {
    if (cleanedText[i] === '{') stack.push(i);
    if (cleanedText[i] === '}') {
      const start = stack.pop();
      if (start !== undefined) {
        const candidate = cleanedText.slice(start, i + 1);
        if (candidate.length > bestLength) {
          best = candidate;
          bestLength = candidate.length;
        }
      }
    }
  }
  if (!best) return null;

  // Preprocess: attempt to escape newlines and quotes in likely multi-line string fields
  let fixedText = best;
  const multilineFields = [
    'gameCode', 'cssStyles', 'rules', 'description', 'fallbackReason', 'rawLlamaOutput'
  ];
  for (const field of multilineFields) {
    // Match both comma and end-of-object after the field
    const regex = new RegExp(`("${field}"\\s*:\\s*")(.*?)("\\s*[},])`, 'gs');
    fixedText = fixedText.replace(regex, (match, p1, p2, p3) => {
      let fixedVal = p2.replace(/\\/g, '\\\\')
                       .replace(/\n/g, '\\n')
                       .replace(/\r/g, '')
                       .replace(/"/g, '\\"')
                       .replace(/\u2028|\u2029/g, '');
      fixedVal = fixedVal.replace(/\n/g, '\\n');
      return p1 + fixedVal + p3;
    });
  }

  // Try to repair the JSON using jsonrepair before parsing
  let repairedText = fixedText;
  try {
    repairedText = jsonrepair(fixedText);
  } catch (e) {
    // If repair fails, fallback to fixedText
  }

  // Try to parse the repaired text
  try {
    JSON.parse(repairedText);
    return repairedText;
  } catch (e) {
    console.error('Failed to parse candidate JSON:', repairedText);
    return null;
  }
}
