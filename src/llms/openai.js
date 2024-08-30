import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../persona.js";

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
  const simplifiedHistory = history.slice(-40).map(({ role, content, name }) => ({ role, content, name: sanitizeName(name) })).filter(({ content }) => content && content.trim() !== '');
  const historyWithSystemPrompt = [
    {
      role: "system",
      content: SYSTEM_PROMPT({ seed: userId })
    },
    ...simplifiedHistory
  ];

  console.log("calling chatgpt with history (last 3 shown)", historyWithSystemPrompt.slice(-3));

  const response = await getOpenAIResponse(historyWithSystemPrompt);
  console.log("got ai response", response);
  return response;
};

/**
 * Gets a single response from OpenAI.
 * @param {Array} messages - The chat messages.
 * @returns {Promise<string>} - A single chat response.
 */
const getOpenAIResponse = async (messages) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: process.env.OPENAI_GPT_MODEL || 'gpt-4o',
  });

  return chatCompletion.choices[0].message.content;
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
 * @param {string} name - The user name.
 * @returns {Object} - The user message object.
 */
const user = (text, name = undefined) => ({
  content: text,
  role: "user",
  name: sanitizeName(name) // Ensure name is sanitized
});

/**
 * Fixes the wrong question format in the response.
 * @param {string} response - The response to fix.
 * @returns {string} - The fixed response.
 */
function fixWrongQuestionFormat(response) {
  return response; // response.split('\n').length > 1 && response.split('\n')[0].includes('?') ? response.split('\n')[0] : response;
}

/**
 * Sanitizes the name to match the required pattern.
 * @param {string} name - The name to sanitize.
 * @returns {string} - The sanitized name.
 */
function sanitizeName(name) {
  if (!name) return name;
  return name.replace(/[^a-zA-Z0-9_-]/g, '');
}

export { getChatResponse, assistant, user };