import twilio from 'twilio';
import { downloadMedia } from "../downloadMedia.js";
import { addBufferToServer, app } from '../express.js';
import sleep from 'await-sleep';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Logging the initialization of Twilio with the account SID from environment variables
console.log("Initializing Twilio with SID", process.env.TWILIO_SID);
// Creating a new Twilio client instance with the account SID, auth token, API key, and API secret
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN, {
  accountSid: process.env.TWILIO_SID,
  apiKey: process.env.TWILIO_API_KEY,
  apiSecret: process.env.TWILIO_API_SECRET
});

// Function to send a text message to a specific number via WhatsApp
const sendTextMessage = async (number, msg) => {
  console.log(`Sending text message to ${number}: ${msg}`);
  await client.messages.create({
    body: msg,
    from: `whatsapp:${process.env.WA_PHONE_NUMBER_ID}`,
    to: `whatsapp:${number}`
  });
};

// Function to send an audio message to a specific number via WhatsApp
const sendAudioMessage = async (number, url) => {
  console.log(`Sending audio message to ${number}: ${url}`);
  await client.messages.create({
    mediaUrl: [url],
    from: `whatsapp:${process.env.WA_PHONE_NUMBER_ID}`,
    to: `whatsapp:${number}`
  });
};
const sendRichCardMessage = async number => {
  const message = await client.messages.create({
    contentSid: "HX7aebb8de744bffa68578b49952bab41a",
    from: `whatsapp:${process.env.WA_PHONE_NUMBER_ID}`,
    to: `whatsapp:${number}`,
    // messagingServiceSid: "MGXXXXXXXX"
  });

  console.log(message.body);
}

// Function to send a message, optionally with a media URL or as a rich card, to a recipient number via WhatsApp
const sendMessage = async (message, recipientNumber, mediaBuffer = null) => {
  // Add the media buffer to the server if it exists
  const mediaUrl = mediaBuffer ? addBufferToServer(mediaBuffer) : null;
  // Logging the message being sent, including the media URL or rich card variables if present
  console.log(`Sending message to ${recipientNumber}: ${message} with media URL: ${mediaUrl}`);
  try {
    if (mediaUrl) {
      // Sending an audio message to the recipient
      await sendAudioMessage(recipientNumber, mediaUrl);
    } else {
      // Sending a text message to the recipient
      await sendTextMessage(recipientNumber, message);
    }
    // Logging success upon successful message delivery
    console.log("Message sent successfully to", recipientNumber);
  } catch (error) {
    // Logging an error message in case of failure to send the message
    console.error("Failed to send message to", recipientNumber, ":", error);
  }
};

// Webhook handler for incoming messages
const handleWebhook = async (req, res) => {
  console.log(`Received webhook with token: ${req.query['hub.verify_token']}`);
  console.log("Request Body:", req.body);
  console.log("Request Query:", req.query);
  console.log("Request Headers:", req.headers);
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  if (!req.body) return;

  if (req.body.SmsMessageSid && req.body.WaId) {
    await handleMessage(req.body);
  }

  res.status(200).send(req.query['hub.challenge']);
};

// Message handler for processing incoming messages
const handleMessage = async (messageData) => {
  const from = messageData.WaId;
  switch (messageData.MessageType) {
    case "text":
      await processTextMessage(from, messageData.Body);
      break;
    case "audio":
      await processAudioMessage(from, messageData);
      break;
    default:
      console.log(`Unhandled message type: ${messageData.MessageType}`);
  }
};

// Process text messages
const processTextMessage = async (from, text) => {
  console.log("processing message from", from);
  await Promise.all(messageListeners.map(listener => listener({ from, text })));
};

// Process audio messages
const processAudioMessage = async (from, audioDetails) => {
  const buffer = await downloadMedia(audioDetails.MediaUrl0);
  console.log(`Media buffer for audio message from ${from}:`, buffer);
  console.log(`Received audio message from ${from}:`, audioDetails);
  await Promise.all(messageListeners.map(listener => listener({ from, audio: buffer })));
};

let messageListeners = [];

const addListener = (listener) => {
  console.log("added listener");
  messageListeners.push(listener);
};

const messageGenerator = async function* () {
  let messageQueue = [];
  const pushToQueue = (message) => messageQueue.push(message);
  addListener(pushToQueue);

  while (true) {
    if (messageQueue.length > 0) {
      yield messageQueue.shift();
    } else {
      await sleep(100);
    }
  }
};

app.post('/webhook', handleWebhook);
app.get('/webhook', handleWebhook);

// Test sendMessage function
const testSendMessage = async () => {
  const testNumber = '+491754863246';
  const testMessage = 'Hello, this is a test message!';
  await sendMessage(testMessage, testNumber);
  try {
    await sendRichCardMessage(testNumber);
  } catch (error) {
    console.error("Failed to send rich card message:", error);
  }
};

testSendMessage();

export { sendMessage, messageGenerator };
