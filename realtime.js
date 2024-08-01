import * as PlayHT from 'playht';
import { getChatResponse } from './getChatResponse.js';
import dotenv from 'dotenv';

dotenv.config();

PlayHT.init({
    apiKey: process.env.PLAYHT_API_KEY,
    userId: process.env.PLAYHT_USER_ID,
    defaultVoiceId: process.env.PLAYHT_DEFAULT_VOICE_ID,
    defaultVoiceEngine: process.env.PLAYHT_DEFAULT_VOICE_ENGINE,
});

const handleRealTimeConversation = async (userId, userMessage) => {
    try {
        // Get chat response from the AI
        const history = []; // You should replace this with the actual conversation history
        const aiResponse = await getChatResponse(history, userId);

        // Generate audio from the AI response
        const generated = await PlayHT.generate(aiResponse);
        const { audioUrl } = generated;

        console.log('The url for the audio file is', audioUrl);

        return audioUrl;
    } catch (error) {
        console.error('Error in real-time conversation:', error);
        throw error;
    }
};

// Example usage
const userId = 'exampleUserId';
const userMessage = 'Hello, how are you?';
handleRealTimeConversation(userId, userMessage).then(audioUrl => {
    console.log('Generated audio URL:', audioUrl);
}).catch(error => {
    console.error('Error:', error);
});
