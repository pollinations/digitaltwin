import fs from 'fs';
import path from 'path';

const messagesDir = "./messageStore/el405b";

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

export const addMessage = (conversations, userId, message) => {
  conversations = {
    ...conversations,
    [userId]: [
      ...(conversations[userId] || []),
      {
        role: "user",
        ...message,
        timestamp: new Date().getTime(),
      },
    ],
  };

  saveMessageToFile(userId, conversations);

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
    conversations[userId] = userData.filter(message => message.content);
  });

  return conversations;
};