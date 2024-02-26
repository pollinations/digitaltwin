import './dotenv.js';
import { messageGenerator } from './messageListener.js';
import { sendMessage } from './sendMessage.js';
import { ttsRequest } from './elevenlabs.js';
import { getChatResponse } from './getChatResponse.js';
import { addMessage, loadConversations } from './conversations.js';
import { audioEffects } from './audio.js';
import { user, assistant } from './getChatResponse.js';
import { generateAudio } from './musicgen.js';
import { transcribeAudio } from './whisper.js';
import { parseActions } from './botActions.js';

let conversations = loadConversations();

const init = async () => {
  const generator = messageGenerator();

  for await (let { from, text, audio } of generator) {
    console.log("Message received", "text",text, "audio", audio ? true : false, "from", from);
    
    if (audio) 
      text = await transcribeAudio(audio);

    conversations = addMessage(conversations, from, user(text));
    
    try {
        const aiResponse = await getChatResponse(conversations[from]);
        conversations = addMessage(conversations, from, assistant(aiResponse));
        const { voiceEnabled } = parseActions(conversations[from])

        if (voiceEnabled) {

          try {
            const [musicgenAudioPath, ttsAudio] = await Promise.all([
              generateAudio(aiResponse),
              ttsRequest(aiResponse),
            ]);
            // audio fx
            const fxAudioUrl = await audioEffects(ttsAudio, musicgenAudioPath)

            // send audio
            await sendMessage(aiResponse, from, fxAudioUrl);
          
          } catch (e) {
            console.error(e);
            console.trace();
  ;         conversations = addMessage(conversations, from, user(`Error processing your request:\n\n${e.message}.\n\nPlease diagnose it. This happened on your server. Say sorry.`));
            // get a customized ai response for the error
            const aiErrorResponse = await getChatResponse(conversations[from], {disableTools: true});
            await sendMessage(aiErrorResponse, from);
          }
        } else {
          // send text
          await sendMessage(aiResponse, from);
        }
    } catch (e) {
      console.error("Failed to process message:", e);
      await sendMessage(`Sorry, I encountered an error processing your request. Error: ${e.message}`, from);
    }
  }
};

init();

