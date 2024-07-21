import fetch from 'node-fetch';

/**
 * Downloads media from a given URL using HTTP Basic Authentication.
 * @param {string} mediaURL - The URL of the media to download.
 * @param {string} accountSid - The Twilio Account SID for authentication.
 * @param {string} authToken - The Twilio Auth Token for authentication.
 * @returns {Buffer|null} - The media buffer if successful, otherwise null.
 */
export const downloadMedia = async (mediaURL, accountSid = process.env.TWILIO_SID, authToken = process.env.TWILIO_AUTH_TOKEN) => {
  if (!mediaURL) {
    console.error('Media URL is required');
    return null;
  }

  console.log("Downloading media from URL:", mediaURL);
  try {
    const response = await fetch(mediaURL, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
      }
    });
    if (response.status === 401) {
      console.error('Unauthorized access. Please check your Twilio Account SID and Auth Token.');
      return null;
    }
    if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
    const buffer = await response.buffer();
    console.log(`Media buffer from ${mediaURL}:`, buffer);
    return buffer;
  } catch (error) {
    console.error('Error downloading media:', error);
    return null;
  }
};
