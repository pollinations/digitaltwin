const fetch = require('node-fetch');

const getMediaURL = async (mediaID, phoneNumberId = process.env.WA_PHONE_NUMBER_ID, accessToken = process.env.CLOUD_API_ACCESS_TOKEN) => {
  const url = `https://graph.facebook.com/v16.0/${mediaID}?access_token=${accessToken}&phone_number_id=${phoneNumberId}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    console.log("media url data", data);
    return data.url;
  } catch (error) {
    console.error('Error fetching media URL:', error);
    return null;
  }
};
const downloadMedia = async (mediaID, accessToken = process.env.CLOUD_API_ACCESS_TOKEN, phoneNumberId = process.env.WA_PHONE_NUMBER_ID) => {
  const mediaURL = await getMediaURL(mediaID, phoneNumberId, accessToken);
  if (!mediaURL) {
    console.error('Failed to get media URL');
    return;
  }

  console.log("got media url", mediaURL);
  try {
    const response = await fetch(mediaURL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
    const buffer = await response.buffer();
    console.log(`Media buffer for ${mediaID}:`, buffer);
    return buffer;
  } catch (error) {
    console.error('Error downloading media:', error);
  }
};
exports.downloadMedia = downloadMedia;
