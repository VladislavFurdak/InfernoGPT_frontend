'use client';

import { ChatProvider } from '../context/ChatContext';
import Sidebar from '../components/sidebar/Sidebar';
import ChatArea from '../components/chat/ChatArea';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen w-full overflow-hidden bg-dark-900 text-gray-200">
        <Sidebar />
        <ChatArea />
      </div>
    </ChatProvider>
  );
}
