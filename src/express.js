import express from 'express';
import crypto from 'crypto';

const PORT = process.env.LISTENER_PORT || 3000;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow handling application/x-www-form-urlencoded requests

// Store buffers in memory with their MIME types
const buffers = {};

// Function to add a buffer to the server
export const addBufferToServer = ({ buffer, mimeType }) => {
  if (!buffer || !mimeType) {
    throw new Error('Buffer and mimeType are required');
  }

  const hash = crypto.createHash('sha256').update(Buffer.from(buffer, 'base64')).digest('hex');

  // Store buffer with its MIME type if it doesn't already exist
  if (!buffers[hash]) {
    buffers[hash] = { buffer: Buffer.from(buffer, 'base64'), mimeType };
  }

  return `${process.env.PUBLIC_URL}/buffers/${hash}`;
};

// Endpoint to serve the buffers with the correct MIME type
app.get('/buffers/:hash', (req, res) => {
  const { hash } = req.params;
  const bufferObj = buffers[hash];

  if (bufferObj) {
    res.type(bufferObj.mimeType);
    res.send(bufferObj.buffer);
  } else {
    res.status(404).send('Buffer not found');
  }
});

setTimeout(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}, 200);
