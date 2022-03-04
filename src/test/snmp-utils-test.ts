import { uuid } from '../common';
import { addHost } from '../add-host';
import linuxInfo from '../monitor/discover/linux';
// import { pollLinux } from '../monitor/discover/linux/poll';

export const jRun = async () => {
  addHost({
    ip: '81.70.253.123',
    port: 161,
    community: 'public',
    snmpver: 'v2c',
    last_polled: new Date(),
  });
  // linuxInfo();
};
