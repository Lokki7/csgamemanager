import net from 'net';

export default class PortChecker {

  constructor() {
    this.portRange = [27000, 28000];
  }

  async getFreePort() {
    let free = false;
    let rndPort = 0;

    while (!free) {
      rndPort = this.getRandomPort();
      free = await this.isPortFree(rndPort);
    }

    return rndPort;
  }

  getRandomPort() {
    let max = this.portRange[1];
    let min = this.portRange[0];

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  isPortFree(port) {

    return new Promise((resolve, reject) => {
      let tester = net.createServer();

      tester.on('error', err => {
        if (err.code != 'EADDRINUSE') return reject(err);
        resolve(false);
      });

      tester.on('listening', () => {
        tester.on('close', () => resolve(true));
        tester.close();
      });

      tester.listen(port);
    })


  }

}