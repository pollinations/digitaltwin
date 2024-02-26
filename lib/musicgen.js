import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * Sanitizes the prompt for use in filenames.
 * @param prompt The prompt to sanitize.
 * @returns A sanitized version of the prompt.
 */
const sanitizePrompt = prompt => {
  return prompt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 200);
};

/**
 * Ensures the specified directory exists, creating it if necessary.
 * @param dirPath The path to the directory.
 */
const ensureDirectoryExists = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * @param prompt The prompt for generating music
 * @returns The path to the downloaded generated music track
 */
const generateAudio = async prompt => {
  const sanitizedPrompt = sanitizePrompt(prompt);
  const localUrl = `http://150.136.112.172:6688/predictions`;

  const localData = {
    "input": {
      "model": "facebook/audio-magnet-medium",
      "prompt": sanitizedPrompt,
      "variations": 1,
    }
  };

  try {
    const localResponse = await fetch(localUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localData)
    });
    if (localResponse.ok) {
      const jsonResponse = await localResponse.json();
      if (jsonResponse.output) {
        const audioBase64 = jsonResponse.output[0].split(',')[1];
        const buffer = Buffer.from(audioBase64, 'base64');
        const cacheDir = path.join('/tmp', 'portraitcache');
        ensureDirectoryExists(cacheDir);
        const filePath = path.join(cacheDir, `${sanitizedPrompt}.wav`);
        fs.writeFileSync(filePath, buffer);
        return filePath;
      }
    } else {
      console.log("Local service failed, falling back to Replicate API.");
    }
  } catch (error) {
    console.error("An error occurred with the local service", error);
  }

  // Fallback to Replicate API if local service fails
  const replicateUrl = `https://api.replicate.com/v1/predictions`;
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    throw new Error('REPLICATE_API_TOKEN is not defined');
  }

  const headers = {
    "Authorization": `Token ${apiKey}`,
    "Content-Type": "application/json"
  };

  const replicateData = {
    "version": "e8e2ecd4a1dabb58924aa8300b668290cafae166dd36baf65dad9875877de50e",
    "input": {
      "prompt": sanitizedPrompt,
      "variations": 1,
      "model": Math.random() < 0.5 ? "facebook/audio-magnet-medium" : "facebook/magnet-medium-10secs"
    }
  };

  try {
    const response = await fetch(replicateUrl, {
      method: 'POST',
      body: JSON.stringify(replicateData),
      headers: headers
    });

    if (!response.ok) {
      console.error("An error occurred (Music generation request)", response.statusText);
      return null;
    }

    const prediction = await response.json();
    const predictionId = prediction.id;
    let outputUrl = null;

    while (!outputUrl) {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: headers
      });
      const statusJson = await statusResponse.json();
      if (statusJson.output) {
        outputUrl = statusJson.output[0];
        break;
      }
      // Poll every 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (outputUrl) {
      // Download the audio file
      const audioResponse = await fetch(outputUrl);
      if (audioResponse.ok) {
        const buffer = await audioResponse.buffer();
        const cacheDir = path.join('/tmp', 'portraitcache');
        ensureDirectoryExists(cacheDir);
        const filePath = path.join(cacheDir, `${sanitizedPrompt}.wav`);
        fs.writeFileSync(filePath, buffer);
        return filePath;
      } else {
        console.error("Failed to download the audio file", audioResponse.statusText);
      }
    }
  } catch (error) {
    console.error("An error occurred (Music generation request)", error);
  }
  return null;
};

export { generateAudio };



// generateAudio("crickets").then(console.log)