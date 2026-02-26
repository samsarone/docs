---
title: Generative API overview
description: Unified generative APIs for enterprise use-cases.
sidebar_position: 0
sidebar_label: Overview
slug: /intro
---

# Generative API overview

SamsarOne offers unified generative endpoints for video, image, and chat workflows. Use the `/video` API to generate clips from prompts, `/image` to enhance or edit assets (whitelabel assets, upscale, manage image sets), and `/chat` to Enhance copy with rich metadata in a single call. Requests return credit headers so you can track usage in real time.

**Credits**  
Authenticate with `Authorization: Bearer <API_KEY>`. Credits are debited per endpoint as documented on each page, and responses include `x-credits-charged` / `x-credits-remaining` when applicable. Manage and purchase credits in the Samsar app billing settings.

**Base URL**  
`https://api.samsar.one/v1`

**Jump to API docs**
- [Login Tokens](/login-tokens)
- [Video API](/video)
- [Image API](/image-api)
- [Chat API](/chat-api)
- [Credits API](/credits)
