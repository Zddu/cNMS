import { DeviceType } from './../../types';
import { snmpNext } from '../../../monitor/utils/snmp-utils';
import { connect } from '../../../database';
import { CoolCpuRateProps } from './typings';
const oids = [
  '1.3.6.1.4.1.2021.11.50', // ssCpuRawUser
  '1.3.6.1.4.1.2021.11.51', // ssCpuRawNice
  '1.3.6.1.4.1.2021.11.52', // ssCpuRawSystem
  '1.3.6.1.4.1.2021.11.53', // ssCpuRawIdle
];

export async function getCPU(device: DeviceType) {
  console.log(device);
  const cpu1 = await snmpNext(device, oids);
  const util1 = cpu1.map(v => v.value).reduce((prev, curr) => prev + Number(curr), 0);
  const idle1 = Number(cpu1[3].value);

  setTimeout(async () => {
    const cpu2 = await snmpNext(device, oids);
    const util2 = cpu2.map(v => v.value).reduce((prev, curr) => prev + Number(curr), 0);
    const idle2 = Number(cpu2[3].value);
    const ut = 100 - ((Number(idle2) - Number(idle1)) * 100) / (Number(util2) - Number(util1));
    console.log(Math.round(ut));
    if (typeof ut === 'number' && !isNaN(ut)) {
      const coolCpuRate: CoolCpuRateProps = {
        cpu_rate: ut,
        last_polled: new Date(),
        device_id: device.device_id,
      };

      const conn = await connect();
      await conn.query('insert into cool_cpu_rate set ?', [coolCpuRate]);
    }
  }, 3000);
}
