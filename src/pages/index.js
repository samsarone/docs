// src/pages/index.js
import React from 'react';
import Head from '@docusaurus/Head';
import { Redirect } from '@docusaurus/router';

const title = 'SamsarOne API Docs | Samsar Docs';
const description =
  "Explore SamsarOne's unified generative APIs for video, image, chat, assistant workflows, credits, and external-user integrations.";
const image = 'https://docs.samsar.one/img/og/samsar-docs-overview.png';

export default function Home() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={image} />
      </Head>
      <Redirect to="/intro" />
    </>
  );
}
