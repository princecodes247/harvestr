import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { spawnSync } from 'child_process';
import downloadRoutes from './modules/downloader/download.routes';

dotenv.config();

const checkDependencies = () => {
  const deps = ['yt-dlp', 'ffmpeg'];
  console.log('[server]: Checking system dependencies...');
  
  deps.forEach(dep => {
    const check = spawnSync(dep, ['--version']);
    if (check.error) {
      console.error(`[critical]: ${dep} is not installed or not in PATH.`);
      process.exit(1);
    }
  });
  console.log('[server]: All dependencies (yt-dlp, ffmpeg) are present.');
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', downloadRoutes);

checkDependencies();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
