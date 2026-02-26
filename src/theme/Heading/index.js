import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { useThemeConfig } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import styles from './styles.module.css';

function buildSectionUrl(id) {
  if (typeof window === 'undefined') {
    return `#${id}`;
  }

  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}#${id}`;
}

function copyToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    return;
  }

  if (typeof document === 'undefined') {
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (error) {
    // Ignore clipboard failures; the hash link still works.
  }
  document.body.removeChild(textarea);
}

export default function Heading({ as: As, id, ...props }) {
  const brokenLinks = useBrokenLinks();
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig();

  // H1 headings do not need an id because they don't appear in the TOC.
  if (As === 'h1' || !id) {
    return <As {...props} id={undefined} />;
  }

  brokenLinks.collectAnchor(id);
  const anchorTitle = translate(
    {
      id: 'theme.common.headingLinkTitle',
      message: 'Direct link to {heading}',
      description: 'Title for link to heading',
    },
    {
      heading: typeof props.children === 'string' ? props.children : id,
    },
  );

  const handleCopy = () => {
    copyToClipboard(buildSectionUrl(id));
  };

  return (
    <As
      {...props}
      className={clsx(
        'anchor',
        hideOnScroll
          ? styles.anchorWithHideOnScrollNavbar
          : styles.anchorWithStickyNavbar,
        props.className,
      )}
      id={id}
    >
      {props.children}
      <Link
        className="hash-link"
        to={`#${id}`}
        aria-label={anchorTitle}
        title={anchorTitle}
        onClick={handleCopy}
      >
        &#8203;
      </Link>
    </As>
  );
}
