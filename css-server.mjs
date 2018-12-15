import PortChecker from './post-checker';
import SourceServer from './source-server';

const ip = '109.68.238.63';
const execCmd = `./srcds_run`;
const cwd = '/home/csuser/duels/cs-src';
const steamAcc = 'B8FFD412DED380E1FA9C774DD79B8B92';

const defaultParams = {
  '-game': 'cstrike',
  '-console': '',
  '+map': 'de_dust2',
  '+sv_setsteamaccount': steamAcc,
};

export default class CssServer extends SourceServer {
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