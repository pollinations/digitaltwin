const { downloadMedia } = require("./downloadMedia");
const { app } = require('./express');

const handleWebhook = (req, res) => {
  console.log(`Received webhook with token: ${req.query['hub.verify_token']}`);
  console.log("Request Query:", req.query);
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  if (req.body.object === "whatsapp_business_account" && req.body.entry) {
    req.body.entry.forEach(entry => {
      entry.changes.forEach(change => {
        if (change.field === "messages") {
          const messageData = change.value.messages?.[0];
          if (!messageData) return;

          const from = messageData.from;
          if (messageData.type === "text") {
            const text = messageData.text.body;
            messageListeners.forEach(listener => listener({ from, text }));
          } else if (messageData.type === "audio") {
            const audioDetails = {
              mimeType: messageData.audio.mime_type,
              sha256: messageData.audio.sha256,
              id: messageData.audio.id,
              voice: messageData.audio.voice
            };

            downloadMedia(audioDetails.id).then(buffer => {
              console.log(`Media buffer for audio message from ${from}:`, buffer);
            });


            console.log(`Received audio message from ${from}:`, audioDetails);
          }
        }
      });
    });
  }

  res.status(200).send(req.query['hub.challenge']);
};


app.post('/webhook', handleWebhook);
app.get('/webhook', handleWebhook);

let messageListeners = [];
const addListener = (listener) => {
  messageListeners.push(listener);
};

exports.addListener = addListener;
