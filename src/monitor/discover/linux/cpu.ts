import { DeviceType } from './../../types';
import { snmpNext } from '../../../monitor/utils/snmp-utils';
import { CoolCpuRateProps } from './typings';
import { formatFloat } from '../../../common';
import { Pool } from 'mysql2/promise';
const oids = [
  '1.3.6.1.4.1.2021.11.50', // ssCpuRawUser
  '1.3.6.1.4.1.2021.11.51', // ssCpuRawNice
  '1.3.6.1.4.1.2021.11.52', // ssCpuRawSystem
  '1.3.6.1.4.1.2021.11.53', // ssCpuRawIdle
];

export function getCPU(device: DeviceType, conn: Pool) {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const cpu1 = await snmpNext(device, oids);
      const util1 = cpu1.map(v => v.value).reduce((prev, curr) => prev + Number(curr), 0);
      const idle1 = Number(cpu1[3].value);

      setTimeout(async () => {
        const cpu2 = await snmpNext(device, oids);
        const util2 = cpu2.map(v => v.value).reduce((prev, curr) => prev + Number(curr), 0);
        const idle2 = Number(cpu2[3].value);
        const ut = util2 - util1 !== 0 ? 100 - ((idle2 - idle1) * 100) / (util2 - util1) : await getCPU(device, conn);
        console.log(`${device.hostname} CPU利用率`, ut);
        if (typeof ut === 'number' && !isNaN(ut)) {
          const coolCpuRate: CoolCpuRateProps = {
            cpu_rate: formatFloat(ut, 2),
            last_polled: new Date(),
            device_id: device.device_id,
          };

          await conn.query('insert into cool_cpu_rate set ?', [coolCpuRate]);
          // conn.getConnection()
          // (await conn.getConnection()).release();
        }
        resolve(ut);
      }, 5000);
    } catch (error) {
      console.log('get cpu error', error);
      reject(error);
    }
  });
}
