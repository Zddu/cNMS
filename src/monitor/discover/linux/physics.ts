import { DeviceType } from '../../types';
import { bytesToReadable, isNumber, isObj, objBuffer2String } from '../../../common';
import { snmpNext, snmpTable } from '../../utils/snmp-utils';
import { connect } from '../../../database';
import { getDiskTable } from './disk';

const hrDeviceTable = '1.3.6.1.2.1.25.3.2'; // hrDeviceTable
const memTotalReal = [
  '1.3.6.1.4.1.2021.4.5', // memTotalReal
];
const ifNumber = ['1.3.6.1.2.1.2.1'];
export async function getPhysics(device: DeviceType) {
  const physicsModel: any = {
    device_id: device.device_id,
    cpu_number: 0,
    inter_number: 0,
    last_polled: new Date(),
  };
  let interModel = '';
  try {
    const hr_device_table = await snmpTable(device, hrDeviceTable, 100);
    const hr_memory = await snmpNext(device, memTotalReal);
    const if_number = await snmpNext(device, ifNumber);
    console.log('if_number', if_number);
    const disk_total_size = await getDiskTable(device);
    const deviceTable = objBuffer2String(hr_device_table);
    if (isNumber(Number(hr_memory[0].value))) {
      physicsModel.mem_total_size = bytesToReadable(Number(hr_memory[0].value) * 1024, 1);
    }

    if (disk_total_size) {
      physicsModel.disk_total_size = disk_total_size;
    }
    if (isObj(if_number[0])) {
      physicsModel.inter_number = if_number[0].value;
    }

    Object.keys(deviceTable).forEach(k => {
      if (isObj(deviceTable[k])) {
        if (String(deviceTable[k]['3']).includes('CPU')) {
          physicsModel.cpu_number++;
          physicsModel.cpu_model = deviceTable[k]['3'];
        } else if (String(deviceTable[k]['3']).includes('interface')) {
          interModel += String(deviceTable[k]['3']).replace(/\s/g, '').split('interface')[1] + '，';
        }
      }
    });

    physicsModel.inter_model = interModel;
    console.log(`${device.hostname} physicsModel`, physicsModel);
    const conn = await connect();
    await conn.query('delete from cool_physics where device_id = ?', [device.device_id]);
    await conn.query('insert into cool_physics set ?', [physicsModel]);
  } catch (error) {
    console.log(`${device.hostname} get physics error`, error);
  }
}
