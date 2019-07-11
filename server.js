const express = require('express');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(logger);
server.use(express.json());
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

// middleware

function logger(req, res, next) {
  console.log(`${req.method} to http://localhost/4000${req.path} at `, Date.now(),
  );
  next();
}

module.exports = server;