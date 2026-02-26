// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Samsar Docs',
  tagline: 'Create Videos with generative tooling',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs.samsar.one',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SamsarOne', // Usually your GitHub org/user name.
  projectName: 'SamsarOne', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/samsar-social-card.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: 'Samsar Docs',
          src: 'img/logo-text-light.svg',
          srcDark: 'img/logo-text-dark.svg',
        },
        items: [
          {
            type: 'html',
            position: 'right',
            value: `
              <div class="navbar-icon-group">
                <a class="navbar-icon-link" href="https://samsar.one" target="_blank" rel="noreferrer" aria-label="Home">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 10.5 12 4l8 6.5" />
                    <path d="M6.5 10.5V20h11V10.5" />
                    <path d="M10 20v-5h4v5" />
                  </svg>
                </a>
                <a class="navbar-icon-link" href="https://app.samsar.one" target="_blank" rel="noreferrer" aria-label="Studio">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="9" width="16" height="10" rx="2" />
                    <path d="M4 9.25 7.2 4h4.2L8.2 9.25" />
                    <path d="M15 9.25 18.2 4H22" />
                    <path d="M8 13h8" />
                  </svg>
                </a>
                <a class="navbar-icon-link" href="https://samsar.one/playground" target="_blank" rel="noreferrer" aria-label="Playground">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
                    <path d="M9.5 9.5h5" />
                    <path d="M9.5 14.5h5" />
                    <path d="M12 9.5v10" />
                  </svg>
                </a>
              </div>
            `,
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'App',
            items: [
              {
                label: 'App',
                href: 'https://app.samsar.one',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Pricing',
                to: '/pricing',
              },
              {
                label: 'Blog',
                href: 'https://blog.samsar.one',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} SamsarOne.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Cache-Control',
        content: 'no-cache, no-store, must-revalidate',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Pragma',
        content: 'no-cache',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Expires',
        content: '0',
      },
    },
  ],


  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            // Single entry avoids duplicate redirect files for trailing-slash variants
            from: ['/docs/api'],
            to: '/',
          },
        ],
      },
    ],
  ],
};

export default config;
