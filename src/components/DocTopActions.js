import React from 'react';
export default function DocTopActions({ downloadLabel = 'View llms.txt', downloadHref = '/llms.txt' }) {
  return (
    <div className="doc-top-actions">
      <a className="doc-download" href={downloadHref} target="_blank" rel="noopener noreferrer">
        {downloadLabel}
      </a>
    </div>
  );
}
