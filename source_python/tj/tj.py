from messages import SayText2
from events import Event
from players.entity import Player
from players.helpers import index_from_userid
from filters.entities import EntityIter

def load():
    SayText2('Plugin has been loaded successfully!').send()

def unload():
    SayText2('Plugin has been unloaded successfully!').send()


@Event('cs_win_panel_round')
def on_player_score(game_event):
    SayText2('win panel').send()
    get_team_score()


def get_team_score():
    for entity in EntityIter('cs_team_manager'):
        print(entity.score)

