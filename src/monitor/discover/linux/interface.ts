import { DeviceType } from './../../types';
import { snmpNext, snmpTable, snmpTableColumns } from '../../../monitor/utils/snmp-utils';
import { objBuffer2String, strSplice } from '../../../common';
import { connect } from '../../../database';
const ifTable = '1.3.6.1.2.1.2.2';
const ifPhysicsOids = [
  '1.3.6.1.2.1.2.2.1.1', // ifIndex
  '1.3.6.1.2.1.2.2.1.2', // ifDescr
  '1.3.6.1.2.1.2.2.1.3', // ifType
  '1.3.6.1.2.1.2.2.1.4', // ifMtu
  '1.3.6.1.2.1.2.2.1.5', // ifSpeed
  '1.3.6.1.2.1.2.2.1.6', // ifPhysAddress
  '1.3.6.1.2.1.2.2.1.7', // ifAdminStatus
];

export default async function getInterface(device: DeviceType) {
  try {
    const if_table = await snmpTableColumns(device, ifTable, [1, 2, 3, 4, 5, 6, 7], 10);
    if_table['2']['6'] = strSplice(if_table['2']['6'].toString('hex'), 2, '-');
    const interTable = objBuffer2String(if_table);

    console.log(interTable);
  } catch (error) {
    console.log(error);
  }
}
