/**
 * extractAnswer — Extracts raw answer text from any agent response shape.
 *
 * The agent API has no stable contract and can return data in several formats:
 *
 *   { final_answer: { answer_text: "..." } }       — object
 *   { final_answer: '{"answer_text":"..."}' }       — JSON string
 *   { final_answer: "plain markdown" }              — plain string
 *   { answer: "..." }                               — top-level
 *   { report: "..." }                               — top-level
 *
 * Returns raw text as-is — no transformations applied.
 * All display transformations happen in AIMessage.jsx at render time.
 *
 * @param {object} data - Parsed JSON from agent API
 * @returns {string|null} - Raw text, or null
 */
export function extractAnswer(data) {
  if (!data || typeof data !== 'object') return null;

  const { final_answer, answer, report } = data;

  // 1. final_answer is an object with answer_text or answer
  if (final_answer && typeof final_answer === 'object') {
    return final_answer.answer_text || final_answer.answer || null;
  }

  // 2. final_answer is a string (could be JSON or plain markdown)
  if (final_answer && typeof final_answer === 'string') {
    const trimmed = final_answer.trim();
    if (trimmed.startsWith('{')) {
      try {
        const inner = JSON.parse(trimmed);
        if (typeof inner === 'object' && inner !== null) {
          const text = inner.answer_text || inner.answer || null;
          if (text) return text;
        }
      } catch {
        // Not valid JSON — use as plain text
      }
    }
    return final_answer;
  }

  // 3. Top-level fallbacks
  if (typeof answer === 'string') return answer;
  if (typeof report === 'string') return report;

  return null;
}

/**
 * Check if the agent response indicates research is still in progress.
 *
 * @param {object} data - Parsed JSON from agent API
 * @returns {boolean}
 */
export function isResearchPending(data) {
  const s = data?.status;
  return s === 'running' || s === 'in_progress' || s === 'pending';
}
