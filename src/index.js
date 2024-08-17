import './dotenv.js';
import { sendMessage, messageGenerator } from './connectors/discord.js';
import { ttsRequest } from './elevenlabs.js';
import { getChatResponse } from './llms/openai.js';
import { addMessage, loadConversations } from './conversations.js';
import { audioEffects } from './audio.js';
import { user, assistant } from './llms/openai.js';
import { generateAudio } from './musicgen.js';
import { transcribeAudio } from './whisper.js';
import { parseActions } from './botActions.js';
import { withTimeout } from './utils/withTimeout.js';
import { logMessageToSheet } from './googleSheetsLogger.js';
import sleep from 'await-sleep';

let conversations = loadConversations();

const calculateTypingDelay = (text) => {
  const wordsPerMinute = 400 + Math.random() * 800; // Random typing speed between 40-60 WPM
  const words = text.split(' ').length;
  return (words / wordsPerMinute) * 60 * 1000; // Convert to milliseconds
};

const shouldRespond = () => Math.random() < 0.5; // 60% chance to respond

const init = async () => {
  const generator = messageGenerator();

  for await (let { channel, text, audio, name } of generator) {
    // Only respond to messages from specific channels and users
    if (
      (channel !== '889573359111774329' && channel !== '1273050575226802280' && channel !== '1166364066135154799')
      //  ||
      // (name !== 'the.white.tiger' && name !== 'thomash_pollinations')
    ) {
      console.log("Message was not from a channel or user we want to respond to, skipping.", "channel", channel, "text", text, "name", name);
      continue;
    }

    console.log("Message received", "text", text, "audio", audio ? true : false, "channel", channel);

    if (audio) {
      text = await transcribeAudio(audio);
      if (!text) {
        console.log("Transcription returned null, skipping message processing.");
        continue;
      }
    }

    // Log the incoming message to Google Sheet
    // await logMessageToSheet({ channel, text, audio, type: 'incoming', metadata: {} });

    conversations = addMessage(conversations, channel, user(text, name));

    if (!shouldRespond()) {
      console.log("Randomly chose not to respond to this message.");
      continue;
    }

    try {
      const aiResponse = await getChatResponse(conversations[channel], channel);
      conversations = addMessage(conversations, channel, assistant(aiResponse));
      const { voiceEnabled } = parseActions(conversations[channel])

      if (voiceEnabled) {
        try {
          console.log("started voice and music generation promises")
          const [ttsAudio, musicgenAudioPath] = await Promise.all([
            withTimeout(ttsRequest(aiResponse)),
            null,//withTimeout(generateAudio(aiResponse)),
          ]);
          console.log("ended voice and music generation promises", ttsAudio, musicgenAudioPath)
          // audio fx
          const fxAudioBuffer = ttsAudio;  // = ttsAudio ? await audioEffects(ttsAudio, musicgenAudioPath) : null;

          console.log("Sending audio message with effects", fxAudioBuffer);
          // send audio
          const typingDelay = calculateTypingDelay(aiResponse);
          await sleep(typingDelay);
          await sendMessage(aiResponse, channel, fxAudioBuffer);

          console.log("Message sent to whatsapp");

        } catch (e) {
          console.error(e);
          console.trace();
          conversations = addMessage(conversations, channel, user(`Error processing your request:\n\n${e.message}.\n\nPlease diagnose it. This happened on your server. Say sorry.`));
          // get a customized ai response for the error
          const aiErrorResponse = await getChatResponse(conversations[channel], channel);
          const errorTypingDelay = calculateTypingDelay(aiErrorResponse);
          await sleep(errorTypingDelay);
          await sendMessage(aiErrorResponse, channel);
        }
      } else {
        // send text
        const typingDelay = calculateTypingDelay(aiResponse);
        console.log(`Sleeping for ${typingDelay}ms before sending message...`);
        await sleep(typingDelay);
        console.log(`Sleep complete. Sending message to ${channel}`);
        await sendMessage(aiResponse, channel);
        console.log(`Message sent successfully to ${channel}`);
      }
    } catch (e) {
      console.error("Failed to process message:", e);
      const errorMessage = `Sorry, I encountered an error processing your request. Error: ${e.message}`;
      const errorTypingDelay = calculateTypingDelay(errorMessage);
      await sleep(errorTypingDelay);
      await sendMessage(errorMessage, channel);

      // Log the error message to Google Sheet
      await logMessageToSheet({ channel, text: e.message, type: 'error', metadata: {} });
    }
  }
};

init();