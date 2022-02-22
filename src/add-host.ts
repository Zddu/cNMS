import GlobalError from './gloableError';
import ErrorCode from './consts';
import { connect } from './database';
import { DeviceType, VarbindsType } from './monitor/types';
import { snmpGet } from './monitor/utils/snmp-utils';
import { timeticksTohour, uuid } from './common';
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
  let host: any;
  try {
    // todo ping 主机是否连通

    // 不存在获取sysDescr，判断主机类型
    desc = await snmpGet(device, [
      '1.3.6.1.2.1.1.1.0', // sysDescr
      '1.3.6.1.2.1.1.3.0', // sysUptime
      '1.3.6.1.2.1.1.4.0', // sysContact
      '1.3.6.1.2.1.1.5.0', // sysName
    ]);
    host = {
      hostname: desc[3].value.toString(),
      device_id: uuid(),
      sysDescr: desc[0].value.toString(),
      sysContact: desc[2].value.toString(),
      sysName: desc[3].value.toString(),
      uptime: timeticksTohour(Number(desc[1].value.toString())),
      ...device,
    };
  } catch (error) {
    host = {
      ...device,
      timeout: 'snmp',
    };
  }

  try {
    const conn = await connect();
    conn.query('insert into cool_devices set ?', [host]);
  } catch (error) {
    console.log(error);
  }
};
