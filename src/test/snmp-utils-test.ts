import * as fs from 'fs/promises';
import { DeviceType } from '../monitor/types';
import { parseMibsFile, snmpGet } from '../monitor/utils/snmp-utils';

const device: DeviceType = {
  ip: '47.94.238.68',
  community: 'public',
};
const oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

export const jRun = () => {
  //   snmpGet(device, oids).then(res => {
  //     console.log(res);
  //   });
  const json = parseMibsFile('src/monitor/mibs/IF-MIB');
  //   fs.writeFile(
  //     './src/test/if-mib1.json',
  //     JSON.stringify(json, null, '\t'),
  //     'utf-8'
  //   );
};
