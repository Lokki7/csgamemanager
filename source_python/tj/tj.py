from messages import SayText2
from events import Event
from players.entity import Player
from players.helpers import index_from_userid
from filters.entities import EntityIter
from engines.server import server
from engines.server import queue_command_string
from filters.players import PlayerIter
from threading import Timer

import urllib.request
import json


def load():
    SayText2('Plugin has been loaded successfully!').send()


def unload():
    SayText2('Plugin has been unloaded successfully!').send()


@Event('player_spawn')
def on_player_spawn():
    SayText2('player_spawn').send()


@Event('start_halftime')
def start_halftime():
    SayText2('start_halftime').send()


@Event('cs_intermission')
def cs_intermission():
    SayText2('cs_intermission').send()


@Event('map_transition')
def map_transition():
    SayText2('map_transition').send()


@Event('player_score')
def player_score():
    SayText2('player_score').send()


@Event('team_score')
def player_score():
    SayText2('team_score').send()


@Event('cs_win_panel_match')
def on_player_score():
    SayText2('Match has ended').send()
    port = server.udp_port
    post_score(port)
    SayText2('Game has ended. The server will be shut down in 10 seconds').send()

    t = Timer(10.0, shutdown)
    t.start()


def shutdown():
    queue_command_string('quit')


def post_score(port):
    score = []

    for entity in EntityIter('cs_team_manager'):
        score.append(entity.score)

    body = {'score': score, 'port': port}

    myurl = "http://localhost:3000/cs/ended"
    req = urllib.request.Request(myurl)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(body)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    urllib.request.urlopen(req, jsondataasbytes)
