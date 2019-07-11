const dotenv = require('dotenv');
dotenv.config();

const server = require('./server');

const port = process.env.PORT || 6000
server.listen(4000, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});