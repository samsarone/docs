import React from 'react';
import Layout from '@theme/Layout';
import styles from './pricing.module.css';
import {
  EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL,
  EXPRESS_VIDEO_OPTIONAL_ADDON_CREDITS_PER_SECOND,
} from '../constants/expressVideoPricingDistribution.js';

const expressVideoModelOrder = [
  'VEO3.1I2V',
  'VEO3.1I2VFAST',
  'COSMOS3SUPERI2V',
  'SEEDANCEI2V',
  'KLINGIMGTOVID3PRO',
  'HAPPYHORSEI2V',
  'RUNWAYML',
];

const expressVideoPricingSummary = expressVideoModelOrder
  .map((model) => `${model} at ${EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL[model]} credits/sec`)
  .join(', ');

const apiPricing = [
  {
    title: 'Video API pricing',
    endpoints: [
      {
        endpoint: 'POST /video/text_to_video',
        price: '20-60 credits/sec by standard express model.',
        notes: `Supported models: ${expressVideoPricingSummary}.`,
      },
      {
        endpoint: 'POST /video/image_list_to_video',
        price: '20-60 credits/sec by standard express model.',
        notes: `Billed on final render duration derived from the supplied images; supports ${expressVideoPricingSummary}. Defaults to VEO3.1I2V when omitted. add_narrator_avatar adds 4 credits/sec; express_cta_generation adds ${EXPRESS_VIDEO_OPTIONAL_ADDON_CREDITS_PER_SECOND.express_cta_generation} credit/sec.`,
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
        endpoint: 'POST /v2/video/clone',
        price: 'No additional credits.',
        notes: 'Deep-copies an owned completed session and queues only the final video render so the clone gets a new video path and URL.',
      },
      {
        endpoint: 'POST /video/reroll-layers',
        price: 'Selected image-generation credits + selected AI-video stage credits.',
        notes: 'Use quote_only to estimate without charging; rerolls selected 1-based layer indexes in place, then rerenders frames/outro/final video.',
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
      {
        endpoint: 'POST /video/update_outro_image',
        price: '75 credits per request.',
        notes: 'Clones a session, updates the existing outro layer from a supplied image URL, generated QR CTA, or generated center logo/CTA image, and re-runs frame/video generation only.',
      },
      {
        endpoint: 'POST /video/update_footer_image',
        price: '75 credits per request.',
        notes: 'Clones a session, updates or removes scene footer CTA metadata, and re-runs footer/frame/video generation only.',
      },
      {
        endpoint: 'POST /external_users/add_outro_image',
        price: '75 credits per request.',
        notes: 'External-user equivalent of add outro image; resolves the external request and charges the external user.',
      },
      {
        endpoint: 'POST /external_users/update_outro_image',
        price: '75 credits per request.',
        notes: 'External-user equivalent of update outro image; supports supplied outro URLs, generated QR CTA outros, and generated center logo/CTA image outros.',
      },
      {
        endpoint: 'POST /external_users/update_footer_image',
        price: '75 credits per request.',
        notes: 'External-user equivalent of update footer image; resolves the external request and charges the external user.',
      },
    ],
  },
  {
    title: 'Image API pricing',
    endpoints: [
      {
        endpoint: 'POST /image/enhance',
        price: '11/15/22/29 credits per request at 0.5k/1k/2k/4k.',
        notes: 'Resolution defaults to 1k; requests are async and return credit headers.',
      },
      {
        endpoint: 'POST /image/remove_branding',
        price: '15 credits per request.',
        notes: 'Async request; poll /image/status for completion.',
      },
      {
        endpoint: 'POST /image/add_image_set',
        price: '15 credits per requested image.',
        notes: 'Supports optional aspect_ratio overrides such as 16:9 for downstream generation.',
      },
      {
        endpoint: 'POST /image/receipt_templates/create',
        price: 'Free.',
        notes: 'Creates and stores a reusable receipt template and normalized schema from one sample image.',
      },
      {
        endpoint: 'GET /image/template_json',
        price: 'Free.',
        notes: 'Returns the saved structured template JSON for a template_id owned by the API key.',
      },
      {
        endpoint: 'POST /image/receipt_templates/query',
        price: '50 credits per request.',
        notes: 'Validates a receipt image against a saved template and returns standardized extraction JSON.',
      },
      {
        endpoint: 'POST /image/create_rollup_banner',
        price: '30 credits per request.',
        notes: 'Generates a rollup banner from the provided image set.',
      },
      {
        endpoint: 'POST /image/create_rollup_banner_with_enhance',
        price: 'Variable (enhance credits + 30 credits).',
        notes: 'Enhances low-res tiles at the image enhance rates above before generating a rollup banner.',
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
      {
        endpoint: 'Embedding routes',
        price: 'Usage-based credits.',
        notes: 'Charges scale with the amount of text processed. Credits follow the standard 100 credits = $1 conversion.',
      },
      {
        endpoint: 'URL embedding routes',
        price: 'Usage-based credits + crawl cost.',
        notes: 'Crawl cost is converted into credits using the same 100 credits = $1 rule, then a 2.5x ingestion multiplier is applied.',
      },
    ],
  },
  {
    title: 'Assistant API pricing',
    endpoints: [
      {
        endpoint: 'POST /assistant/completion',
        price: 'Usage-based credits.',
        notes: 'Charges scale with the processed conversation context and generated output. Credits are calculated from actual usage, converted at 100 credits = $1, then multiplied by 2.5.',
      },
      {
        endpoint: 'POST /assistant/set_system_prompt',
        price: 'Free.',
        notes: 'Stores or clears the account-level assistant system prompt.',
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
