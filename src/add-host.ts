const md5 = require('md5');
import GlobalError from './gloableError';
import ErrorCode from './consts';
import { connect } from './database';
import { DeviceType } from './monitor/types';
import { snmpNext } from './monitor/utils/snmp-utils';
import { objBuffer2String, timeticksTohour } from './common';
import systemConfig from './system.config';
import defaultConfig from './default.config';

const deviceBaseTable = [
  '1.3.6.1.2.1.1.1', // sysDescr
  '1.3.6.1.2.1.1.3', // sysUptime
  '1.3.6.1.2.1.1.4', // sysContact
  '1.3.6.1.2.1.1.5', // sysName
  '1.3.6.1.2.1.4.1', // ipForwarding 是否具有转发功能
  '1.3.6.1.2.1.25.1.6', //  hostResourcesMibModule 用于判断是否为主机
];
const dot1dTpFdbEntryItem = ['1.3.6.1.2.1.17.4.3.1.1'];

export const addHost = async (device: DeviceType, deviceConfig?: string) => {
  let isExist;
  let host: DeviceType;

  try {
    const conn = await connect();
    isExist = await conn.query('select device_id from cool_devices where ip = ?', [device.ip]);
  } catch (error) {
    // console.log(error);
  }
  if (isExist[0].length > 0) {
    throw new GlobalError(ErrorCode.EXIST, '该主机已存在');
  }
  try {
    // 不存在，获取sysDescr，判断主机类型
    const desc = await snmpNext(device, deviceBaseTable);
    const strDesc = objBuffer2String(desc);
    // dot1dTpFdbEntry mac地址转发表
    const dot1dTpFdbEntry = await snmpNext(device, dot1dTpFdbEntryItem);

    let type: string = 'other';
    if (strDesc[5].oid.includes('1.3.6.1.2.1.25')) {
      type = 'host';
    } else if (strDesc[4].oid.includes('1.3.6.1.2.1.4.1') && Number(strDesc[4].value) !== 1 && dot1dTpFdbEntry[0].oid.includes('1.3.6.1.2.1.17.4.3')) {
      type = 'general switch'; // 二层交换机
    } else if (strDesc[4].oid.includes('1.3.6.1.2.1.4.1') && Number(strDesc[4].value) === 1 && dot1dTpFdbEntry[0].oid.includes('1.3.6.1.2.1.17.4.3')) {
      type = 'multifunctional switch'; // 三层交换机
    } else if (strDesc[4].oid.includes('1.3.6.1.2.1.4.1') && Number(strDesc[4].value) === 1 && !dot1dTpFdbEntry[0].oid.includes('1.3.6.1.2.1.17.4.3')) {
      type = 'router'; // 路由器
    }
    host = {
      ...device,
      device_id: md5(strDesc[3].value + device.ip),
      hostname: strDesc[3].value,
      sysDescr: strDesc[0].value,
      sysContact: strDesc[2].value,
      sysName: strDesc[3].value,
      uptime: timeticksTohour(Number(strDesc[1].value)),
      os: systemConfig.os_list.find(v => strDesc[0].value.includes(v)), // todo 新增设备类型
      type: type,
    };
    console.log('host', host);
  } catch (error) {
    host = {
      ...device,
    };
  }
  let device_config = deviceConfig;
  if (!deviceConfig) {
    device_config = JSON.stringify(defaultConfig);
    console.log(device_config);
  }

  const config = {
    device_id: host.device_id,
    device_config,
    last_polled: new Date(),
  };

  try {
    console.log(`${host.hostname}`, host);
    const conn = await connect();
    const devices = (await conn.query('select device_id from cool_device_config where device_id = ?', [host.device_id]))[0] as DeviceType[];

    if (devices.length > 0) {
      conn.query('update cool_device_config set device_config = ?, last_polled  = ? where device_id = ?', [config.device_config, config.last_polled, config.device_id]);
    } else {
      conn.query('insert into cool_device_config set ?', [config]);
    }

    conn.query('insert into cool_devices set ?', [host]);
  } catch (error) {
    console.log(error);
  }
};
