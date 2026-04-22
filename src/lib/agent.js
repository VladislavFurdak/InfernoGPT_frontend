/**
 * Server-side helper for communicating with the research agent.
 * Token never leaves the server.
 */
export function getAgentUrl() {
  return process.env.AGENT_API_URL;
}

export function getAgentHeaders(extra = {}) {
  const token = process.env.AGENT_API_TOKEN;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}
