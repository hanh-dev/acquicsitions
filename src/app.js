import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send({
    message: 'Hello world!',
    time: new Date().toISOString(),
  });
});

export default app;
