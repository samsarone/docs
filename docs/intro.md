---
title: SamsarOne API Docs
description: "Explore SamsarOne's unified generative APIs for video, image, chat, assistant workflows, credits, and external-user integrations."
image: img/og/samsar-docs-overview.png
sidebar_position: 0
sidebar_label: Overview
slug: /intro
---

# Generative API overview

SamsarOne offers unified generative endpoints for video, image, chat, and assistant workflows. Use the `/video` API to generate clips from prompts, `/image` to enhance or edit assets (whitelabel assets, upscale, manage image sets), `/chat` to improve copy or work with embeddings, and `/assistant` for OpenAI-compatible assistant completions tied to existing Samsar sessions. Requests return credit headers so you can track usage in real time.

**Credits**<br />
Authenticate with `Authorization: Bearer <API_KEY>`. Credits are debited per endpoint as documented on each page, and responses include `x-credits-charged` / `x-credits-remaining` when applicable. Manage and purchase credits in the Samsar app billing settings.

**Base URL**<br />
`https://api.samsar.one/v1`

**Jump to API docs**
- [Login Tokens](/login-tokens)
- [Video API](/video)
- [Image API](/image-api)
- [Chat API](/chat-api)
- [Assistant API](/assistant-api)
- [Credits API](/credits)
- [Publications API](/publications)
