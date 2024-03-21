import './dotenv.js';
import { messageGenerator } from './messageListener.js';
import { sendMessage, sendMessageToAdmins } from './sendMessage.js';
import { ttsRequest } from './elevenlabs.js';
import { getChatResponse } from './getChatResponse.js';
import { addMessage, loadConversations } from './conversations.js';
import { audioEffects } from './audio.js';
import { user, assistant } from './getChatResponse.js';
import { generateAudio } from './musicgen.js';
import { transcribeAudio } from './whisper.js';
import { parseActions } from './botActions.js';
import { withTimeout } from './utils/withTimeout.js';

let conversations = loadConversations();

const init = async () => {
  const generator = messageGenerator();

  for await (let { from, text, audio } of generator) {
    console.log("Message received", "text",text, "audio", audio ? true : false, "from", from);

    if (audio) 
      text = await transcribeAudio(audio);
    
      
      const phoneNumberPattern = /^\d{11,15}$/; // Assuming WhatsApp numbers can be between 11 to 15 digits
      const messageParts = text.split(' ');
      const potentialPhoneNumber = messageParts[0];
      if (phoneNumberPattern.test(potentialPhoneNumber)) {
        const messageToSend = messageParts.slice(1).join(' ');
        console.log("sending admin message to",potentialPhoneNumber)
        sendTextMessage(potentialPhoneNumber, messageToSend);
        continue;
      }


    conversations = addMessage(conversations, from, user(text));
    
    try {
        const aiResponse = await getChatResponse(conversations[from], from);
        conversations = addMessage(conversations, from, assistant(aiResponse));
        const { voiceEnabled } = parseActions(conversations[from])

        if (voiceEnabled) {

          try {
            console.log("started voice and music generation promises")
            const [ttsAudio, musicgenAudioPath] = await Promise.all([
              withTimeout(ttsRequest(aiResponse)),
              withTimeout(generateAudio(aiResponse)),
            ]);
            console.log("ended voice and music generation promises", ttsAudio, musicgenAudioPath)
            // audio fx
            const fxAudioUrl = ttsAudio ? await audioEffects(ttsAudio, musicgenAudioPath) : null;

            // send to admins (this should probably be somewhere else)
            sendMessageToAdmins(from, aiResponse, { mediaUrl: fxAudioUrl, direction: "->" });

            console.log("Sending audio message with effects", fxAudioUrl);
            // send audio
            await sendMessage(aiResponse, from, fxAudioUrl);

            console.log("Message sent to whatsapp");
          
          } catch (e) {
            console.error(e);
            console.trace();
            conversations = addMessage(conversations, from, user(`Error processing your request:\n\n${e.message}.\n\nPlease diagnose it. This happened on your server. Say sorry.`));
            // get a customized ai response for the error
            const aiErrorResponse = await getChatResponse(conversations[from], from);
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
