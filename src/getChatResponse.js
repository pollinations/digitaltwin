import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./persona.js";

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

/**
 * Generates a chat response based on the provided history and userId.
 * @param {Array} history - The chat history.
 * @param {string} userId - The user ID.
 * @returns {Promise<string>} - The chat response.
 */
const getChatResponse = async (history, userId) => {
  const simplifiedHistory = history.slice(-40).map(({ role, content }) => ({ role, content })).filter(({ content }) => content && content.trim() !== '');
  const historyWithSystemPrompt = [
    {
      role: "system",
      content: SYSTEM_PROMPT({ seed: userId })
    },
    ...simplifiedHistory
  ];

  console.log("calling chatgpt with history (last 3 shown)", historyWithSystemPrompt.slice(-3));
  const chatCompletion = await openai.chat.completions.create({
    messages: historyWithSystemPrompt,
    model: process.env.OPENAI_GPT_MODEL || 'gpt-4o',
  });

  let response = chatCompletion.choices[0].message.content;
  console.log("got ai response", response);
  const sanitizedResponse = fixWrongQuestionFormat(response);
  return sanitizedResponse;
};

/**
 * Creates an assistant message object.
 * @param {string} text - The message content.
 * @returns {Object} - The assistant message object.
 */
const assistant = text => ({
  content: text,
  role: "assistant"
});

/**
 * Creates a user message object.
 * @param {string} text - The message content.
 * @returns {Object} - The user message object.
 */
const user = text => ({
  content: text,
  role: "user"
});

/**
 * Fixes the wrong question format in the response.
 * @param {string} response - The response to fix.
 * @returns {string} - The fixed response.
 */
function fixWrongQuestionFormat(response) {
  return response; // response.split('\n').length > 1 && response.split('\n')[0].includes('?') ? response.split('\n')[0] : response;
}

export { getChatResponse, assistant, user };

