import { DeviceType, VarbindsType } from '../../../monitor/types';
import { snmpGet, snmpNext, snmpTable } from '../../../monitor/utils/snmp-utils';
import { connect } from '../../../database';
import { getCPU } from './cpu';

export default (async function linuxInfo() {
  const conn = await connect();
  const device: DeviceType = (await conn.query('select * from cool_devices'))[0][0];
  // todo 获取硬件信息 Entity-MIB

  // 获取CPU信息
  getCPU(device);
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
