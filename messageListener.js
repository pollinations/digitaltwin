const { downloadMedia } = require("./downloadMedia");
const { app } = require('./express');
const sleep = require('await-sleep');

const handleWebhook = async (req, res) => {
  console.log(`Received webhook with token: ${req.query['hub.verify_token']}`);
  
  if (!req.body) return;
  
  if (req.body.object === "whatsapp_business_account" && req.body.entry) {
    for (const entry of req.body.entry) {
      for (const change of entry.changes) {
        await handleMessage(change);
      }
    }
  }

  res.status(200).send(req.query['hub.challenge']);
};

const handleMessage = async (change) => {
  const messageData = change.value.messages?.[0];
  if (!messageData) return;

  const from = messageData.from;
  if (messageData.type === "text") {
    await processTextMessage(from, messageData.text.body);
  } else if (messageData.type === "audio") {
    await processAudioMessage(from, messageData.audio);
  }
};

app.post('/webhook', handleWebhook);
app.get('/webhook', handleWebhook);

const processTextMessage = async (from, text) => {
  await Promise.all(messageListeners.map(listener => listener({ from, text })));
};

const processAudioMessage = async (from, audioDetails) => {
  const buffer = await downloadMedia(audioDetails.id);
  console.log(`Media buffer for audio message from ${from}:`, buffer);
  console.log(`Received audio message from ${from}:`, audioDetails);
  await Promise.all(messageListeners.map(listener => listener({ from, audio: buffer })));
};

let messageListeners = [];

const addListener = (listener) => {
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

exports.messageGenerator = messageGenerator;
