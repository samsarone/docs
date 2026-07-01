---
title: Introducing the SamsarOne Public API
description: Generate videos, enhance images, improve copy, and run assistant completions with a unified /v1 API.
tags: [api, video, image, chat, assistant, embeddings]
---

If you’re building a product that needs content at scale—short-form videos, cleaned-up images, and high-quality copy—you don’t want three separate services with three different auth schemes and job systems.

The **SamsarOne Public API** gives you a single base URL and a consistent workflow across:

- **Video generation** from text prompts or ordered image sequences
- **Image operations** like upscale/denoise and text removal for whitelabel assets
- **Chat + embeddings** for copy enhancement and semantic search over your own JSON data
- **Assistant completions** for OpenAI-compatible, session-aware responses

This post is a practical, developer-focused tour of the public endpoints, the common patterns (async jobs + status polling), and a few “full pipeline” examples you can adapt to your own app.

## Quickstart: one request, one status poll

Most video and image endpoints are asynchronous:

1. **Submit** a request and receive a `request_id` / `session_id`.
2. **Poll** `GET /status?request_id=...` until `COMPLETED` (or `FAILED` / `CANCELLED`).
3. **Download** the resulting asset from `result_url` (or `result_urls`). Completed video responses also include `has_subtitles` and `result_language` when session metadata is available.

Example: start a text-to-video job (subtitles enabled with a specific font):

```bash
curl -X POST https://api.samsar.one/v1/video/text_to_video \
  -H "Authorization: Bearer $SAMSAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "A timelapse of clouds over a futuristic city at sunrise",
      "duration": 30,
      "image_model": "GPTIMAGE2",
      "video_model": "RUNWAYML",
      "tone": "grounded",
      "aspect_ratio": "16:9",
      "language": "en",
      "enable_subtitles": true,
      "font_key": "Poppins"
    }
  }'
```

Then poll:

```bash
curl "https://api.samsar.one/v1/status?request_id=vid_a1b2c3d4" \
  -H "Authorization: Bearer $SAMSAR_API_KEY"
```

When complete, you’ll receive a `result_url` to the rendered video, plus video metadata such as `has_subtitles` and `result_language`.

## The API at a glance

- Base URL: `https://api.samsar.one/v1`
- Auth (recommended): `Authorization: Bearer <API_KEY>`
  - The API also accepts `API_KEY: <API_KEY>` in headers, and in some cases a bearer JWT user auth token.
- Content type: `application/json`
- Credits: most endpoints return usage headers when applicable:
  - `x-credits-charged`
  - `x-credits-remaining`

### Core routes

**Video**

- `POST /video/text_to_video` — generate a clip from a text prompt
- `POST /video/image_list_to_video` — generate a clip from an ordered image list (+ optional metadata)
- `POST /video/upload_image_data` — upload data URLs and get hosted `image_urls` back
- `POST /video/add_outro_image` — clone a session and append/replace an outro image layer
- `POST /video/update_outro_image` — update the outro image layer in a session clone (when an outro already exists)
- `POST /video/translate_video` — translate a completed session to a new language (creates a new session)
- `POST /video/retranslate_video` — alias for translating a completed session to a new language
- `POST /video/join_videos` — append multiple sessions into one (creates a new session)
- `POST /video/clone` and `POST /v2/video/clone` — deep-copy a completed session and render a new final video URL
- `POST /video/add_subtitles` — clone a session and add subtitle overlays before re-rendering
- `POST /video/remove_subtitles` — clone a session and remove text overlays before re-rendering
- `POST /video/cancel_render` — cancel an in-progress render for a session
- `GET /video/fetch_latest_version` — fetch the latest available render URL for a `session_id`

**Image**

- `POST /image/assign_title` — assign a short SEO-friendly image title from a file, data URL, or image URL (synchronous)
- `POST /image/enhance` — upscale/denoise
- `POST /image/remove_branding` — remove visible text from an image
- `POST /image/add_image_set` — save/extend an image set for downstream generation, including optional `aspect_ratio`
- `POST /image/create_rollup_banner` — generate a rollup banner from a tile list
- `POST /image/enhance_and_generate_rollup_banner` — (if needed) enhance low-res tiles, then generate a rollup banner
- `GET /image/status` — status for image jobs (accepts `request_id` or `session_id`)
- `GET /image/list` — list recent image sessions (history + current statuses)

**Chat**

- `POST /chat/enhance` — improve copy with optional metadata and language hints (synchronous)
- Embeddings:
  - `POST /chat/create_embedding` — create from JSON records or URL input
  - `POST /chat/create_embedding_from_url` — explicit URL-only create route
  - `POST /chat/update_embedding`
  - `POST /chat/search_against_embedding(s)`
  - `POST /chat/similar_to_embedding(s)`
  - `POST /chat/delete_embedding` / `POST /chat/delete_embeddings`
  - `GET /chat/embedding_templates`
  - `GET /chat/embedding_status`

