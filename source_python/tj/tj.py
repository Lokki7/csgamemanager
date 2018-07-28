from messages import SayText2
from events import Event
from players.entity import Player
from players.helpers import index_from_userid
from filters.entities import EntityIter
from engines.server import server
from engines.server import queue_command_string
from filters.players import PlayerIter

import urllib.request
import json


#def load():
#     SayText2('Plugin has been loaded successfully!').send()

# def unload():
#     SayText2('Plugin has been unloaded successfully!').send()


@Event('cs_win_panel_match')
def on_player_score(game_event):
    SayText2('Match has ended').send()
    port = server.udp_port
    post_score(port)
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
