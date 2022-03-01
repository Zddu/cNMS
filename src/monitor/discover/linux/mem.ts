import { DeviceType } from './../../types';
import { snmpNext } from '../../../monitor/utils/snmp-utils';
import { connect } from '../../../database';
import { formatFloat, isNumber } from '../../../common';

const memTotalReal = [
  '1.3.6.1.4.1.2021.4.5', // memTotalReal
  '1.3.6.1.4.1.2021.4.6', // memAvailable
  '1.3.6.1.4.1.2021.4.13', // memShared
  '1.3.6.1.4.1.2021.4.14', // memBuffer
  '1.3.6.1.4.1.2021.4.15', // memCached
];

export default async function getMem(device: DeviceType) {
  try {
    const hr_memory = await snmpNext(device, memTotalReal);
    let memUsage = 0;
    const cBS = hr_memory
      .map((v, i) => {
        if (i >= 2) {
          return v.value;
        }
      })
      .reduce((p, v) => p + Number(v), 0);
    if (cBS > Number(hr_memory[0].value)) {
      memUsage = ((Number(hr_memory[0].value) - Number(hr_memory[1].value) - Number(hr_memory[3].value) - Number(hr_memory[4].value) + Number(hr_memory[2].value)) * 100) / Number(hr_memory[0].value);
    } else {
      memUsage = ((Number(hr_memory[0].value) - Number(hr_memory[1].value) - Number(hr_memory[3].value) - Number(hr_memory[4].value)) * 100) / Number(hr_memory[0].value);
    }
    if (isNumber(memUsage)) {
      const memModel = {
        device_id: device.device_id,
        mem_usage: formatFloat(memUsage, 2),
        last_polled: new Date(),
      };
      const conn = await connect();
      await conn.query('insert into cool_mem_rate set ?', [memModel]);
    }
  } catch (error) {
    console.log(`${device.hostname} get mem error`);
  }
}
