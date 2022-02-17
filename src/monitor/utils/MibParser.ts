import { fileNameArr } from '../constants';
const fs = require('fs');
const mibparser = require('./mib');

interface parserProps {
  Import: (filename: string) => void;
  Serialize: () => void;
  Modules: { [key: string]: any };
}
const BASE_MODULES = [
  'RFC1155-SMI',
  'RFC1158-MIB',
  'RFC-1212',
  'RFC1213-MIB',
  'SNMPv2-SMI',
  'SNMPv2-CONF',
  'SNMPv2-TC',
  'SNMPv2-MIB',
];
class MibParser {
  private parser: parserProps;
  private loaded: boolean;

  constructor() {
    this.parser = mibparser();
    this.loadBaseModules();
  }

  private loadBaseModules() {
    this.loaded = false;
    const path = 'src/monitor/mibs';

    BASE_MODULES.forEach(v => {
      this.parser.Import('src/monitor/basemibs/' + v + '.mib');
    });

    fileNameArr.forEach(filename => {
      const filePath = path + `/${filename}`;
      const stat = fs.lstatSync(filePath);
      if (stat.isFile) {
        try {
          this.parser.Import(filePath);
          console.log('加载' + filename + '中...');
        } catch (error) {}
      }
    });

    this.parser.Serialize();
    this.loaded = true;
  }

  loadFromFile(filename: string) {
    this.loaded = false;
    this.parser.Import(filename);
    console.log('加载' + filename + '中...');
    this.parser.Serialize();
    this.loaded = true;
  }

  getModule(moduleName: string) {
    if (!this.loaded) {
      return '正在努力加载MIB库文件中...';
    }
    return this.parser.Modules[moduleName];
  }

  getModules() {
    return this.parser.Modules;
  }
}

export default new MibParser();
