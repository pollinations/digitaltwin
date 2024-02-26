const express = require('express');

const app = express();
exports.app = app;
const PORT = process.env.LISTENER_PORT || 3000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
