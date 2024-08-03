import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

/**
 * Fetches Twitter user data by username.
 * @param {string} username - The Twitter username to fetch data for.
 * @returns {Promise<Object>} - The response from the Twitter API.
 */
async function fetchTwitterUserData(username) {
    const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=affiliation,connection_status,created_at,description,entities,id,location,most_recent_tweet_id,name,pinned_tweet_id,profile_banner_url,profile_image_url,protected,public_metrics,receives_your_dm,subscription_type,url,username,verified,verified_type,withheld`;
    const headers = {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Error fetching user data: ${response.statusText}, Details: ${errorDetails}`);
            throw new Error(`Error: ${response.statusText}, Details: ${errorDetails}`);
        }
        return (await response.json()).data;
    } catch (error) {
        console.error("Failed to fetch Twitter user data:", error);
        throw error;
    }
}

/**
 * Fetches tweets for a given Twitter user ID.
 * @param {string} userId - The Twitter user ID to fetch tweets for.
 * @param {number} [maxResults=20] - The maximum number of tweets to fetch.
 * @returns {Promise<Object>} - The response from the Twitter API.
 */
async function fetchTweetsByUserId(userId, maxResults = 20) {
    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}`;
    const headers = {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Error fetching tweets: ${response.statusText}, Details: ${errorDetails}`);
            throw new Error(`Error: ${response.statusText}, Details: ${errorDetails}`);
        }
        return (await response.json()).data;
    } catch (error) {
        console.error("Failed to fetch tweets:", error);
        throw error;
    }
}
/**
 * Netlify function handler to fetch Twitter user data and recent tweets.
 * @param {Object} event - The event object from Netlify.
 * @returns {Promise<Object>} - The response object containing user data and recent tweets.
 */
export async function handler(event) {
    const username = event.path.split('/').pop();

    if (!username) {
        console.error("Username is required but not provided.");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Username is required." }),
        };
    }

    try {
        const user = await fetchTwitterUserData(username);
        const tweets = await fetchTweetsByUserId(user.id);

        return {
            statusCode: 200,
            body: JSON.stringify({ user, tweets }, null, 2),
        };
    } catch (error) {
        console.error("Failed to fetch data from Twitter API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data from Twitter API.", details: error.message }),
        };
    }
}