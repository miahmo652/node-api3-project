const express = require('express');

const server = express();
const userRouter = require("./users/userRouter")
const logger = require("./middleware/logger")


server.use(logger());
server.use(express.json());
server.use("/api/users", userRouter)
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});





module.exports = server;
