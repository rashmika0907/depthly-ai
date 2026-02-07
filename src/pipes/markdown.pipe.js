
import React, { useMemo } from 'react';
import htm from 'htm';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const html = htm.bind(React.createElement);

export function MarkdownRenderer({ markdown }) {
  const cleanHtml = useMemo(() => {
    if (!markdown) return '';
    const rawHtml = marked.parse(markdown, { async: false });
    return DOMPurify.sanitize(rawHtml);
  }, [markdown]);

  return html`
    <div dangerouslySetInnerHTML=${{ __html: cleanHtml }}></div>
  `;
}
