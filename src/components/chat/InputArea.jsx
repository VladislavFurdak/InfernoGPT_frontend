'use client';

/**
 * InputArea — Chat message input with auto-resizing textarea.
 *
 * Sticky-positioned at the bottom of the chat area with a gradient
 * fade-out above it. Supports:
 * - Auto-resize via useAutoResize hook (grows up to max-h-48)
 * - Submit on Enter (Shift+Enter for newline)
 * - Send button with disabled state when empty or AI is typing
 * - Paperclip button (decorative placeholder for file upload)
 */
import { useState, useRef, useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import { useCapacity } from '../../context/CapacityContext';
import { useAutoResize } from '../../hooks/useAutoResize';
import { APP_NAME } from '../../constants';

const MODE_MAP = { 'deep-research': 'deep', fast: 'fast' };

export default function InputArea() {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage, isTyping, activeConversationId, newChat, selectedModel } = useChat();
  const { capacity } = useCapacity();

  const modeKey = MODE_MAP[selectedModel] || 'deep';
  const modeAvailable = capacity[modeKey]?.available !== false;

  useAutoResize(textareaRef, value);

  const canSend = value.trim() && !isTyping && modeAvailable;

  const handleSubmit = useCallback(async () => {
    if (!value.trim() || isTyping || !modeAvailable) return;
    // Auto-create a chat if none selected
    if (!activeConversationId) {
      await newChat();
    }
    sendMessage(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, sendMessage, isTyping, modeAvailable, activeConversationId, newChat]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-dark-900 via-dark-900 to-transparent pt-10 pb-6 px-4 md:px-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="relative bg-dark-800 border border-dark-600 rounded-xl shadow-lg focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white placeholder-gray-500 p-4 pr-16 rounded-xl resize-none max-h-48 focus:outline-none"
            rows="1"
            placeholder={`Message ${APP_NAME}...`}
            style={{ minHeight: '56px' }}
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer">
              <i className="fa-solid fa-paperclip"></i>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="bg-brand-500 hover:bg-brand-600 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title={!modeAvailable ? 'Server busy — all slots occupied' : ''}
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-gray-500">
          {APP_NAME} can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
}
