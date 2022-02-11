import { DeviceType, Session, SnmpOptionsType, VarbindsType } from '../types';
export const snmp = require('net-snmp');
const mibparser = require('../utils/mib.js');
import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { fileNameArr, temps } from '../constants';

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

const loadMibFile = (fileName: string) => {
  mibparser().Import(fileName);
  mibparser().Serialize();
};

export const parseMibsFile = (mibName: string) => {
  const store = snmp.createModuleStore();
  const load = async (path: string) => {
    fileNameArr.forEach(filename => {
      const filePath = path + `/${filename}`;
      stat(filePath)
        .then(fstat => {
          if (fstat.isFile()) {
            try {
              // loadMibFile(filePath);
              store.loadFromFile(filePath);
            } catch (error) {}
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  };
  load('src/monitor/mibs');
  return store.getModule(mibName);
};

export const readMibsFile = () => {};
