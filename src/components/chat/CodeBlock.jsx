'use client';

/**
 * CodeBlock — Custom renderer for code elements inside react-markdown.
 *
 * Detects whether the code is inline or a fenced block by checking for
 * a `language-*` className. Inline code renders as a styled <code> tag.
 * Fenced blocks render with a header bar showing the language name and
 * a copy-to-clipboard button, followed by a syntax-highlighted <pre>.
 */
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export default function CodeBlock({ className, children, ...props }) {
  const { copied, copy } = useCopyToClipboard();
  const match = /language-(\w+)/.exec(className || '');
  const isBlock = match !== null;

  if (!isBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const language = match[1];

  return (
    <div className="relative group/code">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-700 rounded-t-lg border border-dark-600 border-b-0">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <button
          onClick={() => copy(String(children).replace(/\n$/, ''))}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <i className={`fa-regular ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="!rounded-t-none !mt-0 !border-t-0">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}
