/**
 * preprocessContent — Preprocess LLM content for markdown rendering.
 *
 * Minimal preprocessing — the heavy lifting is done by remark-math-extended
 * which natively supports $, $$, \(...\), and \[...\] delimiters.
 *
 * This function only handles:
 * 1. Restore LaTeX backslashes corrupted by double JSON.parse
 * 2. Convert literal \n from old DB data to real newlines
 * 3. Escape dollar-number patterns ($100) so they aren't parsed as math
 *
 * @param {string} content - Raw content from DB or agent
 * @returns {string} - Preprocessed content ready for react-markdown
 */
export function preprocessContent(content) {
  if (!content) return content;

  let text = content;

  // 1. Restore LaTeX backslashes corrupted by double JSON.parse.
  //    MUST run BEFORE literal \n/\t conversion, otherwise \nabla → newline+abla
  text = text
    .replace(/\f(rac|lat|orall|loor)/g, '\\f$1')
    .replace(/\t(imes|ext|heta|au|ilde|riangle)/g, '\\t$1')
    .replace(/\x08(egin|eta|ar|ig|inom|ullet)/g, '\\b$1')
    .replace(/\r(ho|ight|angle|ceil|floor)/g, '\\r$1');

  // 2. Literal \n → real newlines (for old DB data with double-escaped sequences).
  //    Negative lookahead: don't convert when followed by lowercase letter
  //    (preserves \nabla, \nu, \ne, \not, \newcommand, etc.)
  text = text.replace(/\\n(?![a-z])/g, '\n');
  text = text.replace(/\\t(?![a-z])/g, '\t');

  // 3. Fix bare delimiters: agent outputs ( formula ) and [ formula ] without backslash.
  //    Convert to \(...\) and \[...\] so MathJax can render them.
  //    Only convert if content inside looks like LaTeX (has \cmd, ^, _, {}).
  //    Skip code blocks. Process line-by-line to avoid backtracking.
  text = fixBareDelimiters(text);

  // 4. Escape $<number> patterns to prevent "$100" being parsed as math
  //    Skip code blocks (fenced and inline)
  //    Ref: LobeChat escapeDollarNumber()
  text = text.replace(
    /(```[\s\S]*?```|`[^`]*`)|\$(\d)/g,
    (match, codeBlock, digit) => {
      if (codeBlock) return codeBlock;
      if (digit !== undefined) return `\\$${digit}`;
      return match;
    }
  );

  return text;
}

/**
 * Fix bare ( formula ) and [ formula ] delimiters missing backslashes.
 * Agent sometimes outputs `( \frac{a}{b} )` instead of `\( \frac{a}{b} \)`.
 *
 * Handles:
 *   [ formula ]       → \[ formula \]   (display, whole line)
 *   [formula]          → \[formula\]     (display, no space)
 *   [formula           → \[formula       (unclosed, wrap to end of line)
 *   ( formula )        → \( formula \)   (inline, may have nested parens)
 *
 * Only converts if content contains LaTeX indicators: \cmd, {}, ^, _, π, ×, etc.
 */
const LATEX_INDICATOR = /\\[a-zA-Z]+|[{}^_]|[π×∞∑∫∂≈≠≤≥]/;

function fixBareDelimiters(text) {
  let inCodeBlock = false;
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Step A: normalize single-backslash math delimiters to double-backslash so
    // they survive CommonMark's punctuation-escape pass (\( is parsed as
    // literal `(`, stripping the backslash — MathJax then never sees it).
    // Writing `\\(` in the markdown source yields `\(` in the rendered HTML,
    // which MathJax recognizes. Negative lookbehind prevents double-doubling.
    lines[i] = lines[i]
      .replace(/(?<!\\)\\\(/g, '\\\\(')
      .replace(/(?<!\\)\\\)/g, '\\\\)')
      .replace(/(?<!\\)\\\[/g, '\\\\[')
      .replace(/(?<!\\)\\\]/g, '\\\\]');

    // Skip lines already having proper \\[ \\] or $$ delimiters
    if (/\\\\\[|\\\\\]|\$\$/.test(lines[i])) continue;

    const trimmed = lines[i].trim();

    // --- Display math: whole line is [ formula ] with depth counting ---
    if (/^\[/.test(trimmed)) {
      const converted = tryConvertDisplayBracket(trimmed);
      if (converted) {
        lines[i] = converted;
        continue; // Don't process inline on converted display lines
      }
    }

    // --- Inline brackets: [formula] mid-line (e.g. after (\blacksquare)) ---
    if (lines[i].includes('[') && !/\\\\\[/.test(lines[i])) {
      lines[i] = lines[i].replace(
        /(?<!\\)\[([^\[\]]+)\]/g,
        (match, inner) => {
          if (LATEX_INDICATOR.test(inner)) return `\\\\[${inner.trim()}\\\\]`;
          return match;
        }
      );
    }

    // --- Inline math: bare (...) containing LaTeX ---
    // Skip if line already has \\( (properly delimited) or was just converted
    if (lines[i].includes('(') && !/\\\\\(/.test(lines[i]) && LATEX_INDICATOR.test(lines[i])) {
      lines[i] = fixInlineBareMath(lines[i]);
    }
  }

  return lines.join('\n');
}

/**
 * Try to convert a line starting with [ into \[...\] display math.
 * Uses bracket depth counting to find the matching ].
 * Handles \left[ and \right] as part of the formula (not delimiters).
 * Returns converted string or null if not a formula.
 */
function tryConvertDisplayBracket(line) {
  if (!line.startsWith('[')) return null;

  // Find matching ] using depth counting, treating \left[ and \right] as non-delimiters
  let depth = 0;
  let end = -1;

  for (let j = 0; j < line.length; j++) {
    // Skip \left[ and \right] — they're part of the formula
    if (line.slice(j).startsWith('\\left[') || line.slice(j).startsWith('\\left(')) {
      j += 5; // skip past \left + bracket
      continue;
    }
    if (line.slice(j).startsWith('\\right]') || line.slice(j).startsWith('\\right)')) {
      j += 6; // skip past \right + bracket
      continue;
    }

    if (line[j] === '[') depth++;
    else if (line[j] === ']') {
      depth--;
      if (depth === 0) { end = j; break; }
    }
  }

  let inner;
  if (end > 0) {
    // Found matching ] — check nothing meaningful after it
    const after = line.slice(end + 1).trim();
    if (after.length > 0) return null; // Text after ] — not a display formula
    inner = line.slice(1, end).trim();
  } else {
    // No matching ] — unclosed, wrap to end of line
    inner = line.slice(1).trim();
  }

  if (!inner || !LATEX_INDICATOR.test(inner)) return null;
  return `\\\\[${inner}\\\\]`;
}

/**
 * Fix inline bare ( formula ) in a single line.
 * Uses paren depth counting to handle nested parens like (3.00 \times 10^8)^2.
 */
function fixInlineBareMath(line) {
  const result = [];
  let pos = 0;

  while (pos < line.length) {
    const openIdx = line.indexOf('(', pos);
    if (openIdx === -1) {
      result.push(line.slice(pos));
      break;
    }

    // Push text before the (
    result.push(line.slice(pos, openIdx));

    // Find matching ) respecting depth
    let depth = 1;
    let j = openIdx + 1;
    while (j < line.length && depth > 0) {
      if (line[j] === '(') depth++;
      else if (line[j] === ')') depth--;
      j++;
    }

    if (depth === 0) {
      // Found matching )
      const inner = line.slice(openIdx + 1, j - 1).trim();
      if (LATEX_INDICATOR.test(inner)) {
        result.push(`\\\\(${inner}\\\\)`);
      } else {
        result.push(line.slice(openIdx, j));
      }
      pos = j;
    } else {
      // Unmatched ( — just push it
      result.push(line.slice(openIdx));
      break;
    }
  }

  return result.join('');
}
