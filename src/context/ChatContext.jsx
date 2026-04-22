'use client';

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isResearchPending } from '../lib/extractAnswer';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { token, email, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [selectedModel, setSelectedModel] = useState('deep-research');
  // Per-conversation streaming state: { [chatId]: { typing, content, steps } }
  const [streamingState, setStreamingState] = useState({});
  const scrollPositionsRef = useRef({});
  const activeRunsRef = useRef({}); // { [chatId]: run_id }
  const abortControllersRef = useRef({}); // { [chatId]: AbortController }
  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const messages = useMemo(
    () => (activeConversationId ? allMessages[activeConversationId] || [] : []),
    [allMessages, activeConversationId]
  );

  // Derive current conversation's streaming state
  const activeStream = streamingState[activeConversationId] || {};
  // isTyping = true if ANY chat is streaming (prevents concurrent research)
  const isTyping = Object.values(streamingState).some(s => s?.typing) || false;
  const streamingContent = activeStream.content || '';
  const streamingSteps = activeStream.steps || [];

  // Per-chat streaming state helpers
  const setTyping = useCallback((chatId, val) => {
    setStreamingState(prev => ({
      ...prev,
      [chatId]: { ...prev[chatId], typing: val },
    }));
  }, []);
  const setContent = useCallback((chatId, val) => {
    setStreamingState(prev => ({
      ...prev,
      [chatId]: { ...prev[chatId], content: val },
    }));
  }, []);
  const setSteps = useCallback((chatId, val) => {
    setStreamingState(prev => ({
      ...prev,
      [chatId]: { ...prev[chatId], steps: val },
    }));
  }, []);
  const clearStream = useCallback((chatId) => {
    setStreamingState(prev => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
  }, []);

  // ── Server-authoritative data fetchers ──────────────────────────────

  const refetchConversations = useCallback(async () => {
    const res = await fetch('/api/chats', { headers: authHeaders });
    const data = await res.json();
    if (data.chats) {
      setConversations(data.chats.map(c => ({
        id: c.id,
        title: c.title,
        date: c.created_at?.split('T')[0],
      })));
    }
  }, [authHeaders]);

  const refetchMessages = useCallback(async (chatId) => {
    const res = await fetch(`/api/chats/${chatId}`, { headers: authHeaders });
    const data = await res.json();
    if (data.messages) {
      setAllMessages(prev => ({
        ...prev,
        [chatId]: data.messages,
      }));
    }
    return data.pendingRunId || null;
  }, [authHeaders]);

  // Resume polling for a research that was interrupted (browser closed mid-stream)
  const resumeResearch = useCallback(async (chatId, runId) => {
    if (streamingState[chatId]?.typing) return; // already streaming

    // Store refs so cancelResearch can find them
    activeRunsRef.current[chatId] = runId;
    const abortController = new AbortController();
    abortControllersRef.current[chatId] = abortController;

    setTyping(chatId, true);
    setContent(chatId, '');

    // Show a "resuming" step so user sees progress immediately
    let stepsList = [{
      phase: 'EVIDENCE_GATHERING',
      goal: 'Resuming research...',
      summary: 'Reconnecting to agent',
      status: 'active',
      ts: Date.now(),
    }];
    setSteps(chatId, [...stepsList]);

    try {
      // Try to reconnect to SSE stream (may still be active)
      let streamGotDone = false;
      let tokenBuffer = '';
      let fastModeAnswer = null;

      try {
        const streamRes = await fetch(`/api/research/${runId}/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        });

        if (streamRes.ok && streamRes.body) {
          const reader = streamRes.body.getReader();
          const decoder = new TextDecoder();
          let sseBuffer = '';
          let dataBuffer = '';
          let currentEvent = '';

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('event:')) {
                if (dataBuffer) { processSSE(currentEvent, dataBuffer); dataBuffer = ''; }
                currentEvent = trimmed.slice(6).trim();
              } else if (trimmed.startsWith('data:')) {
                dataBuffer += trimmed.slice(5).trim();
              } else if (trimmed === '' || trimmed.startsWith(':')) {
                if (dataBuffer) { processSSE(currentEvent, dataBuffer); dataBuffer = ''; currentEvent = ''; }
              }
            }
          }

          if (sseBuffer.trim().startsWith('data:')) {
            dataBuffer += sseBuffer.trim().slice(5).trim();
          }
          if (dataBuffer) processSSE(currentEvent, dataBuffer);

          function processSSE(evtType, jsonStr) {
            try {
              const data = JSON.parse(jsonStr);
              const eventType = evtType || data.type || '';
              if (eventType === 'token') {
                tokenBuffer += (data.token || '');
                setContent(chatId, tokenBuffer);
              } else if (eventType === 'step') {
                stepsList = stepsList.map(s =>
                  s.status === 'active' ? { ...s, status: 'done' } : s
                );
                stepsList.push({
                  ...data,
                  status: data.done ? 'done' : 'active',
                  ts: Date.now(),
                });
                setSteps(chatId, [...stepsList]);
              } else if (eventType === 'done') {
                streamGotDone = true;
                if (data.answer) fastModeAnswer = data.answer;
                stepsList = stepsList.map(s => ({ ...s, status: 'done' }));
                setSteps(chatId, [...stepsList]);
              }
            } catch { /* ignore parse errors */ }
          }
        }
      } catch (streamErr) {
        if (streamErr.name === 'AbortError') throw streamErr;
        // Stream unavailable — continue to polling
      }

      // Save streamed answer if complete
      const answer = fastModeAnswer || (streamGotDone && tokenBuffer) || null;
      if (answer) {
        await fetch(`/api/chats/${chatId}/messages`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ role: 'assistant', content: answer, run_id: runId }),
        });
        clearStream(chatId);
        await refetchMessages(chatId);
        return;
      }

      // Mark resuming step as done, add "waiting" step
      stepsList = stepsList.map(s => ({ ...s, status: 'done' }));
      stepsList.push({
        phase: 'SYNTHESIS',
        goal: 'Waiting for research to complete...',
        status: 'active',
        ts: Date.now(),
      });
      setSteps(chatId, [...stepsList]);

      // Poll until research is complete — no timeout limit
      let lastPolledPhase = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // Check if user cancelled
        if (abortController.signal.aborted) break;

        const statusRes = await fetch(`/api/research/${runId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === 'failed' || statusData.status === 'error') {
            throw new Error(statusData.error || 'Research failed');
          }

          // Update progress UI from polling current_phase
          if (statusData.current_phase && statusData.current_phase !== lastPolledPhase) {
            lastPolledPhase = statusData.current_phase;
            const existingIdx = stepsList.findIndex(s => s.phase === lastPolledPhase);
            if (existingIdx < 0) {
              stepsList = stepsList.map(s =>
                s.status === 'active' ? { ...s, status: 'done' } : s
              );
              stepsList.push({
                phase: lastPolledPhase,
                goal: `${lastPolledPhase}...`,
                status: 'active',
                ts: Date.now(),
              });
              setSteps(chatId, [...stepsList]);
            }
          }

          if (!isResearchPending(statusData)) break;
        }
        await new Promise(r => setTimeout(r, 3000));
      }

      // If cancelled, clean up and exit
      if (abortController.signal.aborted) {
        delete abortControllersRef.current[chatId];
        delete activeRunsRef.current[chatId];
        clearStream(chatId);
        return;
      }

      // Fetch and save result
      stepsList = stepsList.map(s => ({ ...s, status: 'done' }));
      stepsList.push({
        phase: 'WRITING',
        goal: 'Fetching result...',
        status: 'active',
        ts: Date.now(),
      });
      setSteps(chatId, [...stepsList]);

      for (let attempt = 0; attempt < 10; attempt++) {
        const resultRes = await fetch(`/api/research/${runId}/result`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ chatId }),
        });
        const resultData = await resultRes.json();
        if (resultData.message?.content) break;
        if (attempt < 9) await new Promise(r => setTimeout(r, 3000));
      }

      delete abortControllersRef.current[chatId];
      delete activeRunsRef.current[chatId];
      clearStream(chatId);
      await refetchMessages(chatId);
    } catch (err) {
      if (err.name === 'AbortError') {
        delete abortControllersRef.current[chatId];
        delete activeRunsRef.current[chatId];
        clearStream(chatId);
        return;
      }
      console.error('[Resume research error]', err);
      delete abortControllersRef.current[chatId];
      delete activeRunsRef.current[chatId];
      clearStream(chatId);
      await refetchMessages(chatId);
    }
  }, [streamingState, authHeaders, token, setTyping, setContent, setSteps, clearStream, refetchMessages]);

  // ── Load on mount / conversation switch ─────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/chats', { headers: authHeaders })
      .then(r => r.json())
      .then(data => {
        if (data.chats) {
          setConversations(data.chats.map(c => ({
            id: c.id,
            title: c.title,
            date: c.created_at?.split('T')[0],
          })));
          if (data.chats.length > 0 && !activeConversationId) {
            setActiveConversationId(data.chats[0].id);
          }
        }
      })
      .catch(() => {});
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load messages when active conversation changes — resume if research pending
  useEffect(() => {
    if (!activeConversationId || !isAuthenticated) return;
    if (allMessages[activeConversationId]) return; // already loaded

    (async () => {
      const pendingRunId = await refetchMessages(activeConversationId);
      if (pendingRunId) {
        resumeResearch(activeConversationId, pendingRunId);
      }
    })().catch(() => {});
  }, [activeConversationId, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── UI helpers ──────────────────────────────────────────────────────

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const saveScrollPosition = useCallback((position) => {
    if (activeConversationId) {
      scrollPositionsRef.current[activeConversationId] = position;
    }
  }, [activeConversationId]);

  const getScrollPosition = useCallback(() => {
    return scrollPositionsRef.current[activeConversationId] ?? null;
  }, [activeConversationId]);

  const selectConversation = useCallback((id) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  }, []);

  // ── Chat CRUD ───────────────────────────────────────────────────────

  const newChat = useCallback(async () => {
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.chat) {
      await refetchConversations();
      setAllMessages(prev => ({ ...prev, [data.chat.id]: [] }));
      setActiveConversationId(data.chat.id);
      setIsSidebarOpen(false);
    }
  }, [authHeaders, refetchConversations]);

  const removeChat = useCallback(async (id) => {
    await fetch(`/api/chats/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });

    // Clean up client-only state
    setAllMessages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    delete scrollPositionsRef.current[id];

    // Refetch from server to get authoritative list
    const res = await fetch('/api/chats', { headers: authHeaders });
    const data = await res.json();
    if (data.chats) {
      const updated = data.chats.map(c => ({
        id: c.id, title: c.title, date: c.created_at?.split('T')[0],
      }));
      setConversations(updated);

      // Switch active conversation if the deleted one was active
      if (id === activeConversationId) {
        setActiveConversationId(updated.length > 0 ? updated[0].id : null);
      }
    }
  }, [authHeaders, activeConversationId]);

  // ── Send message ────────────────────────────────────────────────────

  const sendMessage = useCallback(async (text) => {
    const chatId = activeConversationId;
    if (!text.trim() || !chatId) return;
    // Block if ANY chat is currently streaming (prevent concurrent research)
    const anyTyping = Object.values(streamingState).some(s => s?.typing);
    if (anyTyping) return;

    const trimmed = text.trim();
    const mode = selectedModel === 'fast' ? 'fast' : 'deep';

    // 1. Save user message to DB
    const userRes = await fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ role: 'user', content: trimmed, mode }),
    });
    const userData = await userRes.json();
    if (!userData.message) return;

    // 2. Refetch messages from server — shows user message with real DB data
    await refetchMessages(chatId);
    // Also refetch conversations to update title (server sets it on first message)
    refetchConversations().catch(() => {});

    // 3. Start streaming
    setTyping(chatId, true);
    setContent(chatId, '');
    setSteps(chatId, []);

    try {
      const researchRes = await fetch('/api/research', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          query: trimmed,
          mode,
        }),
      });

      if (!researchRes.ok) {
        if (researchRes.status === 429) {
          const errData = await researchRes.json().catch(() => ({}));
          throw new Error(errData.detail || 'Server is busy. All slots are occupied.');
        }
        throw new Error('Agent unavailable');
      }

      const { run_id } = await researchRes.json();
      activeRunsRef.current[chatId] = run_id;

      // Save run_id to user message BEFORE streaming — critical for recovery
      await fetch(`/api/chats/${chatId}/messages/${userData.message.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ run_id }),
      }).catch(() => {});

      // Stream SSE via fetch + ReadableStream (with abort support)
      const abortController = new AbortController();
      abortControllersRef.current[chatId] = abortController;

      let streamGotDone = false;
      let tokenBuffer = '';
      let fastModeAnswer = null;
      let stepsList = [];

      // Try to consume SSE stream — may disconnect early (Vercel timeout, network)
      try {
        const streamRes = await fetch(`/api/research/${run_id}/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        });

        if (streamRes.ok && streamRes.body) {
          const reader = streamRes.body.getReader();
          const decoder = new TextDecoder();
          let dataBuffer = '';
          let currentEvent = '';
          let sseBuffer = '';

          const processEvent = (evtType, jsonStr) => {
            if (!jsonStr) return;
            try {
              const data = JSON.parse(jsonStr);
              const eventType = evtType || data.type || '';

              if (eventType === 'token') {
                tokenBuffer += (data.token || '');
                setContent(chatId, tokenBuffer);
              } else if (eventType === 'step') {
                stepsList = stepsList.map(s =>
                  s.status === 'active' ? { ...s, status: 'done' } : s
                );
                stepsList.push({
                  ...data,
                  status: data.done ? 'done' : 'active',
                  ts: Date.now(),
                });
                setSteps(chatId, [...stepsList]);
              } else if (eventType === 'done') {
                streamGotDone = true;
                if (data.answer) {
                  fastModeAnswer = data.answer;
                }
                stepsList = stepsList.map(s => ({ ...s, status: 'done' }));
                setSteps(chatId, [...stepsList]);
              } else if (eventType === 'validate') {
                const pct = Math.round((data.score || 0) * 100);
                stepsList = stepsList.map(s =>
                  s.status === 'active' ? { ...s, status: 'done' } : s
                );
                stepsList.push({
                  type: 'step',
                  phase: 'SYNTHESIS',
                  goal: `Validating research completeness... (${pct}%)`,
                  summary: data.missing?.join(', ') || null,
                  status: data.complete ? 'done' : 'active',
                  ts: Date.now(),
                });
                setSteps(chatId, [...stepsList]);
              } else if (eventType === 'phase') {
                const phaseKey = data.to || data.phase;
                const pct = data.progress_pct != null ? `${data.progress_pct}%` : null;
                const msg = data.message || null;

                // Check if this phase already has an active step
                const existingIdx = stepsList.findIndex(s => s.phase === phaseKey && s.status === 'active');

                if (existingIdx >= 0 && (msg || pct)) {
                  // Update existing active step with progress info
                  stepsList[existingIdx] = {
                    ...stepsList[existingIdx],
                    goal: msg || stepsList[existingIdx].goal,
                    summary: pct || stepsList[existingIdx].summary,
                  };
                } else if (existingIdx < 0) {
                  // New phase — mark previous active steps as done, add new one
                  stepsList = stepsList.map(s =>
                    s.status === 'active' ? { ...s, status: 'done' } : s
                  );
                  stepsList.push({
                    phase: phaseKey,
                    goal: msg || `${phaseKey}...`,
                    summary: pct || null,
                    status: 'active',
                    ts: Date.now(),
                  });
                }
                setSteps(chatId, [...stepsList]);
              } else if (eventType === 'error') {
                throw new Error(data.error || data.message || 'Research error');
              }
            } catch (e) {
              if (e.message && !e.message.includes('JSON')) throw e;
            }
          };

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done: readerDone, value } = await reader.read();
            if (readerDone) break;

            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('event:')) {
                if (dataBuffer) { processEvent(currentEvent, dataBuffer); dataBuffer = ''; }
                currentEvent = trimmedLine.slice(6).trim();
              } else if (trimmedLine.startsWith('data:')) {
                dataBuffer += trimmedLine.slice(5).trim();
              } else if (trimmedLine === '' || trimmedLine.startsWith(':')) {
                if (dataBuffer) { processEvent(currentEvent, dataBuffer); dataBuffer = ''; currentEvent = ''; }
              }
            }
          }

          if (sseBuffer.trim().startsWith('data:')) {
            dataBuffer += sseBuffer.trim().slice(5).trim();
          }
          if (dataBuffer) {
            processEvent(currentEvent, dataBuffer);
          }
        }
      } catch (streamErr) {
        // Stream disconnected (timeout, network error) — NOT a fatal error.
        // Fall through to polling which will wait for the result.
        if (streamErr.name === 'AbortError') throw streamErr; // user cancelled
        console.warn('[SSE stream disconnected]', streamErr.message, '— falling back to polling');
      }

      // NOTE: Do NOT delete abortControllersRef here — it must stay alive
      // through the polling phase so cancelResearch can abort it.

      // Fast mode: if we got a complete answer via SSE, save it
      const finalAnswer = fastModeAnswer || (streamGotDone && tokenBuffer) || null;
      if (mode === 'fast' && finalAnswer) {
        delete abortControllersRef.current[chatId];
        delete activeRunsRef.current[chatId];
        await fetch(`/api/chats/${chatId}/messages`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ role: 'assistant', content: finalAnswer, run_id }),
        });
        clearStream(chatId);
        await refetchMessages(chatId);
        return;
      }

      // Poll until research is complete — no timeout limit (waits as long as tab is open)
      // Also updates UI with current_phase from polling response
      let lastPolledPhase = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // Check if user cancelled
        if (abortControllersRef.current[chatId]?.signal?.aborted) break;

        const statusRes = await fetch(`/api/research/${run_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === 'failed' || statusData.status === 'error') {
            throw new Error(statusData.error || 'Research failed');
          }

          // Update progress UI from polling current_phase
          if (statusData.current_phase && statusData.current_phase !== lastPolledPhase) {
            lastPolledPhase = statusData.current_phase;
            const existingIdx = stepsList.findIndex(s => s.phase === lastPolledPhase);
            if (existingIdx < 0) {
              stepsList = stepsList.map(s =>
                s.status === 'active' ? { ...s, status: 'done' } : s
              );
              stepsList.push({
                phase: lastPolledPhase,
                goal: `${lastPolledPhase}...`,
                status: 'active',
                ts: Date.now(),
              });
              setSteps(chatId, [...stepsList]);
            }
          }

          if (!isResearchPending(statusData)) break;
        }
        await new Promise(r => setTimeout(r, 3000));
      }

      delete abortControllersRef.current[chatId];
      delete activeRunsRef.current[chatId];

      // Fetch and save result server-side (retry up to 10 times for slow agents)
      let resultSaved = false;
      for (let attempt = 0; attempt < 10; attempt++) {
        const resultRes = await fetch(`/api/research/${run_id}/result`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ chatId }),
        });
        const resultData = await resultRes.json();
        if (resultData.message?.content) { resultSaved = true; break; }
        if (attempt < 9) await new Promise(r => setTimeout(r, 3000));
      }

      clearStream(chatId);
      await refetchMessages(chatId);

      // If result still not saved, refetch conversations to update title
      if (resultSaved) {
        refetchConversations().catch(() => {});
      }
    } catch (err) {
      // AbortError means user cancelled — don't save error message
      if (err.name === 'AbortError') {
        delete abortControllersRef.current[chatId];
        delete activeRunsRef.current[chatId];
        clearStream(chatId);
        return;
      }
      console.error('[Research error]', err);
      const errorContent = 'Agent is currently unavailable. Please try again later.';
      await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ role: 'assistant', content: errorContent }),
      });
      delete abortControllersRef.current[chatId];
      delete activeRunsRef.current[chatId];
      clearStream(chatId);
      await refetchMessages(chatId);
    }
  }, [activeConversationId, streamingState, authHeaders, selectedModel, token, setTyping, setContent, setSteps, clearStream, refetchMessages, refetchConversations]);

  const cancelResearch = useCallback(async () => {
    // Find the active research — try activeConversationId first, then scan all refs
    let chatId = activeConversationId;
    let runId = activeRunsRef.current[chatId];
    let controller = abortControllersRef.current[chatId];

    // If not found for current conversation, scan all active runs
    if (!runId && !controller) {
      for (const [cid, rid] of Object.entries(activeRunsRef.current)) {
        runId = rid;
        chatId = cid;
        controller = abortControllersRef.current[cid];
        break;
      }
    }

    if (!chatId) return;

    // 1. Abort the SSE stream on client
    if (controller) {
      controller.abort();
      delete abortControllersRef.current[chatId];
    }

    // 2. Cancel on agent server
    if (runId) {
      try {
        await fetch(`/api/research/${runId}`, {
          method: 'DELETE',
          headers: authHeaders,
        });
      } catch { /* ignore */ }
      delete activeRunsRef.current[chatId];
    }

    // 3. Clear streaming UI
    clearStream(chatId);
  }, [activeConversationId, authHeaders, clearStream]);

  const rateMessage = useCallback(() => {}, []);

  const value = useMemo(() => ({
    isSidebarOpen,
    conversations,
    activeConversationId,
    messages,
    selectedModel,
    isTyping,
    streamingContent,
    streamingSteps,
    toggleSidebar,
    closeSidebar,
    selectConversation,
    newChat,
    sendMessage,
    cancelResearch,
    setSelectedModel,
    rateMessage,
    removeChat,
    saveScrollPosition,
    getScrollPosition,
  }), [
    isSidebarOpen, conversations, activeConversationId,
    messages, selectedModel, isTyping, streamingContent, streamingSteps,
    toggleSidebar, closeSidebar, selectConversation,
    newChat, sendMessage, cancelResearch, rateMessage, removeChat,
    saveScrollPosition, getScrollPosition,
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
