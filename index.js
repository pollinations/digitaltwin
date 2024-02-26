import './lib/dotenv.js';
import { messageGenerator } from './lib/messageListener.js';
import { sendMessage } from './lib/sendMessage.js';
import { ttsRequest } from './lib/elevenlabs.js';
import { getChatResponse } from './lib/getChatResponse.js';
import { addMessage } from './lib/conversations.js';
import { audioEffects } from './lib/audio.js';
import { user, assistant } from './lib/getChatResponse.js';
import { generateAudio } from './lib/musicgen.js';
import { transcribeAudio } from './lib/whisper.js';

let conversations = {};

const init = async () => {
  const generator = messageGenerator();

  for await (let { from, text, audio } of generator) {
    console.log("Message received", "text",text, "audio", audio ? true : false, "from", from);
    
    if (audio) 
      text = await transcribeAudio(audio);

    conversations = addMessage(conversations, from, user(text));
    
    try {
        const aiResponse = await getChatResponse(conversations[from]);
        
        try {
          const [musicgenAudioPath, ttsAudio] = await Promise.all([
            generateAudio(aiResponse),
            ttsRequest(aiResponse),
          ]);
          // audio fx
          const fxAudioUrl = await audioEffects(ttsAudio, musicgenAudioPath)

          conversations = addMessage(conversations, from, assistant(aiResponse));

          // send text
          await sendMessage(aiResponse, from);
          // send audio
          await sendMessage(aiResponse, from, fxAudioUrl);
        
        } catch (e) {
          console.error(e);
          console.trace();
;          conversations = addMessage(conversations, from, user(`Error processing your request:\n\n${e.message}.\n\nPlease diagnose it. This happened on your server. Say sorry.`));
          // get a customized ai response for the error
          const aiErrorResponse = await getChatResponse(conversations[from], {disableTools: true});
          await sendMessage(aiErrorResponse, from);
        }
    } catch (e) {
      console.error("Failed to process message:", e);
      await sendMessage(`Sorry, I encountered an error processing your request. Error: ${e.message}`, from);
    }
  }
};

init();

