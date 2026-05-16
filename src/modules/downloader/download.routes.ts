import { Router } from 'express';
import { handleDownload, handleInfo } from './downloader.controller';

const router = Router();

// Endpoint for downloading video
router.get('/download', handleDownload);

// Endpoint for getting video info
router.get('/info', handleInfo);

export default router;
