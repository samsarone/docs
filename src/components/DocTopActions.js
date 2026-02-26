import React from 'react';
export default function DocTopActions({ downloadLabel = 'Download llms.txt', downloadHref = '/llms.txt' }) {
  return (
    <div className="doc-top-actions">
      <a className="doc-download" href={downloadHref} download>
        {downloadLabel}
      </a>
    </div>
  );
}
