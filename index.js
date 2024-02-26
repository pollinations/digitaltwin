import './lib/dotenv.js';
import { messageGenerator } from './lib/messageListener.js';
import { sendMessage } from './lib/send_message.js';
import { ttsRequest } from './lib/elevenlabs.js';
import { getChatResponse } from './lib/getChatResponse.js';
import { addMessage } from './lib/conversations.js';
import { audioEffects } from './lib/audio.js';

let conversations = {};

const init = async () => {
  const generator = messageGenerator();

  for await (const { from, text } of generator) {
    console.log("Message received", text, "from", from);
    
    conversations = addMessage(conversations, from, user(text));
    
    try {
        const aiResponse = await getChatResponse(conversations[from]);
        
        try {
        // tts
        const ttsAudio = await ttsRequest(aiResponse);

        // audio fx
        const fxAudioUrl = await audioEffects(ttsAudio, null)

        conversations = addMessage(conversations, from, assistant(aiResponse));

        // send text
        await sendMessage(aiResponse, from);
        // send audio
        await sendMessage(aiResponse, from, fxAudioUrl);
      
      } catch (e) {
        conversations = addMessage(conversations, from, user(`Error processing your request:\n\n${e.message}.\n\nPlease diagnose it. This happened on your server. Say sorry.`));
        // get a customized ai response for the error
        const aiErrorResponse = await getChatResponse(conversations[from]);
        await sendMessage(aiErrorResponse, from);
      }
    } catch (e) {
      console.error("Failed to process message:", e);
      await sendMessage(`Sorry, I encountered an error processing your request. Error: ${e.message}`, from);
    }
  }
};

const assistant = text => ({
  content: text,
  role: "assistant"
});

const user = text => ({
  content: text,
  role: "user"
});

init();
