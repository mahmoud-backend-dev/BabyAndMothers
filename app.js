require('dotenv').config();
const express = require('express');
const app = express();
const port = 1812 | process.env.PORT;

const connectDB = require('./db/connectDB');

const start = async () => {
  try {
    await connectDB(process.env.URI);
    app.listen(port, () => console.log(`Listen on http://localhost${port}`));
  } catch (error) {
    console.log(error);
  }
};

start()