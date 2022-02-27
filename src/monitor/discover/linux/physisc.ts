import { DeviceType } from './../../types';
import { isNumber, isObj, objBuffer2String } from '../../../common';
import { snmpGet, snmpNext, snmpTable } from '../../../monitor/utils/snmp-utils';

const hrDeviceTable = '1.3.6.1.2.1.25.3.2'; // hrDeviceTable
const hrStorageTable = '1.3.6.1.2.1.25.2.3'; // hrStorageTable
const memTotalReal = [
  '1.3.6.1.4.1.2021.4.5', // memTotalReal
  '1.3.6.1.4.1.2021.4.6', // memAvailable
  '1.3.6.1.4.1.2021.4.13', // memShared
  '1.3.6.1.4.1.2021.4.14', // memBuffer
  '1.3.6.1.4.1.2021.4.15', // memCached
];

export async function getPhysisc(device: DeviceType) {
  const physiscModel = {
    device_id: device.device_id,
    cpu_model: '',
    cpu_number: 0,
    inter_model: '',
    inter_number: 0,
    disk_model: '',
    disk_number: 0,
    mem_used_size: 0,
    mem_total_size: 0,
    last_polled: new Date(),
  };
  let interModel = '';
  const hr_device_table = await snmpTable(device, hrDeviceTable, 100);
  const hr_storage_table = await snmpTable(device, hrStorageTable, 100);
  const hr_memory = await snmpNext(device, memTotalReal);
  const deviceTable = objBuffer2String(hr_device_table);
  let memUsage = 0;
  const cBS = hr_memory
    .map((v, i) => {
      if (i >= 2) {
        return v.value;
      }
    })
    .reduce((p, v) => p + Number(v), 0);
  if (cBS > Number(hr_memory[0].value)) {
    memUsage =
      ((Number(hr_memory[0].value) -
        Number(hr_memory[1].value) -
        Number(hr_memory[3].value) -
        Number(hr_memory[4].value) +
        Number(hr_memory[2].value)) *
        100) /
      Number(hr_memory[0].value);
  } else {
    memUsage =
      ((Number(hr_memory[0].value) -
        Number(hr_memory[1].value) -
        Number(hr_memory[3].value) -
        Number(hr_memory[4].value)) *
        100) /
      Number(hr_memory[0].value);
  }
  if (isNumber(memUsage)) {
    physiscModel.mem_used_size = memUsage;
  }
  if (isNumber(Number(hr_memory[0].value))) {
    physiscModel.mem_total_size = Number(hr_memory[0].value);
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
  console.log(physiscModel);
}
