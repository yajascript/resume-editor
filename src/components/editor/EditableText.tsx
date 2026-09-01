'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  tag?: keyof React.JSX.IntrinsicElements;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className,
  tag: Tag = 'span',
  placeholder = '',
  multiline = false,
  style,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (elementRef.current && !isFocused) {
      if (elementRef.current.innerText !== (value || '')) {
        elementRef.current.innerText = value || '';
      }
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    if (elementRef.current) {
      const text = elementRef.current.innerText.trim();
      if (text !== (value || '')) {
        onSave(text);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!multiline && event.key === 'Enter') {
      event.preventDefault();
      elementRef.current?.blur();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const Component = Tag as any;

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      style={style}
      className={cn(
        'outline-none transition-all duration-150 rounded px-0.5 cursor-text',
        'hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400/50',
        'focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-blue-500 focus:shadow-sm',
        !value &&
          placeholder &&
          'empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:italic',
        className
      )}
    >
      {value}
    </Component>
  );
};
