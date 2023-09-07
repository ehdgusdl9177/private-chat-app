const express = require("express");
const path = require("path");
const app = express();

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
app.use(express.json());

const port = 4000;
app.listen(port, () => {
  console.log(`Aerver is up on ${port}`);
});
