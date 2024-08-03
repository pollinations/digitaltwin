import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Converts a data URL to a Buffer.
 * @param {string} dataUrl - The data URL to convert.
 * @returns {Buffer} - The resulting Buffer.
 */
function dataUrlToBuffer(dataUrl) {
    const [metadata, base64Data] = dataUrl.split(',');
    const mime = metadata.match(/:(.*?);/)[1];
    const buffer = Buffer.from(base64Data, 'base64');
    return { mime, buffer };
}

/**
 * Handles proxying requests to the PlayHT API.
 * @param {Object} event - The event object containing request details.
 * @returns {Promise<Object>} - The response from the PlayHT API.
 */
export async function handler(event) {
    // Extract the path and method from the event
    const path = event.path.replace(/^\/playht/, '');
    const method = event.httpMethod;
    console.log("Extracted path:", path);
    console.log("HTTP method:", method);

    // Get userId and secretKey from environment variables
    const userId = process.env.PLAYHT_USER_ID;
    const secretKey = process.env.PLAYHT_SECRET_KEY;
    console.log("User ID:", userId);
    console.log("Secret Key:", secretKey ? "******" : "Not provided");

    if (!userId || !secretKey) {
        console.error("Missing userId or secretKey");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "userId and secretKey are required." }),
        };
    }

    const url = `https://api.play.ht${path}`;
    let headers = {
        'Authorization': `Bearer ${secretKey}`,
        'X-USER-ID': userId,
    };

    console.log("Request URL:", url);
    console.log("Request headers:", headers);

    let body = null;

    if (method === 'DELETE') {
        headers = {
            ...headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        body = JSON.stringify(JSON.parse(event.body));
        console.log("delete, body:", body);

    } else if (method !== 'GET' && method !== 'HEAD') {
        console.log("content-type:", event.headers['content-type']);
        // Convert JSON body to FormData if content-type is application/json
        if (event.headers['content-type'] && event.headers['content-type'].includes('application/json')) {
            const jsonBody = JSON.parse(event.body);
            const formData = new FormData();

            for (const key in jsonBody) {
                if (jsonBody.hasOwnProperty(key)) {
                    const value = jsonBody[key];
                    if (typeof value === 'string' && value.startsWith('data:')) {
                        const { mime, buffer } = dataUrlToBuffer(value);
                        formData.append(key, buffer, { filename: `${key}.mp3`, contentType: mime });
                    } else {
                        formData.append(key, value);
                    }
                }
            }

            body = formData;
            headers = {
                ...headers,
                ...formData.getHeaders(), // Add FormData headers
            };
        } else {
            body = event.body;
        }
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            body,
        });
        console.log("Response status:", response.status);

        const responseData = await response.json();
        console.log("Response data:", responseData);

        return {
            statusCode: response.status,
            body: JSON.stringify(responseData),
        };
    } catch (error) {
        console.error("Error during fetch:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to proxy request to PlayHT API.", details: error.message }),
        };
    }
}