import PortChecker from './post-checker';
import SourceServer from './source-server';

const ip = '109.68.238.63';
const execCmd = `./srcds_run`;
const cwd = '/home/csuser/duels/tf2';
const steamAcc = '66148F627E8199794EEEABF565989A84';

const defaultParams = {
  '-game': 'tf',
  '-console': '',
  '+map': 'cp_badlands',
  '+sv_setsteamaccount': steamAcc,
};

export default class TFServer extends SourceServer {
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

    let env = {'steamplayers': JSON.stringify(players)};

    this.process = this.shellExec(params, env);
    return new Promise(resolve => this.cb = () => resolve({ip, port}));
  }

}