import { DeviceType } from './../../types';
import { snmpTable } from '../../../monitor/utils/snmp-utils';
import { bytesToReadable, isObj, objBuffer2String } from '../../../common';
import { connect } from '../../../database';
import { CoolDiskProps } from './typings';
const hrStorageTable = '1.3.6.1.2.1.25.2.3'; // hrStorageTable

export default async function getDisk(device: DeviceType) {
  try {
    const hr_storage_table = await snmpTable(device, hrStorageTable, 100);
    const storageTable = objBuffer2String(hr_storage_table);
    const diskTable: CoolDiskProps[] = [];
    if (isObj(storageTable)) {
      Object.keys(storageTable).forEach(k => {
        if (isObj(storageTable[k])) {
          if (String(storageTable[k]['3']).includes('/')) {
            const size = bytesToReadable(
              Number(storageTable[k]['4']) * Number(storageTable[k]['5'])
            );
            const used = bytesToReadable(
              Number(storageTable[k]['4']) * Number(storageTable[k]['6'])
            );
            const diskModel: CoolDiskProps = {
              device_id: device.device_id,
              disk_path: storageTable[k]['3'],
              disk_size: size,
              disk_used: used,
              last_polled: new Date(),
            };
            diskTable.push(diskModel);
          }
        }
      });
    }
    if (diskTable.length > 0) {
      const conn = await connect();

      diskTable.forEach(async item => {
        const isExits = (
          await conn.query(
            'select disk_path from cool_disk where disk_path = ? and device_id = ?',
            [item.disk_path, item.device_id]
          )
        )[0][0];

        if (isExits) {
          console.log(`${device.hostname} disk update`);
          await conn.query(
            'update cool_disk set disk_path = ?, disk_size = ?, disk_used = ?, last_polled = ? where disk_path = ? and device_id = ?',
            [
              item.disk_path,
              item.disk_size,
              item.disk_used,
              item.last_polled,
              item.disk_path,
              item.device_id,
            ]
          );
        } else {
          // console.log(`${device.hostname} disk insert`);
          await conn.query('insert into cool_disk set ?', [item]);
        }
      });
    }
  } catch (error) {
    console.log('get disk error');
  }
}

export async function getDiskTable(device: DeviceType) {
  const hr_storage_table = await snmpTable(device, hrStorageTable, 100);
  const storageTable = objBuffer2String(hr_storage_table);
  let disk_total_size;
  if (isObj(storageTable)) {
    Object.keys(storageTable).forEach(k => {
      if (isObj(storageTable[k])) {
        if (String(storageTable[k]['3']).includes('/')) {
          const size = bytesToReadable(Number(storageTable[k]['4']) * Number(storageTable[k]['5']));
          if (String(storageTable[k]['3']) === '/') {
            disk_total_size = size;
          }
        }
      }
    });
  }
  return disk_total_size;
}
