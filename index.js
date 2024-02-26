const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: "config.env" });
const fs = require('fs').promises;
const path = require('path');
const { messageGenerator } = require('./messageListener');
const { sendMessage } = require('./send_message');
const { last } = require('ramda');
const { ttsRequest } = require('./elevenlabs');
const { addBufferToServer } = require('./express');
const { getChatResponse } = require('./getChatResponse');

let conversations = {};

const addMessage = (conversations, userId, { content, role = "user" }) => {
  if (!conversations[userId]) {
    conversations = { ...conversations, [userId]: [] };
  }

  const newMessage = {
    content,
    timestamp: new Date().getTime(),
    role,
  };

  conversations = {
    ...conversations,
    [userId]: [...conversations[userId], newMessage]
  };

  console.log("modified conversations", conversations);

  return conversations;
};


const init = async () => {
  const generator = messageGenerator();

  for await (const { from, text } of generator) {
    console.log("Message received", text, "from", from);
    
    conversations = addMessage(conversations, from, {
      content: text,
      role: "user"
    });
    
    const history = conversations[from];
    const aiResponse = await getChatResponse(history);

    conversations = addMessage(conversations, from, {
      content: aiResponse,
      role: "assistant"
    });
    
    await sendMessage(aiResponse, from);
    // tts
    const { buffer, mime } = await ttsRequest(aiResponse);

    // serve
    const url = await addBufferToServer(buffer, mime);
    console.log("serving audio buffer at url", url);
    await sendMessage(aiResponse, from, url);
  }

};

init();
