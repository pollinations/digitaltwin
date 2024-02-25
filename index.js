const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: "config.env" });
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require("openai");
const { addListener } = require('./messageListener');
const { sendMessage } = require('./send_message');
const { last } = require('ramda');
const { ttsRequest } = require('./elevenlabs');
const { addBufferToServer } = require('./express');

const recipientNumber = "4917630168140";

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
  }

  console.log("modified conversations", conversations);

  return conversations;
};

const init = async () => {
  addListener(async ({ from, text }) => {
    console.log("Message received", text, "from", from);
    conversations = addMessage(conversations, from, {
      content: text,
      role: "user"
    });
    conversations = await getChatResponse(conversations, from);
    const aiResponse = last(conversations[from]).content;

    await sendMessage(aiResponse, from)
    // tts
    const audioBuffer = await ttsRequest(aiResponse);

    // serve
    const url = await addBufferToServer(audioBuffer);
    console.log("serving audio buffer at url", url);
    await sendMessage(aiResponse, from, url);
  });
};

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const getChatResponse = async (conversations, from) => {
  const history = conversations[from];
  const simplifiedHistory = history.map(({ role, content }) => ({ role, content }));
  const chatCompletion = await openai.chat.completions.create({
    messages: simplifiedHistory,
    model: 'gpt-3.5-turbo',
  });
  console.log("got completion", chatCompletion);
  
  const response = chatCompletion.choices[0].message.content;
  
  conversations = addMessage(conversations, from, { 
    content: response, 
    role: "assistant"
  });

  return conversations;
}
init();
