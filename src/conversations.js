import fs from 'fs';
import path from 'path';

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

export const addMessage = (conversations, userId, message) => {
  const isNewConversation = !conversations[userId];

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

  if (isNewConversation) {
    const welcomeMessage = {
      role: "assistant",
      content: `Olá, aqui é PatPapo IA, uma inteligência artificial, um chat anônimo e seguro que se importa com a sua privacidade.

As frases, reflexões e mensagens de voz vêm do conteúdo exclusivo PatPapo que agora ganham este novo espaço.

Não estou aqui para substituir qualquer contato real, não sou psicóloga, nem psicanalista.
Você deve examinar tudo de forma crítica e para obter informações definitivas, entre em contato com especialistas da área.

Bem-vinda, bem-vindo!
E aí, bora bater um papo?

Política de privacidade: 
Em termos de proteção de dados e privacidade, é importante informar que o PatPapo IA é um espaço seguro e anônimo onde você pode conversar, pedir conselhos ou simplesmente ter uma palavra amiga. 
O Chat não recolhe quaisquer dados pessoais, fotografias de perfil, nomes ou números de telefone durante uma conversa e não compartilha quaisquer informações pessoais com terceiros.`,
      timestamp: new Date().getTime(),
    };

    conversations[userId].unshift(welcomeMessage);
  }

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