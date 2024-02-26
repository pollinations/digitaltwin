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
    
    const aiResponse = await getChatResponse(conversations[from]);
    
    // tts
    const ttsAudio = await ttsRequest(aiResponse);

    // audio fx
    const fxAudioUrl = await audioEffects(ttsAudio, null)

    console.log("got audio url", fxAudioUrl)
    conversations = addMessage(conversations, from, assistant(aiResponse));
    
    // send text
    await sendMessage(aiResponse, from);
    // send audio
    await sendMessage(aiResponse, from, fxAudioUrl);
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
