/**
 * UserMessage — Renders a single user message bubble.
 *
 * Displays the user's avatar (initials), "You" label, and plain-text
 * message content inside a dark card with rounded corners.
 */
export default function UserMessage({ message }) {
  return (
    <div className="flex gap-4 p-4 md:p-6 rounded-2xl bg-dark-800 border border-dark-700/50">
      <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mt-1">
        A
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-semibold text-gray-200">You</div>
        <div className="text-gray-300 leading-relaxed">{message.content}</div>
      </div>
    </div>
  );
}
