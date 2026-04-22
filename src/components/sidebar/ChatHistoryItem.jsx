'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

export default function ChatHistoryItem({ conversation }) {
  const { activeConversationId, selectConversation, removeChat } = useChat();
  const isActive = conversation.id === activeConversationId;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div
      onClick={() => selectConversation(conversation.id)}
      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-dark-700 text-white'
          : 'hover:bg-dark-700 text-gray-300'
      }`}
    >
      <div className="flex items-center gap-3 truncate">
        <i className={`fa-regular fa-message ${isActive ? 'text-gray-400' : 'text-gray-500'}`}></i>
        <span className={`truncate text-sm ${isActive ? 'font-medium' : ''}`}>
          {conversation.title}
        </span>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity px-1"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
            <button
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-600 hover:text-red-300 transition-colors flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                removeChat(conversation.id);
              }}
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
              Remove Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
