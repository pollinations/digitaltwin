import fetch from 'node-fetch';
import './dotenv.js';
import { addBufferToServer } from './express.js';

/**
 * @param text The sentence to be converted to speech
 * @returns {Promise<{mime: string, buffer: Buffer}>} Object containing MIME type and audio buffer
 */
const ttsRequest = async (text) => {
  const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;

  text = sliceText(text);

  const data = {
    "text": text,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.7
    }
  };

  const buffer = await elevenlabs(elevenLabsUrl, data);
  

  return {
    buffer,
    mimeType: "audio/mpeg"
  }

};


// text should be a maximum of 400 characters. 
// try to slice by punctuation i.e. the last letters,words 
// up to the last punctuation if the size exceeds
function sliceText(text) {
	const maxCharacters = 1000;
	if (text.length > maxCharacters) {
		let slicedText = text.slice(0, maxCharacters);
		const lastPunctuation = slicedText.match(/.*[.!?]/g);
		const lastSpace = slicedText.match(/.* /g);
		if (lastPunctuation && lastPunctuation[0]) {
			slicedText = lastPunctuation[0];
		} else if (lastSpace && lastSpace[0]) {
			slicedText = lastSpace[0];
		}
		return slicedText;
	}
	return text;
}


async function elevenlabs(elevenLabsUrl, data) {

  const response = await fetch(elevenLabsUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: HEADERS
  });

  if (!response.ok) {
    console.error("An error occurred (TTS request)", response.statusText);
    throw new Error("TTS Request failed", response.statusText);
  }

  const buffer = await response.buffer();
  return buffer;
}



const HEADERS = {
  "Accept": "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": process.env.ELEVENLABS_API_KEY
};


export { ttsRequest };
