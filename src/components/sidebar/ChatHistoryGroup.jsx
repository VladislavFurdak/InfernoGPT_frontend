import ChatHistoryItem from './ChatHistoryItem';

export default function ChatHistoryGroup({ label, conversations }) {
  if (conversations.length === 0) return null;

  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mt-4 first:mt-2">
        {label}
      </div>
      <div className="space-y-1">
        {conversations.map(conv => (
          <ChatHistoryItem key={conv.id} conversation={conv} />
        ))}
      </div>
    </div>
  );
}
