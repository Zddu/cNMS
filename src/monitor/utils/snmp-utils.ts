import { connect } from '../../database';
import { DeviceType, Session, SnmpOptionsType, VarbindsType } from '../types';
const snmp = require('net-snmp');
const { exec } = require('child_process');
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

export const oid2ObjName = async (oid: string) => {
  const conn = await connect();
  return (await conn.query('select * from mibs where oid = ?', [oid]))[0];
};

export const getMibModule = (mibName: string) => {
  return mib.getModule(mibName);
};

export const getMibModules = () => {
  return mib.getModules();
};

export const snmpGetByName = (oidName: string) => {
  const cmdStr = 'snmpget -v 2c -c public localhost SNMPv2-MIB::sysUpTime.0';
  exec(cmdStr, (error, data) => {
    console.log(data);
  });
};

export const createMib = async (mibName: string) => {
  const conn = await connect();
  const json = mib.getModule(mibName);
  if (json) {
    Object.keys(json).map(async k => {
      if (k !== 'IMPORTS' && json[k].OID) {
        const mib = {
          oid: json[k].OID,
          name: k,
          module_name: json[k].ModuleName,
          description: json[k].DESCRIPTION ? json[k].DESCRIPTION : '',
        };
        try {
          console.log(mib);
          await conn.query('insert into mibs set ?', [mib]);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}
