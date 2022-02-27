import { DeviceType } from './../../types';
import { bytesToReadable, isNumber, isObj, objBuffer2String } from '../../../common';
import { snmpNext, snmpTable } from '../../../monitor/utils/snmp-utils';
import { CoolDiskProps } from './typings';
import { connect } from '../../../database';

const hrDeviceTable = '1.3.6.1.2.1.25.3.2'; // hrDeviceTable
const hrStorageTable = '1.3.6.1.2.1.25.2.3'; // hrStorageTable
const diskOids = [
  '1.3.6.1.4.1.2021.9.1.1', // dskIndex
  '1.3.6.1.4.1.2021.9.1.2', // dskPath
  '1.3.6.1.4.1.2021.9.1.6', // dskTotal
  '1.3.6.1.4.1.2021.9.1.7', // dskAvail
];
const dskDevice = ['1.3.6.1.4.1.2021.9.1.6'];
const memTotalReal = [
  '1.3.6.1.4.1.2021.4.5', // memTotalReal
];

export async function getPhysisc(device: DeviceType) {
  const physiscModel: any = {
    device_id: device.device_id,
    cpu_number: 0,
    inter_number: 0,
    last_polled: new Date(),
  };
  let interModel = '';
  const hr_device_table = await snmpTable(device, hrDeviceTable, 100);
  const hr_storage_table = await snmpTable(device, hrStorageTable, 100);
  const hr_memory = await snmpNext(device, memTotalReal);
  const storageTable = objBuffer2String(hr_storage_table);
  const deviceTable = objBuffer2String(hr_device_table);

  const diskTable: CoolDiskProps[] = [];
  if (isObj(storageTable)) {
    Object.keys(storageTable).forEach(k => {
      if (isObj(storageTable[k])) {
        if (String(storageTable[k]['3']).includes('/')) {
          const size = bytesToReadable(Number(storageTable[k]['4']) * Number(storageTable[k]['5']));
          const used = bytesToReadable(Number(storageTable[k]['4']) * Number(storageTable[k]['6']));
          if (String(storageTable[k]['3']) === '/') {
            physiscModel.disk_total_size = size;
          }
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
      await conn.query('insert into cool_disk set ?', [item]);
    });
  }

  if (isNumber(Number(hr_memory[0].value))) {
    physiscModel.mem_total_size = bytesToReadable(Number(hr_memory[0].value) * 1024, 1);
  }

  Object.keys(deviceTable).forEach(k => {
    if (isObj(deviceTable[k])) {
      if (String(deviceTable[k]['3']).includes('CPU')) {
        physiscModel.cpu_number++;
        physiscModel.cpu_model = deviceTable[k]['3'];
      } else if (String(deviceTable[k]['3']).includes('interface')) {
        interModel += String(deviceTable[k]['3']).replace(/\s/g, '').split('interface')[1] + '，';
        physiscModel.inter_number++;
      }
    }
  });
  physiscModel.inter_model = interModel;
  console.log(diskTable);
  // const conn = await connect();
  // await conn.query('insert into cool_physics set ?', [physiscModel]);
}
