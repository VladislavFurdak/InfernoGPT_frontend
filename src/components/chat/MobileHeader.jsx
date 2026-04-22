'use client';

/**
 * MobileHeader — Top bar visible only on mobile (< md breakpoint).
 *
 * Contains a hamburger button to toggle the sidebar, the app title,
 * and a "+" button to create a new chat.
 */
import { useChat } from '../../context/ChatContext';
import { APP_NAME } from '../../constants';

export default function MobileHeader() {
  const { toggleSidebar, newChat } = useChat();

  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800">
      <button
        onClick={toggleSidebar}
        className="text-gray-300 hover:text-white"
      >
        <i className="fa-solid fa-bars text-xl"></i>
      </button>
      <div className="font-bold text-lg text-white">{APP_NAME}</div>
      <button
        onClick={newChat}
        className="text-gray-300 hover:text-white"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>
    </header>
  );
}
