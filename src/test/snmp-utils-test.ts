import * as fs from 'fs/promises';
import { DeviceType } from '../monitor/types';
import { connect } from '../database';
import mib from '../monitor/utils/MibParser';
import {
  getMibModule,
  snmpGet,
  snmpTable,
  getMibModules,
  oid2ObjName,
} from '../monitor/utils/snmp-utils';
import { fileNameArr } from '../monitor/constants';

const device: DeviceType = {
  ip: '47.94.238.68',
  community: 'public',
};
// const oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

export const jRun = async () => {
  const name = await oid2ObjName('1.3');
  console.log(name);
  // const conn = await connect();
  // await conn.query('delete from mibs where module_name = ?', ['RFC1213-MIB']);
  // insertAllMib(conn);
  // snmpTable(device, '1.3.6.1.2.1.2.2', 20).then(res => {
  //   console.log(res['2']['2'].toString());
  // });
  // const conn = await connect();
  // const snmpv2_mib_json = getMibModule('IP-MIB');
  // console.log(snmpv2_mib_json);
  // Object.keys(snmpv2_mib_json).map(k => {
  //   console.log(k, snmpv2_mib_json[k].OID);
  // });
  // fs.writeFile('./src/test/SNMPv2-MIB.json', JSON.stringify(json, null, '\t'), 'utf-8');
};

function insertAllMib(conn) {
  const json = mib.getModule('SNMPv2-SMI');
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
