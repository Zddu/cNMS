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

  constructor() {
    this.parser = mibparser();
    this.loadBaseModules();
  }

  private loadBaseModules() {
    BASE_MODULES.forEach(v => {
      this.parser.Import('src/monitor/basemibs/' + v + '.mib');
    });
    this.parser.Serialize();
  }

  loadFromFile(filename: string) {
    this.parser.Import(filename);
    console.log('加载' + filename + '中...');
    this.parser.Serialize();
  }

  getModule(moduleName: string) {
    return this.parser.Modules[moduleName];
  }
}

export default MibParser;
