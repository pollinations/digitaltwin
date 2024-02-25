const express = require('express');
const crypto = require('crypto');

const PORT = process.env.LISTENER_PORT || 3000;
const app = express();

// Store buffers in memory with their MIME types
const buffers = {};

// Function to add a buffer to the server
const addBufferToServer = async (buffer, mimeType) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, addBufferToServer };
