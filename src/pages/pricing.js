import React from 'react';
import Layout from '@theme/Layout';
import styles from './pricing.module.css';

const apiPricing = [
  {
    title: 'Video API pricing',
    endpoints: [
      {
        endpoint: 'POST /video/text_to_video',
        price: '90-1050 base credits by model; Hunyuan adds a 1.5x multiplier.',
        notes: 'Supports all express video models (RUNWAYML, KLINGIMGTOVID3PRO, HAILUO, HAILUOPRO, SEEDANCEI2V, VEO3.1I2V, VEO3.1I2VFAST, SORA2, SORA2PRO).',
      },
      {
        endpoint: 'POST /video/image_list_to_video',
        price: '75 credits/sec flat rate.',
        notes: 'Billed on final render duration derived from the supplied images; uses a fixed Veo2.1 pipeline model (`VEO3.1I2V`).',
      },
      {
        endpoint: 'POST /video/translate_video',
        price: '3 credits/sec flat rate.',
        notes: 'Billed on the source session duration; credits are charged when the request is accepted.',
      },
      {
        endpoint: 'POST /video/join_videos',
        price: '3 credits/sec flat rate.',
        notes: 'Billed on the joined duration (sum of session durations); credits are charged when the request is accepted.',
      },
      {
        endpoint: 'POST /video/remove_subtitles',
        price: 'No additional credits.',
        notes: 'Clones a session, removes subtitle/transcript text overlays, and re-runs frame/video generation.',
      },
      {
        endpoint: 'POST /video/cancel_render',
        price: 'No additional credits.',
        notes: 'Cancels an in-progress render for an existing session and evicts queued render tasks.',
      },
      {
        endpoint: 'POST /video/add_outro_image',
        price: '75 credits per request.',
        notes: 'Clones a session, adds/replaces the outro layer, and re-runs frame/video generation.',
      },
    ],
  },
  {
    title: 'Image API pricing',
    endpoints: [
      {
        endpoint: 'POST /image/enhance',
        price: '45/75/90 credits per request at 1k/2k/4k.',
        notes: 'Resolution defaults to 1k; requests are async and return credit headers.',
      },
      {
        endpoint: 'POST /image/remove_branding',
        price: '75 credits per request.',
        notes: 'Async request; poll /image/status for completion.',
      },
      {
        endpoint: 'POST /image/add_image_set',
        price: '75 credits per requested image.',
        notes: 'num_images defaults to image_urls.length when omitted.',
      },
      {
        endpoint: 'POST /image/create_rollup_banner',
        price: '30 credits per request.',
        notes: 'Generates a rollup banner from the provided image set.',
      },
      {
        endpoint: 'POST /image/create_rollup_banner_with_enhance',
        price: 'Variable (enhance credits + 30 credits).',
        notes: 'Enhances low-res tiles as needed before generating a rollup banner.',
      },
    ],
  },
  {
    title: 'Chat API pricing',
    endpoints: [
      {
        endpoint: 'POST /chat/enhance',
        price: '30 credits per request.',
        notes: 'Synchronous response; no status polling required.',
      },
    ],
  },
];

export default function Pricing() {
  return (
    <Layout
      title="Pricing"
      description="Simple credits that work across the Samsar One product suite."
    >
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <span className={styles.kicker}>Pricing</span>
              <h1 className={styles.title}>One plan for every Samsar workflow.</h1>
              <p className={styles.lede}>
                A single payment plan covers VidGenie, Studio Creator, and Express
                Narrative Creator. Use credits where you need them.
              </p>
            </div>
          </div>
        </header>
        <main className={styles.main}>
          <section className={`container ${styles.pricingSection}`}>
            <div className={styles.pricingIntro}>
              <h2 className={styles.cardTitle}>API endpoint pricing</h2>
              <p className={styles.cardText}>
                Detailed per-endpoint rates and billing notes.
              </p>
            </div>
            <div className={styles.pricingGrid}>
              {apiPricing.map((api) => (
                <div className={`card ${styles.apiCard}`} key={api.title}>
                  <h3 className={styles.apiPricingTitle}>{api.title}</h3>
                  <ul className={styles.apiPricingList}>
                    {api.endpoints.map((endpoint) => (
                      <li className={styles.apiPricingItem} key={endpoint.endpoint}>
                        <span className={styles.apiEndpoint}>{endpoint.endpoint}</span>
                        <span className={styles.apiPrice}>{endpoint.price}</span>
                        <span className={styles.apiNotes}>{endpoint.notes}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
