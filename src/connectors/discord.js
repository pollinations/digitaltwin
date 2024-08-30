import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import sleep from 'await-sleep';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

let messageListeners = [];

const addListener = (listener) => {
    console.log("Added Discord listener");
    messageListeners.push(listener);
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    console.log(`Received message from ${message.author.username}: ${message.content}`);
    await Promise.all(messageListeners.map(listener => listener({
        channel: message.channel.id,
        text: message.content,
        name: message.author.username
    })));
});

const messageGenerator = async function* () {
    let messageQueue = [];
    const pushToQueue = (message) => messageQueue.push(message);
    addListener(pushToQueue);

    while (true) {
        if (messageQueue.length > 0) {
            yield messageQueue.shift();
        } else {
            await sleep(100);
        }
    }
};

const sendMessage = async (message, channelId, mediaBuffer = null) => {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            let sentMessage;
            if (mediaBuffer) {
                sentMessage = await channel.send({
                    content: message,
                    files: [{ attachment: mediaBuffer.buffer, name: 'audio.mp3' }]
                });
            } else {
                sentMessage = await channel.send(message);
            }
            console.log(`Message sent successfully to channel ${channelId}`);

            // Delete the message after a random delay between 30 and 60 seconds
            const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1) + 30000);
            let timeoutId;

            const deleteAndClearTimeout = () => {
                sentMessage.delete().catch(console.error);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };

            setTimeout(() => {
                // Only delete in 50% of cases
                if (Math.random() < 1) {
                    deleteAndClearTimeout();
                }
            }, randomDelay);

            // If the message contains separators, cycle between the messages
            if (message.includes('\n---\n')) {
                const messages = message.split('\n---\n');
                let currentIndex = 0;

                const cycleMessages = () => {
                    currentIndex = (currentIndex + 1) % messages.length;
                    messages[currentIndex] = obstructRandomCharacter(messages[currentIndex]);
                    message = messages.join('\n---\n');
                    sentMessage.edit(messages[currentIndex]).catch(console.error);

                    const randomInterval = Math.random() * (10000 - 200) + 5000;
                    timeoutId = setTimeout(cycleMessages, randomInterval);
                };

                cycleMessages();
            }
        } else {
            console.error(`Channel not found: ${channelId}`);
        }
    } catch (error) {
        console.error(`Failed to send message to channel ${channelId}:`, error);
    }
};

const init = () => {
    client.login(process.env.DISCORD_BOT_TOKEN);
};

init();
/**
 * Replaces random characters in the text with random ASCII characters, excluding characters that are part of a URL.
 * @param {string} text - The input text to obstruct.
 * @param {number} [n=4] - The number of times to obstruct a character.
 * @returns {string} - The text with random characters replaced by random ASCII characters.
 */
const obstructRandomCharacter = (text, n = 4) => {
    const getRandomAsciiChar = () => String.fromCharCode(Math.floor(Math.random() * 94) + 33);
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = [];
    let textWithoutUrls = text.replace(urlRegex, (url, offset) => {
        urls.push({ url, offset });
        return '';
    });

    if (textWithoutUrls.length === 0) return text;

    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * textWithoutUrls.length);
        const obstructedChar = getRandomAsciiChar();
        textWithoutUrls = textWithoutUrls.slice(0, randomIndex) + obstructedChar + textWithoutUrls.slice(randomIndex + 1);
    }

    let result = textWithoutUrls;
    urls.forEach(({ url, offset }) => {
        result = result.slice(0, offset) + url + result.slice(offset);
    });

    return result;
};

export { sendMessage, messageGenerator };