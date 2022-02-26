import { objBuffer2String } from '../../../common';
import { snmpGet, snmpNext, snmpTable } from '../../../monitor/utils/snmp-utils';

const hrDeviceTable = '1.3.6.1.2.1.25.3.2'; // hrDeviceTable

export async function getPhysisc(device) {
  const hr_device_table = await snmpTable(device, hrDeviceTable, 100);

  console.log(objBuffer2String(hr_device_table));
}
