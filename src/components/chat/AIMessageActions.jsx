'use client';

/**
 * AIMessageActions — Action buttons rendered below each AI response.
 *
 * Provides actions: Copy, Rate (up/down), Download log, Regenerate.
 */
import { useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export default function AIMessageActions({ message }) {
  const { rateMessage } = useChat();
  const { copied, copy } = useCopyToClipboard();

  const downloadLog = useCallback(async () => {
    if (!message.run_id) return;
    try {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
      const res = await fetch(`/api/research/${message.run_id}/dump`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-${message.run_id}.log`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Download failed silently
    }
  }, [message.run_id]);

  return (
    <div className="flex items-center gap-3 pt-2 text-gray-500">
      <button
        onClick={() => copy(message.content)}
        className="hover:text-gray-300 transition-colors cursor-pointer"
        title="Copy"
      >
        <i className={`fa-regular ${copied ? 'fa-check' : 'fa-copy'}`}></i>
      </button>
      <button
        onClick={() => rateMessage(message.id, 'up')}
        className={`transition-colors cursor-pointer ${
          message.rating === 'up' ? 'text-green-500' : 'hover:text-green-500'
        }`}
        title="Good response"
      >
        <i className={`${message.rating === 'up' ? 'fa-solid' : 'fa-regular'} fa-thumbs-up`}></i>
      </button>
      <button
        onClick={() => rateMessage(message.id, 'down')}
        className={`transition-colors cursor-pointer ${
          message.rating === 'down' ? 'text-red-500' : 'hover:text-red-500'
        }`}
        title="Bad response"
      >
        <i className={`${message.rating === 'down' ? 'fa-solid' : 'fa-regular'} fa-thumbs-down`}></i>
      </button>
      {message.run_id && (
        <button
          onClick={downloadLog}
          className="hover:text-blue-400 transition-colors cursor-pointer"
          title="Download research log"
        >
          <i className="fa-solid fa-file-arrow-down"></i>
        </button>
      )}
      <button
        className="hover:text-gray-300 transition-colors cursor-pointer"
        title="Regenerate"
      >
        <i className="fa-solid fa-rotate-right"></i>
      </button>
    </div>
  );
}
