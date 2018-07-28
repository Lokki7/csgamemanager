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


_round_status = False


@Event('round_announce_last_round_half')
def round_announce_last_round_half(game_event):
    global _round_status
    _round_status = True


@Event('round_end')
def round_end(game_event):
    if not _round_status:
        return

    global _round_status
    _round_status = False

    print('last_round_half')
    SayText2('last_round_half').send()


@Event('teamchange_pending')
def teamchange_pending(event):
    SayText2('teamchange_pending').send()


@Event('player_team')
def player_team(event):
    SayText2('player_team').send()


@Event('cs_win_panel_match')
def on_player_score(event):
    SayText2('The game has ended. The server will be shut down in 10 seconds').send()

    port = server.udp_port
    t = Timer(10.0, shutdown)
    t.start()

    post_score(port)


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
