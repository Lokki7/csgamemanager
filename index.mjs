import express from 'express';
import request from 'request';

import CsgoServer from './csgo-server';
import CssServer from './css-server';
import L4d2Server from './l4d2-server';
import TFServer from './tf-server';

const app = express();
app.use(express.json());

let servers = {};

app.post('/cs/start', async (req, res) => {
  let {map, match, players} = req.body;

  let server = new CsgoServer();
  let connectParams = await server.start({map, players});

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
    url: 'https://esport.tj/api/matches/result',
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


app.post('/game/start', async (req, res) => {
  let {game, map, match, players} = req.body;

  let server;
  switch (game) {
    case 2:
      server = new CsgoServer();
      break;
    case 6:
      server = new TFServer();
      break;
    case 4:
      server = new CssServer();
      break;
    case 5:
      server = new L4d2Server();
      break;

  }

  let connectParams = await server.start({map, players});

  server.matchId = match;
  servers[connectParams.port] = server;

  res.send({server: connectParams});
});


app.listen(27030, '0.0.0.0');
