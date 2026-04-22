'use client';

import { useChat } from '../../context/ChatContext';
import { useCapacity } from '../../context/CapacityContext';
import BotAvatar from '../ui/BotAvatar';
import { APP_NAME } from '../../constants';

export default function SidebarHeader() {
  const { newChat } = useChat();
  const { capacity, anyAvailable } = useCapacity();

  const deepInfo = capacity.deep;
  const fastInfo = capacity.fast;
  const tooltip = `Deep: ${deepInfo.active ?? '?'}/${deepInfo.max ?? '?'} ${deepInfo.available ? '' : '(full)'}\nFast: ${fastInfo.active ?? '?'}/${fastInfo.max ?? '?'} ${fastInfo.available ? '' : '(full)'}`;

  return (
    <div className="p-4 border-b border-dark-700 flex flex-col gap-4">
      <div className="flex items-center gap-3 px-2">
        <BotAvatar size="lg" className="bg-dark-800" />
        <span className="font-bold text-lg tracking-wide text-white">{APP_NAME}</span>
        <span
          className={`ml-auto w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            anyAvailable ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
          }`}
          title={tooltip}
        />
      </div>

      <button
        onClick={newChat}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 shadow-[0_0_15px_rgba(255,69,0,0.3)] cursor-pointer"
      >
        <i className="fa-solid fa-plus"></i>
        New Chat
      </button>
    </div>
  );
}
