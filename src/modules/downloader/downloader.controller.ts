import { Request, Response } from 'express';
import { getStream, getInfo } from './downloader.service';

export const handleDownload = async (req: Request, res: Response): Promise<void> => {
  const { url, format = 'mp4' } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const info = await getInfo(url);
    const filename = `${info.title || 'video'}.${format}`;

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

    const stream = getStream(url, format as string);
    
    stream.stdout.pipe(res);

    stream.stderr.on('data', (data) => {
      console.error(`[yt-dlp stderr]: ${data}`);
    });

    stream.on('close', (code) => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code ${code}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      }
    });

  } catch (error: any) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

export const handleInfo = async (req: Request, res: Response): Promise<void> => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const info = await getInfo(url);
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch video info' });
  }
};
