/**
 * Makes a request to the GPT-4 API via the proxy.
 * @param {string} endpoint - The API endpoint to call.
 * @param {Object} body - The request body.
 * @returns {Promise<Object>} - The response from the API.
 */
export async function requestOpenAI(content) {
    const url = `/openai/v1/chat/completions`;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(content),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorDetails)}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to make request to OpenAI API:", error);
        throw error;
    }
}

/**
 * Example function to create a completion using the GPT-4 API.
 * @param {Object} params - Parameters for the completion request.
 * @returns {Promise<Object>} - The response from the API.
 */
export async function createCompletion(params) {
    return await requestOpenAI('/v1/completions', params);
}

/**
 * Example function to retrieve a model using the GPT-4 API.
 * @param {Object} params - Parameters for the model request.
 * @returns {Promise<Object>} - The response from the API.
 */
export async function getModel(params) {
    return await requestOpenAI('/v1/models', params);
}



// requestOpenAI({
//     "messages": [
//         { "role": "system", "content": "You are a helpful assistant." },
//         { "role": "user", "content": "What is the capital of the moon?" }
//     ]
// }).then(console.log).catch(console.error);