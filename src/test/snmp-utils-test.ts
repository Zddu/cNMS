import { createMib, getMibModule } from '../monitor/utils/snmp-utils';
const cron = require('node-cron');
// import { addHost } from '../add-host';
import '../monitor/discover/linux';

export const jRun = async () => {
  // snmpGetByName('sysDescr');
  // addHost({ ip: '47.94.238.68', port: 161, community: 'public' });
  // createMib('UCD-DEMO-MIB');
  cron.schedule('*/2 * * * *', () => {
    // 每两分钟运行一次
    console.log('running a task every two minutes');
  });
};