**Assistant**

- `POST /assistant/set_system_prompt` — store or clear the account-level system prompt
- `POST /assistant/completion` — create a synchronous assistant response in modern OpenAI Responses format

**Platform / billing / status**

- `GET /health` — health check
- `GET /supported_fonts` — supported fonts by language code (no auth)
- `GET /status` — status for any video/image request id
- Credits + Stripe:
  - `GET /credits`
  - `POST /credits/recharge`
  - `POST /enable_autorecharge`
  - `POST /auto_recharge/threshold`
  - `GET /payment_status` (also supports `POST`)
- Client auth helpers:
  - `POST /create_login_token` (also supports `GET`)
  - `GET /users/verify_token?loginToken=...` (exchange login token for a long-lived client `authToken`)

## Video: prompts, image sequences, and post-processing

The Video API is built around a simple idea: enqueue a render job, then check status until a URL is ready.

### Generate from text

Use `POST /video/text_to_video` when you have a prompt and want the API to handle the rest. The request supports model selection, duration, aspect ratio, and subtitle settings:

```json
{
  "input": {
    "prompt": "Required text, max 1000 chars",
    "image_model": "GPTIMAGE2 | NANOBANANA2 | NANOBANANAPRO | SEEDREAM",
    "video_model": "VEO3.1I2V | VEO3.1I2VFAST | COSMOS3SUPERI2V | SEEDANCEI2V | KLINGIMGTOVID3PRO | HAPPYHORSEI2V | RUNWAYML",
    "duration": 30,
    "tone": "grounded | cinematic",
    "aspect_ratio": "16:9 | 9:16",
    "language": "auto | en | es | fr | de | pt | it | nl | sv | hi | ar | ru | ja | ko | th | zh",
    "enable_subtitles": true,
    "font_key": "Poppins"
  },
  "webhookUrl": "https://example.com/webhook"
}
```

### Generate from an image list (story-first)

If you already have images—product shots, frames, key visuals—`POST /video/image_list_to_video` creates a narrative and renders a clip from an ordered list:

- `image_urls`: list of URLs (strings, or objects containing `image_url` / `enhanced_url`)
- `metadata`: optional object that helps the narrative builder
- `prompt`: optional direction (“fast-paced teaser”, “grounded walkthrough”, etc.)
- `video_model`: optional; supports `VEO3.1I2V`, `VEO3.1I2VFAST`, `COSMOS3SUPERI2V`, `SEEDANCEI2V`, `KLINGIMGTOVID3PRO`, `HAPPYHORSEI2V`, and `RUNWAYML`
- `image_model`: optional; supports `GPTIMAGE2`, `NANOBANANA2`, `NANOBANANAPRO`, `SEEDREAM`, and `CUSTOM_TEXT_TO_IMAGE`
- `aspect_ratio`: optional; supports `16:9` and `9:16`
- `backingtrack_model` / `music_provider`: optional; choose `LYRIA3` for Google Lyria 3 Pro native backing tracks or `ELEVENLABS_MUSIC`
- `outro_image_url`: optional final card or brand frame
- `generate_outro_image`: optional server-side CTA outro generation from the input images with either `cta_url` for a QR center image or `outro_cta_image` for a supplied center logo/CTA image
- `add_footer_animation`: optional per-scene footer QR section using `footer_metadata`
- `limit_single_narrator`: optional single narrator constraint for narration scenes
- `add_narrator_avatar`: optional influencer-style human narrator avatar overlay; automatically enables `limit_single_narrator` and adds 4 credits/sec

Use either a provided outro image or a generated CTA outro in a single request, not both. `outro_cta_image` uses `{ "top_text", "middle_image", "bottom_text" }`.

Tip: if your images start life as base64/data URLs, first call `POST /video/upload_image_data` to get hosted URLs back.

### Post-processing: outro, translate, join, remove subtitles

Once you have a completed session, you can build “edit-like” workflows purely via API:

- **Add or update an outro**:
  - `POST /video/add_outro_image` appends (or replaces) an outro in a cloned session.
  - `POST /video/update_outro_image` updates the existing outro layer in a cloned session when an outro already exists.
