import { snmpGet, snmpNext } from '../../../monitor/utils/snmp-utils';
const oids = [
  '1.3.6.1.4.1.2021.11.50', // ssCpuRawUser
  '1.3.6.1.4.1.2021.11.51', // ssCpuRawNice
  '1.3.6.1.4.1.2021.11.52', // ssCpuRawSystem
  '1.3.6.1.4.1.2021.11.53', // ssCpuRawIdle
];

const processOid = ['1.3.6.1.2.1.25.3.3.1.2']; // hrProcessorLoad

export async function getCPU(device) {
  const cpu1 = await snmpNext(device, oids);
  const process = await snmpGet(device, processOid);
  const util1 = cpu1.map(v => v.value).reduce((prev, curr) => prev + Number(curr), 0);
  const idle1 = Number(cpu1[3].value);

  console.log(cpu1[4]);

  setTimeout(async () => {
    const cpu2 = await snmpNext(device, oids);
    const util2 = cpu2.map(v => v.value).reduce((prev, curr) => prev + Number(curr), 0);
    const idle2 = Number(cpu2[3].value);
    const ut = 100 - ((idle2 - idle1) * 100) / (util2 - util1);
    console.log(Math.round(ut));
  }, 3000);
}
