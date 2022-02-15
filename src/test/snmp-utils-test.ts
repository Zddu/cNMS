import * as fs from 'fs/promises';
import { DeviceType } from '../monitor/types';
import { getMibModule, snmpGet, loadMibFile } from '../monitor/utils/snmp-utils';

const device: DeviceType = {
  ip: '47.94.238.68',
  community: 'public',
};
// const oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

export const jRun = async () => {
  //   snmpGet(device, oids).then(res => {
  //     console.log(res);
  //   });
  const snmpv2_mib_json = getMibModule('IP-MIB');
  // Object.keys(snmpv2_mib_json).map(k => {
  //   console.log(k, snmpv2_mib_json[k].OID);
  // });

  // fs.writeFile('./src/test/SNMPv2-MIB.json', JSON.stringify(json, null, '\t'), 'utf-8');
};
