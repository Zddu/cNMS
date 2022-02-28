import { INTER_TYPES } from './typings';
import { DeviceType } from './../../types';
import { snmpNext, snmpTable, snmpTableColumns } from '../../../monitor/utils/snmp-utils';
import { isObj, objBuffer2String, strSplice } from '../../../common';
import { connect } from '../../../database';
const ifTable = '1.3.6.1.2.1.2.2';
const ipTable = '1.3.6.1.2.1.4.20';
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
    const physicsInterfaces: any[] = [];
    const if_table = await snmpTableColumns(device, ifTable, [1, 2, 3, 4, 5, 6, 7], 10);
    const ip_table = await snmpTable(device, ipTable, 10);
    if_table['2']['6'] = strSplice(if_table['2']['6'].toString('hex'), 2, '-');
    const interTable = objBuffer2String(if_table);

    if (isObj(interTable)) {
      Object.keys(interTable).forEach(k => {
        const physModel = {
          device_id: device.device_id,
          physics_if_name: interTable[k]['2'],
          physics_if_type: INTER_TYPES[interTable[k]['3']],
          physics_if_mac: interTable[k]['6'] === '' ? null : interTable[k]['6'],
          physics_if_admin_status: interTable[k]['7'] === '' ? null : interTable[k]['7'],
          physics_if_ip_address: (
            Object.values(ip_table).find((v: any) => v['2'] === interTable[k]['1']) as any
          )['1'],
          physics_if_mask: (
            Object.values(ip_table).find((v: any) => v['2'] === interTable[k]['1']) as any
          )['3'],
        };
        physicsInterfaces.push(physModel);
      });
    }
    if (physicsInterfaces.length > 0) {
      const conn = await connect();
      console.log('inter_physics insert');
      await conn.query('delete from cool_physics_inter where device_id = ? ', [device.device_id]);
      physicsInterfaces.forEach(async item => {
        await conn.query('insert into cool_physics_inter set ?', [item]);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
