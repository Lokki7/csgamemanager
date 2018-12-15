import PortChecker from './post-checker';
import SourceServer from './source-server';

const ip = '195.9.195.14';
const execCmd = `./srcds_run`;
const steamAcc = 'CEE6A690FC37A645811F901EEC6BE138';
const cwd = '/home/csuser/duels/cs-go';

const defaultParams = {
  '-game': 'csgo',
  '-console': '',
  '-usercon': '',
  '+game_type': 1,
  '+game_mode': 2,
  '+map': 'de_dust2',
  '+sv_setsteamaccount': steamAcc,
};

export default class CsgoServer extends SourceServer {
  constructor() {
    super();

    this.cwd = cwd;
    this.execCmd = execCmd;
  }

  async start({map, players}) {
    let port = await (new PortChecker()).getFreePort();

    let params = {
      ...defaultParams,
      '+map': map,
      '-port': port
    };

    if (players && players[0].length > 1) {
      params['+game_type'] = 0;
      params['+game_mode'] = 1;
    }

    let env = {'steamplayers': JSON.stringify(players)};

    this.process = this.shellExec(params, env);
    return new Promise(resolve => this.cb = () => resolve({ip, port}));
  }


}