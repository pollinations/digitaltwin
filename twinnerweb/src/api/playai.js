// Removed dotenv import as it's no longer needed

/**
 * Creates a new Play.ai Agent.
 * @param {Object} params - Parameters for creating the agent.
 * @param {string} params.prompt - The agent's prompt.
 * @param {string} params.displayName - The agent's name.
 * @param {string} params.description - The agent's description.
 * @param {string} params.voice - The unique ID for a Cloned Voice.
 * @param {string} params.userId - The user ID for authentication.
 * @param {string} params.secretKey - The secret key for authentication.
 * @returns {Promise<Object>} - The response from the API.
 */
export async function createAgent(params = {}) {

    // const url = 'https://api.play.ai/api/v1/agents';
    const url = '/playai/api/v1/agents';
    const headers = {
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify(params);

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

// createAgent("Hello, I'm a stupid agent!", { displayName: "Ala22" });