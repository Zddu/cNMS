import { addHost } from '../add-host';
import { pollLinux } from '../monitor/discover/linux/poll';

export const jRun = async () => {
  addHost({
    ip: '82.157.237.245',
    port: 161,
    community: 'public',
    snmpver: 'v2c',
    last_polled: new Date(),
  });
  pollLinux();
};
