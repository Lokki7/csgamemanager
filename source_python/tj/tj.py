from messages import SayText2
from events import Event
from players.entity import Player
from players.helpers import index_from_userid
from filters.entities import EntityIter
from engines.server import server
from engines.server import queue_command_string
from filters.players import PlayerIter
from threading import Timer
from filters.players import PlayerIter

import urllib.request
import json

last_round = False
total_score = {}


# def load():
#     SayText2('Plugin has been loaded successfully!').send()
#
#
# def unload():
#     SayText2('Plugin has been unloaded successfully!').send()


@Event('round_announce_last_round_half')
def round_announce_last_round_half(game_event):
    global last_round
    last_round = True


@Event('round_end')
def round_end(game_event):
    global last_round

    if not last_round:
        return

    last_round = False

    save_stats()


@Event('teamchange_pending')
def teamchange_pending(event):
    SayText2('teamchange_pending').send()


@Event('player_team')
def player_team(event):
    SayText2('player_team').send()


@Event('cs_win_panel_match')
def on_player_score(event):
    SayText2('The game has ended. The server will be shut down in 10 seconds').send()

    save_stats()
    port = server.udp_port
    t = Timer(10.0, shutdown)
    t.start()

    post_score(port)


def save_stats():
    global total_score

    for player in PlayerIter():
        if player.name not in total_score:
            total_score[player.name] = {'score': 0, 'kills': 0, 'deaths': 0}

        # print(dir(player.get_team()))

        team_score = 0
        for entity in EntityIter('cs_team_manager'):
            print(dir(entity))

        total_score[player.name]['kills'] += player.kills
        total_score[player.name]['deaths'] += player.deaths
        total_score[player.name]['score'] = team_score

    print(total_score)
    return


def shutdown():
    queue_command_string('quit')


def post_score(port):
    global total_score
    # score = []

    print(total_score)

    # for entity in EntityIter('cs_team_manager'):
    #     score.append(entity.score)

    body = {'score': total_score, 'port': port}

    myurl = "http://localhost:3000/cs/ended"
    req = urllib.request.Request(myurl)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(body)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    urllib.request.urlopen(req, jsondataasbytes)
