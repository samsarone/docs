---

title: API Docs
description: API Docs for using our API.
sidebar\_position: 1
--------------------

# API Docs

## Base URL

`https://api.samsar.one/v1/video/`

---

## Authentication

> **Header (required)**
>
> `Authorization: Bearer YOUR_API_KEY`
>
> Create and manage API keys in your dashboard. Register for an account and create an API key from account settings [here](https://app.samsar.one).

| Code | Reason                            |
| ---- | --------------------------------- |
| 400  | Missing or empty `API_KEY` header |
| 401  | Invalid `API_KEY`                 |

---

## Supported Models

### Image Models

| Name        | Key         |
| ----------- | ----------- |
| GPT Image 1 | `GPTIMAGE1` |
| Imagen 4    | `IMAGEN4`   |

### Video Models

| Name                   | Key                   |
| ---------------------- | --------------------- |
| Runway Gen‑4 (Default) | `RUNWAYML`            |
| Kling 2.1 Pro          | `KLINGIMGTOVID2.1PRO` |

---

## Pricing

### Per‑second rates

| Model / Item | Credits / sec | Notes                                    |
| ------------ | ------------: | ---------------------------------------- |
| *All models* |        **10** | Applies to every model supported by API. |

### Subscription plan

| Plan         | Included credits / mo | Notes          |
| ------------ | --------------------: | -------------- |
| Creator Plan | $49.99 **5 000 credits**     | Billed monthly |
Individual credits can also be purchased from the website $10/1000 credits.


---

## Endpoints

### POST `/create`

Creates a new video‑generation session.

#### Request Body Parameters

| Field         | Type & Constraints                         | Required | Default     | Description                                       |
| ------------- | ------------------------------------------ | -------- | ----------- | ------------------------------------------------- |
| `prompt`      | `string` (≤ 500 characters)                | **Yes**  | —           | Text prompt that drives image & video generation. |
| `duration`    | `number` seconds (≤ 120)                   | No       | `30`        | Desired video length.                             |
| `image_model` | `string` `GPTIMAGE1` \| `IMAGEN4`            | No       | `GPTIMAGE1` | Key for the underlying image‑generation model.    |
| `video_model` | `string` `RUNWAYML` \| `KLINGIMGTOVID2.1PRO` | No       | `RUNWAYML`  | Key for the video‑synthesis engine.               |
| `tone`        | `string` `grounded` \| `cinematic`           | No       | `grounded`  | Overall stylistic tone of the output.             |
| `aspect ratio`        | `string` `9:16` \| `16:9`           | No       | `16:9`  | Aspect ratio of the result             |

#### Example Request

```
curl -X POST https://api.samsar.one/v1/video/create \
  -H "Authorization: Bearer 74c4bbbee28e7e221330e48c2cdd897acad510" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "An astronaut cat exploring a neon‑lit Mars colony",
      "duration": 30,
      "image_model": "IMAGEN4",
      "video_model": "KLINGIMGTOVID2.1PRO",
      "tone": "grounded",
      "aspect_ratio": "16:9"
    }
  }'

```

#### Successful Response

```json
{
  "session_id": "vid_1234567890"
}
```

| Code | Reason               |
| ---- | -------------------- |
| 201  | Session created      |
| 400  | Validation error     |
| 401  | Authentication error |

#### Failure Response (Example)

```json
{
  "message": "Invalid movie prompt."
}
```

---

### GET `/status`

Fetches the current state of a generation session.

#### Query Parameters

| Param        | Type   | Required | Description                       |
| ------------ | ------ | -------- | --------------------------------- |
| `session_id` | string | **Yes**  | Identifier returned by `/create`. |

#### Example Request

```bash
curl -X GET "https://api.samsar.one/v1/video/status?request_id=vid_1234567890" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Possible Responses

| Scenario                 | Example Payload                                                        | Code |
| ------------------------ | ---------------------------------------------------------------------- | ---- |
| **Processing / Pending** | See below                                                              | 200  |
| **Completed**            | `{ "video_link": "https://cdn.samsar.one/videos/vid_1234567890.mp4" }` | 200  |
| **Invalid request**      | `{ "message": "Missing or invalid session_id." }`                      | 400  |
| **Not found**            | —                                                                      | 404  |
| **Authentication error** | —                                                                      | 401  |

##### Pending Payload Structure

```json
{
  "status": "PENDING",
  "details": {
    "prompt_generation": "COMPLETED",
    "image_generation": "COMPLETED",
    "audio_generation": "COMPLETED",
    "frame_generation": "INIT",
    "video_generation": "INIT",
    "ai_video_generation": "PENDING",
    "speech_generation": "COMPLETED",
    "music_generation": "COMPLETED",
    "lip_sync_generation": "INIT",
    "sound_effect_generation": "INIT",
    "transcript_generation": "INIT"
  }
}
```

##### Success Payload Structure

```json
{
  "status": "COMPLETED",
  "url": "https://cdn.samsar.one/videos/vid_1234567890.mp4"
}
```

---
