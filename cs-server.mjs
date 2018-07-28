import {spawn} from 'child_process';
import PortChecker from './post-checker';

const ip = '195.9.195.14';
const execCmd = `./srcds_run`;
const steamAcc = 'CEE6A690FC37A645811F901EEC6BE138';
const cwd = '.';

const defaultParams = {
  '-game': 'csgo',
  '-console': '',
  '-usercon': '',
  '+game_type': 0,
  '+game_mode': 0,
  '+map': 'de_dust',
  '+mapgroup': 'mg_active',
  '+sv_setsteamaccount': steamAcc,
};

export default class CsServer {

  constructor() {
  }

  async start({map}) {
    let port = await (new PortChecker()).getFreePort();

    let params = {
      ...defaultParams,
      '+map': map,
      '-port': port
    };

    this.process = this.shellExec(params);

    return {ip, port}
  }

  shellExec(params) {
    let cs = spawn(execCmd, this.buildExecParams(params), {cwd});

    cs.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    cs.stderr.on('data', (data) => console.log(`stderr: ${data}`));
    cs.stderr.on('close', (code, signal) => console.log(`child process terminated due to receipt of signal ${signal}`));

    return cs;
  }

  kill() {
    console.log('Killing process');
    this.process.kill();
  }

  buildExecParams(params) {
    return Object.keys(params).map(key => key + ' ' + params[key]);
  }


}