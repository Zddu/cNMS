import { createMib, getMibModule } from '../monitor/utils/snmp-utils';
// import { addHost } from '../add-host';
import '../monitor/discover/linux';

export const jRun = async () => {
  // snmpGetByName('sysDescr');
  // addHost({ ip: '47.94.238.68', port: 161, community: 'public' });
  // createMib('UCD-DEMO-MIB');
  console.log(getMibModule('UCD-SNMP-MIB')['laLoadFloat']);
};
