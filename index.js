import './lib/dotenv.js';
import { messageGenerator } from './lib/messageListener.js';
import { sendMessage } from './lib/send_message.js';
import { ttsRequest } from './lib/elevenlabs.js';
import { addBufferToServer } from './lib/express.js';
import { getChatResponse } from './lib/getChatResponse.js';
import { addMessage } from './lib/conversations.js';

let conversations = {};

const init = async () => {
  const generator = messageGenerator();

  for await (const { from, text } of generator) {
    console.log("Message received", text, "from", from);
    
    conversations = addMessage(conversations, from, {
      content: text,
      role: "user"
    });
    
    const aiResponse = await getChatResponse(conversations[from]);

    conversations = addMessage(conversations, from, {
      content: aiResponse,
      role: "assistant"
    });
    
    // send text
    await sendMessage(aiResponse, from);
    
    // tts
    const { buffer, mime } = await ttsRequest(aiResponse);

    // serve
    const url = await addBufferToServer(buffer, mime);

    // send
    await sendMessage(aiResponse, from, url);
  }

};

init();
