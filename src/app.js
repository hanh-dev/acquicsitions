import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send({ 
    message: 'Hello from Express!',
    time: new Date().toISOString()
  });
});

export default app;