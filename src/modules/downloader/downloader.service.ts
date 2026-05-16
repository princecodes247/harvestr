import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  id: string;
}

export const getInfo = (url: string): Promise<VideoInfo> => {
  return new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', [
      '--dump-json',
      '--no-playlist',
      url
    ]);

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp info failed: ${errorOutput}`));
        return;
      }

      try {
        const data = JSON.parse(output);
        resolve({
          title: data.title,
          thumbnail: data.thumbnail,
          duration: data.duration,
          uploader: data.uploader,
          id: data.id
        });
      } catch (e) {
        reject(new Error('Failed to parse yt-dlp output'));
      }
    });
  });
};

export const getStream = (url: string, format: string = 'mp4'): ChildProcessWithoutNullStreams => {
  const args = [
    '--no-playlist',
    '-o', '-', // Output to stdout
  ];

  if (format === 'mp3') {
    args.push('-x', '--audio-format', 'mp3');
  } else {
    // For video, we want a format that is compatible with iOS (usually mp4/h264)
    args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
  }

  args.push(url);

  return spawn('yt-dlp', args);
};
