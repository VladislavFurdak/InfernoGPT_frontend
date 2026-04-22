'use client';

/**
 * TypingIndicator — Shows research progress steps (deep mode)
 * or streaming markdown content (fast mode) while the agent is working.
 * Includes stop and download log buttons.
 */
import { useCallback, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import BotAvatar from '../ui/BotAvatar';
import CodeBlock from './CodeBlock';
import { APP_NAME } from '../../constants';
import { useChat } from '../../context/ChatContext';
import ResearchProgress from './ResearchProgress';

function StreamingMarkdown({ content }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.MathJax?.typeset) {
      try { window.MathJax.typeset([ref.current]); } catch {}
    }
  }, [content]);

  return (
    <div ref={ref} className="markdown-body text-gray-300 leading-relaxed">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          code: CodeBlock,
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
        }}
      >
        {content}
      </Markdown>
      <span className="inline-block w-2 h-4 bg-brand-500 animate-pulse ml-0.5 align-text-bottom" />
    </div>
  );
}

export default function TypingIndicator() {
  const { streamingSteps, streamingContent, cancelResearch, messages } = useChat();

  const hasSteps = streamingSteps.length > 0;
  const hasContent = streamingContent.length > 0;

  // Get run_id from the last user message (the one that triggered this research)
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const runId = lastUserMsg?.run_id;

  const downloadLog = useCallback(async () => {
    if (!runId) return;
    try {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
      const res = await fetch(`/api/research/${runId}/dump`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-${runId}.log`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ }
  }, [runId]);

  return (
    <div className="flex gap-4 p-4 md:p-6 rounded-2xl">
      <BotAvatar className="mt-1 bg-dark-900" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-brand-500">{APP_NAME}</div>
          <div className="flex items-center gap-2">
            {runId && (
              <button
                onClick={downloadLog}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-400 hover:text-blue-400 hover:bg-dark-700 rounded-md transition-colors cursor-pointer"
                title="Download research log"
              >
                <i className="fa-solid fa-file-arrow-down text-[11px]"></i>
                Log
              </button>
            )}
            <button
              onClick={cancelResearch}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-400 hover:text-red-400 hover:bg-dark-700 rounded-md transition-colors cursor-pointer"
              title="Stop generating"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
              </svg>
              Stop
            </button>
          </div>
        </div>

        {/* Deep mode: research steps */}
        {hasSteps && <ResearchProgress steps={streamingSteps} />}

        {/* Fast mode: streaming markdown */}
        {hasContent && (
          <StreamingMarkdown content={streamingContent} />
        )}

        {/* Neither steps nor content yet — bouncing dots */}
        {!hasSteps && !hasContent && (
          <div className="flex gap-1.5 py-2">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
