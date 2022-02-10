import * as fs from 'fs/promises';
import { DeviceType } from '../monitor/types';
import { parseMibsFile, snmpGet } from '../monitor/utils/snmp-utils';

const device: DeviceType = {
  ip: '47.94.238.68',
  community: 'public',
};
// const oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

export const jRun = async () => {
  //   snmpGet(device, oids).then(res => {
  //     console.log(res);
  //   });
  // const json = parseMibsFile('SNMPv2-MIB');
  // console.log(json);
  // fs.writeFile('./src/test/SNMPv2-MIB.json', JSON.stringify(json, null, '\t'), 'utf-8');
  const path = 'src/monitor/mibs/';
  
  const data = await fs.readFile('src/monitor/mibs/SNMPv2-MIB', 'utf-8');
  console.log(data)
};