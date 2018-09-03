import cp from 'child_process';
import PortChecker from './post-checker';

const ip = '195.9.195.14';
const execCmd = `./srcds_run`;
const steamAcc = 'CEE6A690FC37A645811F901EEC6BE138';
const cwd = '/home/csuser/duels/cs-go/';

const defaultParams = {
  '-game': 'csgo',
  '-console': '',
  '-usercon': '',
  '+game_type': 1,
  '+game_mode': 2,
  '+map': 'de_dust2',
  // '+mapgroup': 'mg_active',
  '+sv_setsteamaccount': steamAcc,
};

export default class CsServer {

  constructor() {
    this.cb = () => {};
  }

  async start({map, players}) {
    let port = await (new PortChecker()).getFreePort();

    let params = {
      ...defaultParams,
      '+map': map,
      '-port': port
    };

    if(players && players[0].length > 1) {
      params['+game_type'] = 0;
      params['+game_mode'] = 1;
    }

    let env = {'steamplayers': JSON.stringify(players)};

    this.process = this.shellExec(params, env);
    return new Promise(resolve => this.cb = () => resolve({ip, port}));
  }

  shellExec(params, env) {
    let cs = cp.spawn(execCmd, this.buildExecParams(params), {cwd, env});

    cs.stdout.on('data', (data) => {
      if (data.indexOf('On_server_activate') !== -1) this.cb();
      console.log(`stdout: ${data}`);
    });

    cs.stderr.on('data', (data) => console.log(`stderr: ${data}`));
    cs.stderr.on('close', (code, signal) => console.log(`child process terminated due to receipt of signal ${signal}`));

    return cs;
  }

  kill() {
    console.log('Killing process');
    this.process.kill('SIGTERM');
  }

  buildExecParams(params) {
    return Object.keys(params).map(key => key + ' ' + params[key]);
  }


}