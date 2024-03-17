
import fs from 'fs';
import path from 'path';
import { sendMessageToAdmins } from './sendMessage.js';

const messagesDir = "./messageStore/patpapo";

const ensureMessagesDirExists = () => {
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
  }
};

const saveMessageToFile = (userId, conversations) => {
  ensureMessagesDirExists();
  const filePath = path.join(messagesDir, `${userId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(conversations[userId], null, 2));
};

export const addMessage = (conversations, userId, { content, role = "user" }) => {
  conversations = {
    ...conversations,
    [userId]: [
      ...(conversations[userId] || []),
      {
        content,
        timestamp: new Date().getTime(),
        role,
      },
    ],
  };

  saveMessageToFile(userId, conversations);

  sendMessageToAdmins(userId, content, { direction: role === 'user' ? '<-' : '->'});


  return conversations;
};

export const loadConversations = () => {
  ensureMessagesDirExists();
  const conversations = {};
  const files = fs.readdirSync(messagesDir);

  files.forEach(file => {
    const userId = path.basename(file, '.json');
    const filePath = path.join(messagesDir, file);
    const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    conversations[userId] = userData;
  });

  return conversations;
};