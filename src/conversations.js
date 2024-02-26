

const addMessage = (conversations, userId, { content, role = "user" }) => {
  if (!conversations[userId]) {
    conversations = { ...conversations, [userId]: [] };
  }

  const newMessage = {
    content,
    timestamp: new Date().getTime(),
    role,
  };

  conversations = {
    ...conversations,
    [userId]: [...conversations[userId], newMessage]
  };

  console.log("modified conversations", conversations);

  return conversations;
};

exports.addMessage = addMessage;
