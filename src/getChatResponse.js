const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});
const getChatResponse = async (history) => {
  const simplifiedHistory = history.map(({ role, content }) => ({ role, content }));
  const chatCompletion = await openai.chat.completions.create({
    messages: simplifiedHistory,
    model: 'gpt-3.5-turbo',
  });
  console.log("got completion", chatCompletion);

  const response = chatCompletion.choices[0].message.content;

  return response;
};
exports.getChatResponse = getChatResponse;
