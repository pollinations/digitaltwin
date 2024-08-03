import fetch from 'node-fetch';

export async function handler(event) {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Extract the path and method from the event
    const path = event.path.replace(/^\/playai/, '');
    const method = event.httpMethod;
    console.log("Extracted path:", path);
    console.log("HTTP method:", method);

    // Parse the request body if it exists
    const body = event.body ? JSON.parse(event.body) : null;
    console.log("Parsed body:", body);

    // Get userId and secretKey from environment variables
    const userId = process.env.PLAYAI_USER_ID;
    const secretKey = process.env.PLAYAI_SECRET_KEY;
    console.log("User ID:", userId);
    console.log("Secret Key:", secretKey ? "******" : "Not provided");

    if (!userId || !secretKey) {
        console.error("Missing userId or secretKey");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "userId and secretKey are required." }),
        };
    }

    const url = `https://api.play.ai${path}`;
    const headers = {
        'Authorization': `Bearer ${secretKey}`,
        'X-USER-ID': userId,
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
            body: JSON.stringify({ error: "Failed to proxy request to Play.ai API.", details: error.message }),
        };
    }
}
