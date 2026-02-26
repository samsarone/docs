import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

export default function FontSample({
  language = 'default',
  fontName,
  fontKey,
  baseUrl = 'https://api.samsar.one/supported_fonts',
  className = '',
}) {
  const { colorMode } = useColorMode();
  const resolvedKey = fontKey || (fontName ? slugify(fontName) : '');
  const resolvedLanguage = (language || 'default').trim().toLowerCase();
  const themeSegment = colorMode === 'dark' ? 'dark' : 'light';

  if (!resolvedKey) {
    return null;
  }

  const src = `${baseUrl}/${themeSegment}/${resolvedLanguage}/${resolvedKey}.png`;
  const alt = fontName ? `${fontName} sample` : `${resolvedKey} sample`;
  const combinedClassName = `font-sample ${className}`.trim();

  return <img className={combinedClassName} src={src} alt={alt} loading="lazy" decoding="async" />;
}
