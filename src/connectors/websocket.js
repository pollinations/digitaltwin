import WebSocket, { WebSocketServer } from 'ws';
import sleep from 'await-sleep';

const wss = new WebSocketServer({ port: 8080 });

let messageListeners = [];

const addListener = (listener) => {
  messageListeners.push(listener);
};

const messageGenerator = async function* () {

  let messageQueue = [];
  const pushToQueue = (message) => {
    messageQueue.push(message);
    console.log(`Pushed message to queue`, message);
  };
  addListener(pushToQueue);

  while (true) {
    if (messageQueue.length > 0) {
      yield messageQueue.shift();
    } else {
      await sleep(100);
    }
  }
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    messageListeners.forEach(listener => listener(parsedMessage));
  });
});

const sendMessage = async (text, recipientId, media = null) => {
  const ws = [...wss.clients].find(client => client.id === recipientId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    const payload = { text };
    if (media) {
      const base64DataUrl = `data:${media.mimetype};base64,${media.buffer.toString('base64')}`;
      payload.media = base64DataUrl;
    }
    ws.send(JSON.stringify(payload));
  }
};

export {
  messageGenerator,
  sendMessage
};