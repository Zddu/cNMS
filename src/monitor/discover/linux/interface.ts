import { INTER_TYPES } from './typings';
import { DeviceType } from './../../types';
import { snmpTable, snmpTableColumns } from '../../../monitor/utils/snmp-utils';
import { isObj, objBuffer2String, strSplice } from '../../../common';
import { Pool } from 'mysql2/promise';
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
  '1.3.6.1.2.1.2.2.1.8', // ifOperStatus
];

export interface PhysicsInterfaceProps {
  device_id?: string;
  physics_if_name?: string;
  physics_if_speed?: string;
  physics_if_type?: string;
  physics_if_mac?: string;
  physics_if_admin_status?: string;
  physics_if_operation_status?: string;
  physics_if_ip_address?: string;
  physics_if_ip_mask?: string;
  last_polled: Date;
}

export default async function getInterface(device: DeviceType, conn?: Pool) {
  try {
    const physicsInterfaces: PhysicsInterfaceProps[] = [];
    const if_table = await snmpTableColumns(device, ifTable, [1, 2, 3, 4, 5, 6, 7, 8], 1000);
    const ip_table = await snmpTable(device, ipTable, 10);
    const interTable = objBuffer2String(if_table, ['6']);

    if (isObj(interTable)) {
      Object.keys(interTable).forEach(k => {
        if (Object.values(ip_table).find((v: any) => v['2'] === interTable[k]['1'])) {
          const physModel: PhysicsInterfaceProps = {
            device_id: device.device_id,
            physics_if_name: interTable[k]['2'],
            physics_if_speed: String(interTable[k]['5']),
            physics_if_type: INTER_TYPES[interTable[k]['3']],
            physics_if_mac: interTable[k]['6'] === '' ? undefined : strSplice(interTable[k]['6'].toString('hex'), 2, '-'),
            physics_if_admin_status: interTable[k]['7'] === '' ? undefined : interTable[k]['7'],
            physics_if_operation_status: interTable[k]['8'] === '' ? undefined : interTable[k]['8'],
            physics_if_ip_address: (Object.values(ip_table).find((v: any) => v['2'] === interTable[k]['1']) as any)['1'],
            physics_if_ip_mask: (Object.values(ip_table).find((v: any) => v['2'] === interTable[k]['1']) as any)['3'],
            last_polled: new Date(),
          };
          physicsInterfaces.push(physModel);
        }
      });
    }
    console.log(`${device.hostname} 接口信息`, physicsInterfaces);

    if (conn && physicsInterfaces.length > 0) {
      await conn.query('delete from cool_physics_inter where device_id = ? ', [device.device_id]);

      for (let i = 0; i < physicsInterfaces.length; i++) {
        await conn.query('insert into cool_physics_inter set ?', [physicsInterfaces[i]]);
      }
    }
    return physicsInterfaces;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
