import cp from 'child_process';

const execCmd = `./srcds_run`;
const cwd = '/home/csuser/duels/cs-src';

export default class SourceServer {
  constructor() {
    this.cb = () => {};

    this.cwd = cwd;
    this.execCmd = execCmd;
  }

  async start(params) {
  }

  shellExec(params, env) {
    console.log('Starting', params, env);

    let cs = cp.spawn(this.execCmd, this.buildExecParams(params), {cwd: this.cwd, env});

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