'use client';

import { useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import SidebarHeader from './SidebarHeader';
import ChatHistoryGroup from './ChatHistoryGroup';
import UserProfile from './UserProfile';

function groupConversationsByDate(conversations) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const groups = { today: [], yesterday: [], older: [] };

  conversations.forEach(conv => {
    if (conv.date === today) groups.today.push(conv);
    else if (conv.date === yesterday) groups.yesterday.push(conv);
    else groups.older.push(conv);
  });

  return groups;
}

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar, conversations } = useChat();
  const groups = useMemo(() => groupConversationsByDate(conversations), [conversations]);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          w-72 bg-dark-800 border-r border-dark-700
          flex flex-col h-screen flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <SidebarHeader />

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <ChatHistoryGroup label="Today" conversations={groups.today} />
          <ChatHistoryGroup label="Yesterday" conversations={groups.yesterday} />
          <ChatHistoryGroup label="Previous" conversations={groups.older} />
        </div>

        <UserProfile />
      </aside>
    </>
  );
}
