// import fetch from "node-fetch";
import FormData from "form-data";

/**
 * Lists the cloned voices that exist.
 * @returns {Promise<void>} - Logs the list of cloned voices.
 */
export async function listClonedVoices() {
    const url = '/playht/api/v2/cloned-voices/'; // Use the proxy endpoint

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorDetails)}`);
        }

        const responseData = await response.json();
        console.log("List of cloned voices:", responseData);
        return responseData;
    } catch (error) {
        console.error("Failed to list cloned voices:", error);
        throw error;
    }
}

/**
 * Creates an instant voice clone by providing a sample audio file via file upload.
 * @param {Buffer} fileBuffer - The buffer of the audio file.
 * @param {Object} options - Optional parameters for the voice clone.
 * @param {string} options.voiceName - The name for the new cloned voice.
 * @returns {Promise<Object>} - The response from the API.
 */
export async function createInstantVoiceClone(base64DataUrl, { voice_name }) {

    const existingVoices = await listClonedVoices();
    if (existingVoices.length > 0)
        deleteClonedVoice(existingVoices[0].id);

    const url = '/playht/api/v2/cloned-voices/instant'; // Use the proxy endpoint
    const body = JSON.stringify({
        sample_file: base64DataUrl,
        voice_name
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
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

/**
 * Deletes a cloned voice by its ID.
 * @param {string} voiceId - The ID of the cloned voice to delete.
 * @returns {Promise<void>} - Logs the result of the deletion.
 */
export async function deleteClonedVoice(voiceId) {
    const url = `/playht/api/v2/cloned-voices/`; // Use the proxy endpoint

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voice_id: voiceId })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorDetails)}`);
        }

        console.log(`Cloned voice with ID ${voiceId} deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete cloned voice with ID ${voiceId}:`, error);
        throw error;
    }
}

// createInstantVoiceClone(fileBuffer, { voiceName: "Ala Haddaddi" });