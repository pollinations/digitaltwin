const dotenv = require('dotenv')
dotenv.config();
dotenv.config({ path: "config.env" });
const fetch = require('node-fetch');

/**
 * @param text The sentence to be converted to speech
 * @returns Audio buffer
 */
async function ttsRequest(text) {
	const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;

	const apiKey = process.env.ELEVENLABS_API_KEY;
	if (!apiKey) {
		throw new Error('ELEVENLABS_API_KEY is not defined');
	}

	const headers = {
		"Accept": "audio/mpeg",
		"Content-Type": "application/json",
		"xi-api-key": apiKey
	};

	text = sliceText(text);

	const data = {
		"text": text,
		"model_id": "eleven_multilingual_v2",
		"voice_settings": {
			"stability": 0.5,
			"similarity_boost": 0.7
		}
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: headers
		});

		if (!response.ok) {
			console.error("An error occured (TTS request)", response.statusText);
			return null;
		}

		const buffer = await response.buffer();
		return buffer;

	} catch (error) {
		console.error("An error occured (TTS request)", error);
		return null;
	}
}

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

module.exports = { ttsRequest };


// (async () => {
//   const text = "Hello, this is a test for the text-to-speech request.";
//   try {
//     const buffer = await ttsRequest(text);
//     if (buffer) {
//       console.log("TTS Request Successful. Buffer received.");
//     } else {
//       console.log("TTS Request returned null.");
//     }
//   } catch (error) {
//     console.error("Error during TTS Request:", error);
//   }
// })();
