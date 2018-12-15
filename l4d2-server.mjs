import PortChecker from './post-checker';
import SourceServer from './source-server';

const ip = '195.9.195.14';
const execCmd = `./srcds_run`;
const cwd = '/home/csuser/duels/l4d2';
const steamAcc = '4A90C150F3018C64C72C98A74E81D703';

const defaultParams = {
  '-game': 'left4dead2',
  '-console': '',
  '+map': 'c1m4_atrium',
  '+sv_setsteamaccount': steamAcc,
};

export default class L4d2Server extends SourceServer {
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