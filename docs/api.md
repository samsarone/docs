```markdown
# Public API Documentation

This document describes the publicly available endpoints for creating and managing quick video or narrative-generation sessions. All endpoints require a valid `API_KEY` passed through the request headers for authentication.

---

## Base URL

Base URL is https://api.samsar.one/v1/video/


```
POST /create_narrative
POST /create_movie
GET  /status
```



---

## Authentication

All requests must include an `API_KEY` header. For example:

```
API_KEY: YOUR_API_KEY_HERE
```

or

```
api_key: YOUR_API_KEY_HERE
```

If the `API_KEY` is missing, empty, or invalid, the server will respond with an error status:

- **400 Bad Request** if the `API_KEY` is missing or empty.
- **401 Unauthorized** if the `API_KEY` is invalid.

---

## Endpoints

### 1. POST `/create_narrative`

Creates a new "narrative" session. This endpoint is primarily used for generating an output based on multiple text lines (scenes) and optional generative video.

#### Request Headers

- `API_KEY`: String. (Required)

#### Request Body

```json
{
  "input": {
    "prompt_list": [ "...", "..." ],   // OR a single string with newline-delimited prompts
    "speaker": "string",               // (Optional) e.g., "alloy", "echo", "fable", etc.
    "provider": "string",              // (Optional) e.g., "OPENAI" or "PLAYHT"
    "add_generative_video": true,      // (Optional) boolean
    "image_model": "string",           // (Required) e.g. "FLUX1.1PRO", "IMAGEN3", etc.
    "video_model": "string",           // (Optional but required if add_generative_video = true)
    "aspect_ratio": "string"           // (Optional) e.g., "16:9", "9:16"
  },
  "webhookUrl": "https://your-webhook-url.com"
}
```

| Field                  | Type      | Required | Description                                                                                   |
|------------------------|-----------|----------|-----------------------------------------------------------------------------------------------|
| `prompt_list`          | array or string | **Yes**  | Each line of the narrative (scenes). If a string, lines are split by newline. Cannot exceed 20 lines. |
| `speaker`              | string    | No       | Speaker voice to use if TTS is part of the generation (e.g., `alloy`, `echo`, etc.).          |
| `provider`             | string    | No       | TTS provider (e.g., `OPENAI`, `PLAYHT`).                                                      |
| `add_generative_video` | boolean   | No       | Whether or not to include generative video in the narrative.                                  |
| `image_model`          | string    | **Yes**  | The image model used for generating images (e.g., `FLUX1.1PRO`, `IMAGEN3`, etc.). Must be an **express** model if you want immediate support. |
| `video_model`          | string    | Required if `add_generative_video` = true | The video model used (e.g., `RUNWAYML`, `KLINGIMGTOVIDPRO`). Must be an **express** model if you want immediate support. |
| `aspect_ratio`         | string    | No       | Aspect ratio for the final output (e.g., `16:9`, `9:16`).                                     |
| `webhookUrl`           | string    | No       | If provided, the system may send callbacks to this URL with status updates or final results.  |

#### Validation Rules

- `prompt_list` must not be empty and must not exceed 20 lines.
- `image_model` must be a valid image-generation model (and ideally one marked as `isExpressModel: true` in your system’s configuration if you require immediate generation).
- If `add_generative_video` is `true`, `video_model` must be provided and must be a valid video-generation model (similarly with `isExpressModel: true`).
- If any validations fail, returns a **400 Bad Request** response with an error message.

#### Response

```json
{
  "request_id": "some-session-id"
}
```

- `request_id`: A unique identifier for the narrative-generation request. Use this ID to query status via the `/status` endpoint.

**Note**: In the provided code snippet, a direct response is currently missing. You should ensure your implementation includes a final `res.status(200).json({ request_id: sessionId })` or a similar JSON response.

---

### 2. POST `/create_movie`

Creates a new movie-generation session based on a single prompt. 

#### Request Headers

- `API_KEY`: String. (Required)

#### Request Body

```json
{
  "input": {
    "prompt": "string",
    "aspect_ratio": "string",
    "image_model": "string",
    "video_model": "string",
    "duration": 30
  },
  "webhookUrl": "https://your-webhook-url.com"
}
```

| Field           | Type   | Required | Description                                                                                              |
|-----------------|--------|----------|----------------------------------------------------------------------------------------------------------|
| `prompt`        | string | **Yes**  | The text prompt for generating the movie. Cannot exceed 500 characters.                                 |
| `aspect_ratio`  | string | No       | Desired aspect ratio (e.g., `"16:9"`, `"9:16"`).                                                         |
| `image_model`   | string | **Yes**  | Image model key (must be valid and typically `isExpressModel: true`).                                   |
| `video_model`   | string | **Yes**  | Video model key (must be valid and typically `isExpressModel: true`).                                   |
| `duration`      | number | **Yes**  | Duration in seconds. Must be a valid number ≤ 120.                                                       |
| `webhookUrl`    | string | No       | If provided, the system may send callbacks to this URL with status updates or final results.            |

#### Validation Rules

- `prompt` is required and cannot be empty or exceed 500 characters.
- `image_model` must be among the recognized image-generation models and typically flagged `isExpressModel: true`.
- `video_model` must be among the recognized video-generation models and typically flagged `isExpressModel: true`.
- `duration` must be a number and cannot exceed 120 seconds.
- If any validations fail, returns a **400 Bad Request** with an error message.

#### Response

A `200 OK` response with JSON:

```json
{
  "request_id": "some-session-id"
}
```

- `request_id`: A unique identifier for the movie-generation request. Use this ID to query status via the `/status` endpoint.

---

### 3. GET `/status`

Retrieves the current status of a previously created session (either narrative or movie).

#### Request Headers

- `API_KEY`: String. (Required)

#### Query Parameters

- `request_id`: **Required**. The unique ID you received from either `/create_narrative` or `/create_movie`.

Example request:  
```
GET /status?request_id=some-session-id
```

#### Response

On success, returns HTTP 200 with a JSON structure similar to:

```json
{
  "status": "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED",
  "progress": 45,
  "result": { ... }, 
  "message": "Additional info if any"
}
```

- `status`: A string indicating the request’s state (the exact enumerations depend on your system; common values might be `"PENDING"`, `"IN_PROGRESS"`, `"COMPLETED"`, `"FAILED"`, etc.).
- `progress`: (Optional) Numeric indicator of how far along the process is (0–100).
- `result`: (Optional) May include links or final outputs if completed.
- `message`: (Optional) Additional information, error details, or human-readable status.

If `request_id` is missing, returns a **400 Bad Request**:

```json
{
  "message": "taskId query parameter is missing."
}
```

If an internal error occurs while fetching the status, returns a **500 Internal Server Error** with an error message.

---

## Common Errors

- **400 Bad Request**  
  Occurs if required fields are missing or invalid (e.g., missing `prompt`, exceeding length limits, invalid model keys, missing `request_id` query parameter).

- **401 Unauthorized**  
  Occurs if the supplied `API_KEY` is invalid.

- **500 Internal Server Error**  
  Occurs if an unexpected error happens on the server (e.g., database issue, unhandled exception).

---

## Webhook Usage

If you supply a `webhookUrl` in the request body (`/create_narrative` or `/create_movie`), the server may send asynchronous callbacks (HTTP POST) to that URL with status updates. The exact payload of these callbacks is determined by your system’s implementation, but typically includes:

- `request_id` (for correlating to your original request)
- `status`
- `progress`
- (Once finished) a result payload with the final output or any relevant data

Ensure your webhook endpoint is accessible externally and can handle JSON POST requests.

---

## Example Workflow

1. **Create a narrative**:
   ```bash
   curl -X POST https://api.yourserver.com/create_narrative \
     -H "Content-Type: application/json" \
     -H "API_KEY: YOUR_API_KEY_HERE" \
     -d '{
       "input": {
         "prompt_list": ["Scene 1", "Scene 2"],
         "speaker": "alloy",
         "provider": "OPENAI",
         "add_generative_video": true,
         "image_model": "FLUX1.1PRO",
         "video_model": "RUNWAYML",
         "aspect_ratio": "16:9"
       },
       "webhookUrl": "https://yourwebhook.com/hook"
     }'
   ```

   Response:
   ```json
   {
     "request_id": "abc12345"
   }
   ```

2. **Get status of your request**:
   ```bash
   curl -X GET "https://api.yourserver.com/status?request_id=abc12345" \
     -H "API_KEY: YOUR_API_KEY_HERE"
   ```

   Response (example):
   ```json
   {
     "status": "IN_PROGRESS",
     "progress": 20,
     "message": "Processing..."
   }
   ```

3. **Webhook callback** (if `webhookUrl` is provided, your system might POST to that URL):
   ```json
   {
     "request_id": "abc12345",
     "status": "COMPLETED",
     "result": {
       "videoUrl": "https://your-cdn.com/videos/abc12345.mp4"
     },
     "message": "All done!"
   }
   ```

---

## Additional Notes

- Always validate your input prior to calling these endpoints to avoid unnecessary errors.
- The `request_id` you receive can be used to poll `/status` or to match incoming webhook callbacks.
- The valid models (`image_model`, `video_model`, etc.) are configured within the application (see `IMAGE_GENERAITON_MODEL_TYPES` and `VIDEO_GENERATION_MODEL_TYPES` for examples). Some models may not be immediately supported or may require special permissions.

---

**Last Updated**: February 14, 2025
