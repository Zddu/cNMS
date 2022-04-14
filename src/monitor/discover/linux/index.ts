import { DeviceType } from '../../../monitor/types';
import { connect } from '../../../database';
import getProcess from './process';
import getInterface from './interface';
import getServices from './services';
import getApplication from './application';
import getNetworkFlow from './network-flow';

export default async function linuxInfo() {
  const conn = await connect();
  const devices = (await conn.query('select * from cool_devices where os = ?', ['Linux']))[0] as DeviceType[];
  await getNetworkFlow(
    {
      device_id: '27e88b651bbb9821bdb25161900e360a',
      ip: '82.157.237.245',
      community: 'public',
      port: 161,
      ssh_enabled: 0,
      snmpver: 'v2c',
      hostname: 'VM-16-15-centos',
      sysName: 'VM-16-15-centos',
      sysDescr: 'Linux VM-16-15-centos 3.10.0-1160.45.1.el7.x86_64 #1 SMP Wed Oct 13 17:20:51 UTC 2021 x86_64',
      os: 'Linux',
      uptime: '296:52:69',
      last_polled: new Date(),
      type: 'host',
      sysContact: 'Root <root@localhost> (configure /etc/snmp/snmp.local.conf)',
    },
    conn
  );
  // devices.forEach(async device => {
  //   console.log('device', device);
  //   // getProcess(device);
  //   // getInterface(device);
  //   // getServices(device);
  //   // getApplication(device);

  // });
}
