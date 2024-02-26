import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const getChatResponse = async (history) => {
  const simplifiedHistory = history.map(({ role, content }) => ({ role, content }));
  const historyWithSystemPrompt = [
    {
      role: "system",
      content: process.env.SYSTEM_PROMPT
    },
    ...simplifiedHistory]
  const chatCompletion = await openai.chat.completions.create({
    messages: historyWithSystemPrompt,
    model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
  });


  const response = chatCompletion.choices[0].message.content;
  console.log("got ai response", response);
  return response;
};

export { getChatResponse };
