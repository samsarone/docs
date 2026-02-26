import React from 'react';

export default function PlaygroundRail({
  href = 'https://samsar.one/playground/video',
  title = 'Try it in Playground',
  ctaLabel = 'Open playground',
  badge = 'Live testing',
  endpointLabel,
  children,
}) {
  return (
    <aside className="playground-rail">
      <div className="playground-card">
        <div className="playground-pill">{badge}</div>
        <div className="playground-heading">
          <h4>{title}</h4>
          {endpointLabel ? <span className="playground-endpoint">{endpointLabel}</span> : null}
        </div>
        <p className="playground-copy">
          {children || 'Open the Samsar Playground with your API key to run this request and inspect the response.'}
        </p>
        <a className="playground-cta" href={href} target="_blank" rel="noreferrer">
          {ctaLabel}
        </a>
      </div>
    </aside>
  );
}
