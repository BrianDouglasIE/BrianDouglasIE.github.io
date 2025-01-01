import { parentPort, workerData } from 'worker_threads';
import { generateOGImage } from './og-image-generator.js';

(async () => {
  try {
    const result = await generateOGImage(workerData);
    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
})();
