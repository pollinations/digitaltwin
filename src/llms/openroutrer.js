import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../persona.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://pollinations.ai", // Optional, for including your app on openrouter.ai rankings.
    "X-Title": "Pollinations", // Optional. Shows in rankings on openrouter.ai.
  }
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

  console.log("calling openrouter with history (last 3 shown)", historyWithSystemPrompt.slice(-3));

  const responses = await Promise.all([
    getOpenRouterResponse(historyWithSystemPrompt),
    // getOpenRouterResponse(historyWithSystemPrompt),
    // getOpenRouterResponse(historyWithSystemPrompt)
  ]);

  const combinedResponse = responses.join('\n---\n');
  console.log("got ai responses", combinedResponse);
  return combinedResponse;
};

/**
 * Gets a single response from OpenRouter.
 * @param {Array} messages - The chat messages.
 * @returns {Promise<string>} - A single chat response.
 */
const getOpenRouterResponse = async (messages) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "cognitivecomputations/dolphin-llama-3-70b",
    // temperature: 1.10,
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
 * @param {string} name - The user's name.
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
const sanitizeName = (name) => {
  if (!name) return name;
  return name.replace(/[^a-zA-Z0-9_-]/g, '');
};

export { getChatResponse, assistant, user };