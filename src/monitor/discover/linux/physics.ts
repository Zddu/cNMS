import { DeviceType } from '../../types';
import { bytesToReadable, isNumber, isObj, objBuffer2String } from '../../../common';
import { snmpNext, snmpTable } from '../../utils/snmp-utils';
import { connect } from '../../../database';
import { getDiskTable } from './disk';

const hrDeviceTable = '1.3.6.1.2.1.25.3.2'; // hrDeviceTable
const memTotalReal = [
  '1.3.6.1.4.1.2021.4.5', // memTotalReal
];

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
    const disk_total_size = await getDiskTable(device);
    const deviceTable = objBuffer2String(hr_device_table);
    if (isNumber(Number(hr_memory[0].value))) {
      physicsModel.mem_total_size = bytesToReadable(Number(hr_memory[0].value) * 1024, 1);
    }

    if (disk_total_size) {
      physicsModel.disk_total_size = disk_total_size;
    }

    Object.keys(deviceTable).forEach(k => {
      if (isObj(deviceTable[k])) {
        if (String(deviceTable[k]['3']).includes('CPU')) {
          physicsModel.cpu_number++;
          physicsModel.cpu_model = deviceTable[k]['3'];
        } else if (String(deviceTable[k]['3']).includes('interface')) {
          interModel += String(deviceTable[k]['3']).replace(/\s/g, '').split('interface')[1] + '，';
          physicsModel.inter_number++;
        }
      }
    });
    physicsModel.inter_model = interModel;
    const conn = await connect();
    const deviceId = (
      await conn.query('select device_id from cool_physics where device_id = ?', [device.device_id])
    )[0][0];
    if (deviceId.device_id) {
      console.log('physics update');
      await conn.query('update cool_physics set ?', [physicsModel]);
    } else {
      console.log('physics insert');
      await conn.query('insert into cool_physics set ?', [physicsModel]);
    }
  } catch (error) {
    console.log('get physics error');
  }
}
