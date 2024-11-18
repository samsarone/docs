# API Documentation

This API allows external users to create video sessions and poll for their completion status.

## Authentication

All endpoints require an `API_KEY` to be provided in the request headers. The `API_KEY` can be obtained from your user account.

**Headers**:

- `API_KEY`: Your API key for authentication.

## Endpoints

### POST `/create`

Creates a new video session with the specified parameters.

#### Headers

- `API_KEY` (string): Your API key for authentication.

#### Request Body Parameters

- `lineItems` (array of strings): The text lines or sentences to be included in the video.
- `videoType` (string): The type of video to create. Possible values: `"Slideshow"`, `"Infinitezoom"`.
- `animation` (string): The animation style to use. Possible values include `"preset_short_animation"`, `"zoom_in"`, `"zoom_out"`, `"pan_left_to_right"`, `"pan_right_to_left"`, `"random"`, `"alternate_zoom"`, `"alternate_pan"`.
- `duration` (number): The duration of each scene in seconds.
- `sceneCutoffType` (string): How to cut off scenes. Possible values: `"auto"`, `"manual"`.
- `theme` (string): Custom theme keywords to guide the video generation.
- `speakerType` (string): The type of speaker voice to use. Default is `"alloy"`.
- `speechLanguage` (string): The language code for speech generation (e.g., `"eng"`).
- `subtitlesLanguage` (string): The language code for subtitles.
- `textLanguage` (string): The language code of the original text.
- `fontFamily` (string): The font family to use for subtitles.
- `subtitlesTranslationRequired` (boolean): Whether subtitles translation is required.
- `speechTranslationRequired` (boolean): Whether speech translation is required.
- `backgroundMusicRequired` (boolean): Whether background music is required.
- `speechRequired` (boolean): Whether speech generation is required.
- `speechNormalizationRequired` (boolean): Whether to normalize the speech content.
- `addSubtitlesRequired` (boolean): Whether to add subtitles to the video.
- `themeType` (string): The type of theme to use. Possible values: `"basic"`, `"parentText"`, `"derivedText"`, `"parentJson"`, `"derivedJson"`.
- `themeData` (string): Theme data in text or JSON format depending on `themeType`.
- `addTranscriptionsRequired` (boolean): Whether to add transcriptions to the video.
- `imageModel` (string): The image model to use for image generation. Possible values: `"DALLE3"`, `"RECRAFTV3"`.
- `bannerText` (string): Text to display as a banner in the video.
- `addBannerToComposition` (boolean): Whether to add a banner to the video composition.
- `aspectRatio` (string): The aspect ratio of the video. Possible values: `"1:1"`, `"16:9"`, `"9:16"`.
- `setAutoDurationPerScene` (boolean): Whether to automatically set the duration per scene.
- `imageStyle` (string): The image style to use with certain image models.

#### Response

On success, returns HTTP status `200` with a JSON body:

```json
{
  "message": "success",
  "taskId": "<taskId>"
}
```

- `message` (string): Success message.
- `taskId` (string): The ID of the created task, which can be used to poll for its completion.

On error, returns appropriate HTTP status code and JSON message.

### GET `/poll_video_completion`

Polls the completion status of a video generation task.

#### Headers

- `API_KEY` (string): Your API key for authentication.

#### Query Parameters

- `taskId` (string): The ID of the task to poll, obtained from the `/create` endpoint.

#### Response

On success, returns HTTP status `200` with a JSON body indicating the status of the task:

```json
{
  "status": "PENDING",
  "expressGenerationStatus": {
    "prompt_generation": "COMPLETED",
    "image_generation": "PENDING",
    "audio_generation": "PENDING",
    "frame_generation": "INIT",
    "video_generation": "INIT"
  }
}
```

- `status` (string): The overall status of the task. Possible values: `"PENDING"`, `"COMPLETED"`.
- `expressGenerationStatus` (object): Detailed status of each generation step.

If the task is completed, the response includes:

```json
{
  "status": "COMPLETED",
  "expressGenerationStatus": { ... },
  "videoLink": "<videoLink>"
}
```

- `videoLink` (string): The URL to download or view the generated video.

On error, returns appropriate HTTP status code and JSON message.

