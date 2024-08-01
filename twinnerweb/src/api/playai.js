import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const PLAYAI_USER_ID = process.env.PLAYAI_USER_ID;
const PLAYAI_SECRET_KEY = process.env.PLAYAI_SECRET_KEY;

/**
 * Creates a new Play.ai Agent.
 * @param {string} displayName - The agent's name.
 * @param {string} description - The agent's description.
 * @param {string} prompt - The agent's prompt.
 * @param {string} voice - The unique ID for a Cloned Voice. (Optional, defaults to the default voice)
 * @returns {Promise<Object>} - The response from the API.
 */
async function createAgent(prompt, displayName = "unnamed", voice = "s3://soundmosaic-dev/uploads/manifest.json", description = "Automatically cloned agent.") {
    const url = 'https://api.play.ai/api/v1/agents';
    const headers = {
        'Authorization': `Bearer ${PLAYAI_SECRET_KEY}`,
        'X-USER-ID': PLAYAI_USER_ID,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        voice,
        displayName,
        description,
        prompt,
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorDetails)}`);
        }

        const responseData = await response.json();
        console.log("Agent created successfully:", responseData);
        return responseData;
    } catch (error) {
        console.error("Failed to create agent:", error);
        throw error;
    }
}

createAgent("Hello, I'm a stupid agent!", "Ala22");