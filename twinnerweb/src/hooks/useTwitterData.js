import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch Twitter user data by username.
 * @param {string} username - The Twitter username to fetch data for.
 * @returns {Object} - An object containing userData and tweets.
 */
export function useTwitterData(username) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!username) return;

        async function fetchData() {
            try {
                const userResponse = await fetch(`/twitter/${username}`);
                if (!userResponse.ok) {
                    throw new Error(`Error fetching user data: ${userResponse.statusText}`);
                }
                const twitterData = await userResponse.json();
                console.log("twitterData", twitterData);
                setData(twitterData);
            } catch (error) {
                console.error("Failed to fetch Twitter data:", error);
            }
        }

        fetchData();
    }, [username]);

    return data;
}
