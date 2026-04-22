/**
 * AIMessage — Renders a single AI assistant response.
 *
 * Markdown is rendered via react-markdown. Math formulas ($, $$, \(...\), \[...\])
 * are rendered by MathJax which is loaded globally in layout.jsx.
 * After each render, MathJax.typeset() is called to process new formulas.
 */
import { useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import CodeBlock from './CodeBlock';
import AIMessageActions from './AIMessageActions';
import BotAvatar from '../ui/BotAvatar';
import { APP_NAME } from '../../constants';
import { preprocessContent } from '../../lib/preprocessContent';

export default function AIMessage({ message }) {
  const content = preprocessContent(message.content);
  const ref = useRef(null);

  // After markdown renders, tell MathJax to typeset this element
  useEffect(() => {
    if (ref.current && window.MathJax?.typeset) {
      try {
        window.MathJax.typeset([ref.current]);
      } catch {
        // MathJax not ready yet — will typeset on next render
      }
    }
  }, [content]);

  return (
    <div className="flex gap-4 p-4 md:p-6 rounded-2xl">
      <BotAvatar className="mt-1 bg-dark-900" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="font-semibold text-brand-500">{APP_NAME}</div>
        <div ref={ref} className="markdown-body text-gray-300 leading-relaxed">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
            components={{
              code: CodeBlock,
              a: ({ href, children, ...props }) => {
                const isAnchor = typeof href === 'string' && href.startsWith('#');
                if (isAnchor) {
                  return (
                    <a
                      {...props}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        const id = decodeURIComponent(href.slice(1));
                        const target = ref.current?.querySelector(`#${CSS.escape(id)}`);
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {children}
                    </a>
                  );
                }
                return (
                  <a {...props} href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                );
              },
            }}
          >
            {content}
          </Markdown>
        </div>
        <AIMessageActions message={message} />
      </div>
    </div>
  );
}
