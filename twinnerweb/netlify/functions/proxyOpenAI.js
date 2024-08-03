import fetch from 'node-fetch';

export async function handler(event) {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const path = event.path.replace(/^\/gpt4/, '');
    const method = event.httpMethod;
    console.log("Extracted path:", path);
    console.log("HTTP method:", method);

    const body = event.body ? JSON.parse(event.body) : null;
    console.log("Parsed body:", body);

    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API Key:", apiKey ? "******" : "Not provided");

    if (!apiKey) {
        console.error("Missing API key");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "API key is required." }),
        };
    }

    const url = `https://pollinations.openai.azure.com${path}`;
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };
    console.log("Request URL:", url);
    console.log("Request headers:", headers);

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
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
            body: JSON.stringify({ error: "Failed to proxy request to GPT-4 API.", details: error.message }),
        };
    }
}
