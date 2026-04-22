'use client';

/**
 * ChatFeed — Scrollable container for all chat messages.
 *
 * Renders the message list (UserMessage / AIMessage), the empty-state
 * welcome screen when no messages exist, and the TypingIndicator while
 * the AI response is being simulated. Saves and restores scroll position
 * per conversation so users don't lose their place when switching chats.
 */
import { useRef, useEffect, useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
import TypingIndicator from './TypingIndicator';
import BotAvatar from '../ui/BotAvatar';

export default function ChatFeed() {
  const {
    messages,
    isTyping,
    streamingContent,
    activeConversationId,
    saveScrollPosition,
    getScrollPosition,
  } = useChat();
  const scrollRef = useRef(null);
  const endRef = useAutoScroll(messages.length);
  const prevConvIdRef = useRef(activeConversationId);

  // Save scroll position on scroll events
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      saveScrollPosition(scrollRef.current.scrollTop);
    }
  }, [saveScrollPosition]);

  // Restore scroll position when switching conversations
  useEffect(() => {
    if (prevConvIdRef.current !== activeConversationId) {
      prevConvIdRef.current = activeConversationId;
      const savedPos = getScrollPosition();
      if (scrollRef.current && savedPos !== null) {
        // Use requestAnimationFrame to ensure DOM has rendered the new messages
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = savedPos;
          }
        });
      }
    }
  }, [activeConversationId, getScrollPosition]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto pt-6 pb-32 px-4 md:px-0"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <BotAvatar size="lg" className="mb-6 rounded-2xl bg-dark-900" />
            <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
            <p className="text-gray-400 max-w-md">
              Start a conversation by typing a message below. I can help with coding, analysis, writing, and more.
            </p>
          </div>
        )}

        {messages.map(msg =>
          msg.role === 'user' ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <AIMessage key={msg.id} message={msg} />
          )
        )}

        {isTyping && <TypingIndicator />}

        <div ref={endRef} />
      </div>
    </div>
  );
}
