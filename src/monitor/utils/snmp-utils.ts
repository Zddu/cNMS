import { DeviceType, Session, SnmpOptionsType, VarbindsType } from '../types';
const fs = require('fs');
export const snmp = require('net-snmp');
import { fileNameArr } from '../constants';
import mib from './MibParser';

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

export const snmpTable = (device: DeviceType, oid: string, maxRepetitions: number) => {
  return new Promise<any>((resolve, reject) => {
    createSnmpSession(device).table(oid, maxRepetitions, (error, table) => {
      if (error) {
        reject(error);
      } else {
        resolve(table);
      }
    });
  });
};


export const getMibModule = (mibName: string) => {
  return mib.getModule(mibName);
};

export const getMibModules = () => {
  return mib.getModules();
};
