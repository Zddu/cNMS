import { DeviceType } from '../../../monitor/types';
import { connect } from '../../../database';
import getProcess from './process';
import getInterface from './interface';
import getServices from './services';
import getApplication from './application';

export default async function linuxInfo() {
  const conn = await connect();
  const devices = (await conn.query('select * from cool_devices where os = ?', ['Linux']))[0] as DeviceType[];
  devices.forEach(device => {
    console.log('device', device);
    // getProcess(device);
    // getInterface(device);
    // getServices(device);
    getApplication(device);
  });
}
