import GlobalError from './gloableError';
import ErrorCode from './consts';
import { connect } from './database';
import { DeviceType, VarbindsType } from './monitor/types';
import { snmpNext } from './monitor/utils/snmp-utils';
import { timeticksTohour, uuid } from './common';
import defaultConfig from './default.config';

export const addHost = async (device: DeviceType) => {
  let isExist;
  try {
    const conn = await connect();
    isExist = await conn.query('select device_id from cool_devices where ip = ?', [device.ip]);
  } catch (error) {
    // console.log(error);
  }
  if (isExist[0].length > 0) {
    throw new GlobalError(ErrorCode.EXIST, '该主机已存在');
  }
  let desc: VarbindsType[] = [];
  let host: DeviceType;
  try {
    // todo ping 主机是否连通

    // 不存在，获取sysDescr，判断主机类型
    desc = await snmpNext(device, [
      '1.3.6.1.2.1.1.1', // sysDescr
      '1.3.6.1.2.1.1.3', // sysUptime
      '1.3.6.1.2.1.1.4', // sysContact
      '1.3.6.1.2.1.1.5', // sysName
      '1.3.6.1.2.1.4.1', // ipForwarding 是否具有转发功能
      '1.3.6.1.2.1.25.1.6', //  hostResourcesMibModule 用于判断是否为主机
    ]);
    // dot1dTpFdbEntry mac地址转发表
    const dot1dTpFdbEntry = await snmpNext(device, ['1.3.6.1.2.1.17.4.3.1.1']);

    let type: string = 'other';
    if (desc[5].oid.includes('1.3.6.1.2.1.25')) {
      type = 'host';
    } else if (desc[4].oid.includes('1.3.6.1.2.1.4.1') && Number(desc[4].value) !== 1 && dot1dTpFdbEntry[0].oid.includes('1.3.6.1.2.1.17.4.3')) {
      type = 'general switch'; // 二层交换机
    } else if (desc[4].oid.includes('1.3.6.1.2.1.4.1') && Number(desc[4].value) === 1 && dot1dTpFdbEntry[0].oid.includes('1.3.6.1.2.1.17.4.3')) {
      type = 'multifunctional switch'; // 三层交换机
    } else if (desc[4].oid.includes('1.3.6.1.2.1.4.1') && Number(desc[4].value) === 1 && !dot1dTpFdbEntry[0].oid.includes('1.3.6.1.2.1.17.4.3')) {
      type = 'router'; // 路由器
    }
    host = {
      ...device,
      device_id: uuid(),
      hostname: desc[3].value.toString(),
      sysDescr: desc[0].value.toString(),
      sysContact: desc[2].value.toString(),
      sysName: desc[3].value.toString(),
      uptime: timeticksTohour(Number(desc[1].value.toString())),
      os: defaultConfig.supplier_name_list.find(v => desc[0].value.toString().includes(v)), // todo 新增设备类型
      type: type,
    };
  } catch (error) {
    host = {
      ...device,
    };
  }

  try {
    console.log(`${device.hostname}`, host);
    const conn = await connect();
    conn.query('insert into cool_devices set ?', [host]);
  } catch (error) {
    console.log(error);
  }
};
