import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Transcribes audio to text using OpenAI's Whisper API.
 * @param {Buffer} audioBuffer - The audio file buffer to transcribe.
 * @returns {Promise<string>} The transcribed text.
 */
const transcribeAudio = async (audioBuffer) => {
  const formData = new FormData();
  formData.append('file', audioBuffer, 'audio.mp3');
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to transcribe audio: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

export { transcribeAudio };
