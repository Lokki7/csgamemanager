from messages import SayText2
from events import Event
from players.entity import Player
from players.helpers import index_from_userid
from filters.entities import EntityIter
from engines.server import server

import urllib.request
import json


def load():
    port = server.udp_port
    print('!!!!!')
    print(port)
    print('!!!!!')
    # SayText2('Plugin has been loaded successfully!').send()

# def unload():
#     SayText2('Plugin has been unloaded successfully!').send()


@Event('cs_win_panel_round')
def on_player_score(game_event):
    SayText2('Match has ended').send()
    post_score()


def post_score():
    port = server.udp_port
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

    # for entity in EntityIter('cs_team_manager'):
    #     print(entity.score)


