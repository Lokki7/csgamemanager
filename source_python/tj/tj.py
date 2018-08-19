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
from listeners import OnServerActivate
from steam import SteamID

import urllib.request
import json
import sys
import os

players = []

# last_round = False
# total_score = {}


# def load():
#     SayText2('Plugin has been loaded successfully!').send()
#
#
# def unload():
#     SayText2('Plugin has been unloaded successfully!').send()


# @Event('round_announce_last_round_half')
# def round_announce_last_round_half(game_event):
#     global last_round
#     last_round = True
#
#
# @Event('round_end')
# def round_end(game_event):
#     global last_round
#
#     if not last_round:
#         return
#
#     last_round = False
#
#     save_stats()


@OnServerActivate
def on_server_activate(edicts, edict_count, max_clients):
    print('On_server_activate')
    players = json.loads(os.environ['steamplayers'])
    sys.stdout.flush()
    pass


@Event('cs_win_panel_match')
def on_player_score(event):
    SayText2('The game has ended. The server will be shut down in 10 seconds').send()

    port = server.udp_port
    t = Timer(10.0, shutdown)
    t.start()

    post_score(port)


def count_score():
    print('save_stats fired')
    total_score = {}

    for player in PlayerIter():
        steamid = SteamID.parse(player.steamid).to_uint64()

        if steamid not in total_score:
            total_score[steamid] = {'score': 0, 'kills': 0, 'deaths': 0}

        team_score = 0
        for team in EntityIter('cs_team_manager'):
            if team.team_index == player.team:
                team_score = team.score

        total_score[steamid]['kills'] = player.kills
        total_score[steamid]['deaths'] = player.deaths
        total_score[steamid]['score'] = team_score

    print(total_score)
    return total_score


def shutdown():
    queue_command_string('quit')


def post_score(port):
    print('post_score fired')

    body = {'score': count_score(), 'port': port}

    myurl = "http://localhost:3000/cs/ended"
    req = urllib.request.Request(myurl)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(body)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    urllib.request.urlopen(req, jsondataasbytes)