- **Translate a session**: `POST /video/translate_video` (or `POST /video/retranslate_video`) creates a new session and runs the minimum required stages to output a translated video. The translate payload uses `enable_subtitles` (default `false`), `translate_outro` (default `true`), and `translate_footer` (default `true`); use the outro update routes when the image itself needs replacement.
- **Join sessions**: `POST /video/join_videos` appends multiple completed sessions into one new render (optionally blending scene boundaries).
- **Deep clone a session**: `POST /video/clone` or `POST /v2/video/clone` copies an owned completed session and queues only final video generation so the copy gets a new rendered video path and URL. This clone route is free.
- **Add subtitles**: `POST /video/add_subtitles` clones the session, adds text overlays, and rerenders frames/video.
- **Remove subtitles**: `POST /video/remove_subtitles` clones the session, strips text overlays, and rerenders frames/video.
- **Cancel a render**: `POST /video/cancel_render` cancels an in-progress render for a session id.
- **Fetch the newest available render URL**: `GET /video/fetch_latest_version?session_id=...` returns `result_url`, `has_subtitles`, and `result_language` when ready (or `202` while pending).

## Image: enhance, whitelist, and build rollups

The Image API is designed for production asset cleanup:

- Upscale/denoise (for low-res inputs that need to look crisp in motion)
- Remove visible text for marketplaces, partners, or repurposed creative
- Assign short SEO-friendly titles for image filenames or listing titles
- Manage image sets (save a batch once, then reuse downstream)
- Build rollup banners (tile-based promotional composites)

Generation and editing endpoints enqueue work; poll `GET /image/status` (or `GET /status`) using the returned `request_id`. `POST /image/assign_title` returns synchronously with `{ "content": "..." }`.

### A common pipeline: clean → enhance → rollup

One pattern we see often:

1. Remove branding on a partner-supplied image with `POST /image/remove_branding`
2. Upscale with `POST /image/enhance` (pick `resolution: 1k | 2k | 4k`)
3. Generate a tile-based composite with `POST /image/create_rollup_banner`

If you want the system to automatically enhance low-res tiles before producing the composite, use:

- `POST /image/enhance_and_generate_rollup_banner`

You can also query history and current results with `GET /image/list?limit=...`.

## Chat: copy enhancement and embeddings for your data

Chat endpoints are synchronous: you submit a request and get a response in the same call.

### Enhance copy with metadata

Use `POST /chat/enhance` to rewrite a message while keeping intent. You can provide `metadata` (audience, platform, tone) and a `language` hint:

```json
{
  "message": "launching soon, stay tuned!",
  "metadata": { "channel": "instagram", "tone": "playful" },
  "language": "FR"
}
```

### Embeddings: semantic search over your records or URLs

Embeddings endpoints turn either a JSON array or a URL list into a searchable template:

- `POST /chat/create_embedding` — create a template from JSON records or `urls`
- `POST /chat/create_embedding_from_url` — explicit URL-only create route
- `POST /chat/search_against_embedding` — natural language query + optional structured filters
- `POST /chat/similar_to_embedding` — “show me more like this” from a query term or JSON payload
- `POST /chat/update_embedding` — upsert records later
- `POST /chat/delete_embedding(s)` — clean up by record id or wipe a template

This is a powerful building block for:

- product catalogs (“show me listings like this under $X”)
- internal docs (“find similar incident reports”)
- real estate, travel, marketplaces—any domain where you have semi-structured records plus free text

## Credits and operational endpoints

SamsarOne uses a credit-based billing model (**1 USD = 100 credits**). A few endpoints you’ll want in every integration:

- `GET /credits` — read your balance (and the latest top-up metadata)
- `POST /credits/recharge` — create a Stripe checkout link for a credit top-up
- `POST /enable_autorecharge` + `POST /auto_recharge/threshold` — keep production systems from stalling due to low balance
- `GET /payment_status` — poll Stripe checkout/setup completion
- `GET /health` — monitoring/uptime checks

You can also use `POST /create_login_token` to mint a short-lived login token that your client can exchange for a long-lived `authToken` via `GET /users/verify_token`.

## Best practices (what we’ve learned from production integrations)

- **Keep API keys server-side.** If you need client auth, mint a short-lived login token and exchange it for a client `authToken`.
- **Treat `request_id` as your primary handle.** Store it with your own job ids; poll `GET /status` until terminal states.
- **Watch credit headers.** Capture `x-credits-charged` / `x-credits-remaining` for usage tracking and alerting.
- **Expect usage-based assistant pricing.** Assistant requests scale with the amount of conversation context and answer generated, so larger multimodal requests will cost more than short text-only prompts.
- **Handle `402` explicitly.** Many endpoints return `402` when credits are insufficient—hook this into your top-up / auto-recharge flow.
- **Use a webhook for video when you can.** For long renders, webhooks reduce polling and make your system more event-driven.
- **Send `x-request-id` for traceability.** If you log request ids end-to-end, support and debugging get much easier.

## Get started

If you want to dive straight into the request/response schemas, start here:

- [Generative API overview](/intro)
- [Video API](/video)
- [Image API](/image-api)
- [Chat API](/chat-api)
- [Assistant API](/assistant-api)
- [Credits API](/credits)
- [Login Tokens](/login-tokens)

And if you prefer to try requests interactively first, the docs include a Playground for video, image, and chat workflows.
