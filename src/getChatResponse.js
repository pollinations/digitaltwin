import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./persona.js";

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const getChatResponse = async (history, userId) => {
  const simplifiedHistory = history.slice(-40).map(({ role, content }) => ({ role, content }));
  const historyWithSystemPrompt = [
    {
      role: "system",
      content: SYSTEM_PROMPT({seed: userId})
    },
    ...simplifiedHistory]
  
    console.log("calling chatgpt with history (last 3 shown)", historyWithSystemPrompt.slice(-3))
  const chatCompletion = await openai.chat.completions.create({
    messages: historyWithSystemPrompt,
    model: process.env.OPENAI_GPT_MODEL || 'gpt-4',
  });
 

  let response = chatCompletion.choices[0].message.content;
  console.log("got ai response", response);
  const sanitizedResponse = fixWrongQuestionFormat(response);
  return sanitizedResponse;
};

export { getChatResponse };export const assistant = text => ({
    content: text,
    role: "assistant"
  });
  export const user = text => ({
    content: text,
    role: "user"
  });

function fixWrongQuestionFormat(response) {
  return response;//response.split('\n').length > 1 && response.split('\n')[0].includes('?') ? response.split('\n')[0] : response;
}

