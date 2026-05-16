# Harvestr - Video Downloader API

A stateless, modular video downloader API built with Express, TypeScript, and `yt-dlp`. Designed for use with iOS Shortcuts.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) must be installed and available in your system's PATH.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Running with Docker

1. Build the image:
   ```bash
   docker build -t harvestr .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 harvestr
   ```

## API Endpoints

### 1. Download Video
`GET /api/download?url=<VIDEO_URL>&format=<mp4|mp3>`

- **url**: The URL of the video to download (required).
- **format**: Either `mp4` (default) or `mp3`.

### 2. Video Info
`GET /api/info?url=<VIDEO_URL>`

- **url**: The URL of the video (required).

## iOS Shortcut Integration

To use this with iOS Shortcuts:

1. Create a new Shortcut.
2. Add a **URL** action and paste your API URL: `http://<YOUR_IP>:3000/api/download?url=`
3. Add a **Get Contents of URL** action.
4. Append the shared URL from the shortcut input to the API URL.
5. Add a **Save File** action to save the resulting video/audio.

## Project Structure

- `src/index.ts`: Entry point.
- `src/modules/downloader/`: Core logic and service for `yt-dlp`.
- `src/routes/`: Express route definitions.
- `src/types/`: TypeScript type definitions.
