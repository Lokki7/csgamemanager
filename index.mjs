import express from 'express';
import CsServer from './cs-server';
import request from 'request';

const app = express();
app.use(express.json());

let servers = {};

app.post('/cs/start', async (req, res) => {
  let {map, match} = req.body;

  let server = new CsServer();
  let connectParams = await server.start({map});

  server.matchId = match;
  servers[connectParams.port] = server;

  res.send({server: connectParams});
});

app.post('/cs/ended', async (req, res) => {
  let {port, score} = req.body;
  console.log('Got ended', req.body);

  let server = servers[port];
  if (server) {
    console.log(`Stopping server at ${port}`);
    server.kill();
    delete servers[port];
  }

  let body = {
    match: server.matchId,
    score: score
  };

  request.post({
    url: 'http://esport-tj.imt.zone/api/matches/duels/result',
    json: body
  }, function (error, response, body) {
    console.log(response, body)
  });


  // fetch(, {
  //   method: 'POST',
  //   body:    JSON.stringify(),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  //   .then(res => res.json())
  //   .then(json => console.log(json));


  // send score to web
  res.send('ok');
});

app.listen(3000, '0.0.0.0');
