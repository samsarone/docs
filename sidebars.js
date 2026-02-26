// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {


  apiSidebar: [
    {
      type: 'category',
      label: 'Omni API',
      items: [
        'intro',
        'login-tokens',
        'api',
        'image-api',
        'chat-api',
        'credits-api',
        {
          type: 'category',
          label: 'Fonts',
          link: {
            type: 'doc',
            id: 'fonts',
          },
          items: [
            { type: 'link', label: 'Default (default)', href: '/fonts#default' },
            { type: 'link', label: 'English (en)', href: '/fonts#en' },
            { type: 'link', label: 'French (fr)', href: '/fonts#fr' },
            { type: 'link', label: 'Spanish (es)', href: '/fonts#es' },
            { type: 'link', label: 'German (de)', href: '/fonts#de' },
            { type: 'link', label: 'Portuguese (pt)', href: '/fonts#pt' },
            { type: 'link', label: 'Italian (it)', href: '/fonts#it' },
            { type: 'link', label: 'Dutch (nl)', href: '/fonts#nl' },
            { type: 'link', label: 'Swedish (sv)', href: '/fonts#sv' },
            { type: 'link', label: 'Russian (ru)', href: '/fonts#ru' },
            { type: 'link', label: 'Japanese (ja)', href: '/fonts#ja' },
            { type: 'link', label: 'Korean (ko)', href: '/fonts#ko' },
            { type: 'link', label: 'Thai (th)', href: '/fonts#th' },
            { type: 'link', label: 'Arabic (ar)', href: '/fonts#ar' },
            { type: 'link', label: 'Bengali (bn)', href: '/fonts#bn' },
            { type: 'link', label: 'Hindi (hi)', href: '/fonts#hi' },
            { type: 'link', label: 'Hebrew (he)', href: '/fonts#he' },
            { type: 'link', label: 'Latin (la)', href: '/fonts#la' },
            { type: 'link', label: 'Sanskrit (sa)', href: '/fonts#sa' },
            { type: 'link', label: 'Chinese (zh)', href: '/fonts#zh' },
            { type: 'link', label: 'Chinese (zh-cn)', href: '/fonts#zh-cn' },
            { type: 'link', label: 'Chinese (zh-tw)', href: '/fonts#zh-tw' },
          ],
        },
      ],
    },
  ],


};

export default sidebars;
