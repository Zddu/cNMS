import { DeviceType } from '../../../monitor/types';
import { connect } from '../../../database';
import { getCPU } from './cpu';

export default (async function linuxInfo() {
  const conn = await connect();
  const devices = (
    await conn.query('select * from cool_devices where type = ?', ['Linux'])
  )[0] as DeviceType[];
  // todo 获取硬件信息 Entity-MIB
  devices.forEach(device => {
    // 获取CPU信息
    getCPU(device);
  });

  // todo 获取内存数据

  // todo 获取disk数据

  // const entity = await snmpTable(device, '1.3.6.1.4.1.2021.10', 100);
  // Object.keys(entity).forEach(k => {
  //   Object.keys(entity[k]).forEach(v => {
  //     if (Buffer.isBuffer(entity[k][v])) {
  //       // console.log(entity[k][v][0]);
  //       // console.log(iconv.decode(Buffer.from(, 'binary'), 'utf8'));
  //       entity[k][v] = entity[k][v].toString();
  //     }
  //   });
  // });
  // console.log(entity);
})();
