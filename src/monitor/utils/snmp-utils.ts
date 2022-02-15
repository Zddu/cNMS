import { DeviceType, Session, SnmpOptionsType, VarbindsType } from '../types';
const fs = require('fs');
export const snmp = require('net-snmp');
import { fileNameArr, temps } from '../constants';
import Mib from './MibParser';

export const defaultOptions: SnmpOptionsType = {
  port: 161,
  retries: 1,
  timeout: 2000,
  backoff: 1.0,
  transport: 'udp4',
  trapPort: 162,
  version: snmp.Version2c,
  backwardsGetNexts: true,
  idBitsSize: 32,
};

export const createSnmpSession = (device: DeviceType): Session => {
  const { ip, community } = device;
  return snmp.createSession(ip, community, defaultOptions) as Session;
};

export const snmpGet = (device: DeviceType, oids: string | string[]) => {
  return new Promise<VarbindsType[]>((resolve, reject) => {
    createSnmpSession(device).get(oids, (error, varbinds) => {
      if (error) {
        reject(error);
      } else {
        resolve(varbinds);
      }
    });
  });
};

// export const loadMibFile = (path: string) => {
//   try {
//     const files = readdir(path);
//     return files;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const loadMibFile = async () => {
  const store = new Mib();
  console.log('aa');

  const path = 'src/monitor/mibs';
  fileNameArr.forEach(filename => {
    const filePath = path + `/${filename}`;
    const stat = fs.lstatSync(filePath);
    if (stat.isFile) {
      try {
        store.loadFromFile(filePath);
      } catch (error) {}
    }
  });
  console.log('bb');
  return store;
};

export const getMibModule = async (mibName: string) => {
  const store = await loadMibFile();
  console.log('dd');
  return store.getModule(mibName);
};
