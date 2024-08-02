import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";

dotenv.config();

const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID;
const PLAYHT_SECRET_KEY = process.env.PLAYHT_SECRET_KEY;

/**
 * Creates an instant voice clone by providing a sample audio file via file upload.
 * @param {string} filePath - The path to the audio file.
 * @param {string} voiceName - The name for the new cloned voice.
 * @returns {Promise<Object>} - The response from the API.
 */
async function createInstantVoiceClone(filePath, voiceName) {
    const url = 'https://api.play.ht/api/v2/cloned-voices/instant';
    const form = new FormData();
    form.append('sample_file', fs.createReadStream(filePath));
    form.append('voice_name', voiceName);

    const headers = {
        'Authorization': `Bearer ${PLAYHT_SECRET_KEY}`,
        'X-USER-ID': PLAYHT_USER_ID,
        ...form.getHeaders()
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: form
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorDetails)}`);
        }

        const responseData = await response.json();
        console.log("Instant voice clone created successfully:", responseData);
        return responseData;
    } catch (error) {
        console.error("Failed to create instant voice clone:", error);
        throw error;
    }
}

createInstantVoiceClone("/Users/thomash/Desktop/ala_whatsapp_voice_english.mp3", "Ala Haddaddi");