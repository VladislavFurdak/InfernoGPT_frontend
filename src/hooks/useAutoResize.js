import { useEffect } from 'react';

export function useAutoResize(textareaRef, value) {
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, [textareaRef, value]);
}
