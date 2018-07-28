import express from 'express';
import CsServer from './cs-server'

const app = express();
app.use(express.json());

let servers = {};

app.post('/cs/start', async (req, res) => {
  let {map} = req.body;

  let server = new CsServer();
  let connectParams = await server.start({map});

  servers[connectParams.port] = server;

  res.send({server: connectParams});
});

app.post('/cs/ended', async (req, res) => {
  let {port, score} = req.body;
  console.log('Got ended', req.body);

  let server = servers[port];
  if(server) {
    console.log(`Stopping server at ${port}`);
    server.kill();
    delete servers[port];
  }

  res.send('ok');
});

app.listen(3000, '0.0.0.0');
