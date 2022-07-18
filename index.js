const express = require('express');
const EmailValidator = require('email-deep-validator');
const bodyParser = require('body-parser');
const cors = require('cors')
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
const port = 5555;

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/', async (req, res) => {
  const emailValidator = new EmailValidator();
  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(req.body.email);
  res.send({
    data: (wellFormed && validDomain && validMailbox)
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
httpsServer.listen(port + 1) 
httpServer.listen(port)