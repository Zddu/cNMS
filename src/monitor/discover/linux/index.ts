import { DeviceType } from '../../../monitor/types';
import { snmpGet, snmpTable } from '../../../monitor/utils/snmp-utils';
import { connect } from '../../../database';
const iconv = require('iconv-lite');

export default (async function linuxInfo() {
  const conn = await connect();
  const device: DeviceType = (await conn.query('select * from cool_devices'))[0][0];
  console.log(device);
  // todo 获取硬件信息 Entity-MIB

  // 获取CPU信息
  // const entity = await snmpGet(device, ['1.3.6.1.4.1.2021.10.1.2.1']);
  const entity = await snmpTable(device, '1.3.6.1.4.1.2021.10', 100);
  Object.keys(entity).forEach(k => {
    Object.keys(entity[k]).forEach(v => {
      if (Buffer.isBuffer(entity[k][v])) {
        // console.log(entity[k][v][0]);
        console.log(iconv.decode(Buffer.from(entity[k][v], 'binary'), 'utf8'));
      } else {
        // console.log(entity[k][v]);
      }
    });
  });
})();
