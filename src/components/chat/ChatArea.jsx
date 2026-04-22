/**
 * ChatArea — Main right-side container composing the chat UI.
 *
 * Stacks vertically: MobileHeader (visible < md), ModelSelector (visible >= md),
 * ChatFeed (scrollable message list), and InputArea (sticky bottom input).
 */
import MobileHeader from './MobileHeader';
import ModelSelector from './ModelSelector';
import ChatFeed from './ChatFeed';
import InputArea from './InputArea';

export default function ChatArea() {
  return (
    <main className="flex-1 flex flex-col h-screen relative bg-dark-900 min-w-0">
      <MobileHeader />
      <ModelSelector />
      <ChatFeed />
      <InputArea />
    </main>
  );
}
