import { Pool } from 'mysql2/promise';
import { DeviceType } from './../../types';
const cron = require('node-cron');
import { connect } from '../../../database';
import defaultConfig from '../../../default.config';
import { functionMap } from './functionMap';

interface ConfigProps {
  id: number;
  device_id: string;
  device_config: string;
}
const scheduleQuene: any[] = [];
const queryDevicesSQL = 'SELECT * FROM cool_devices';
const queryDeviceConfigSQL = 'SELECT * FROM cool_device_config where device_id = ?';
const resetQueryCorn = '10 * * * * *'; // todo 系统配置中提取

export async function pollLinux() {
  scheduleQuene.forEach(s => s.destroy());
  const conn = await connect();
  const query = await conn.query(queryDevicesSQL);
  let deviceConfigs = query[0] as DeviceType[];

  cron.schedule(resetQueryCorn, async () => {
    const devices = (await conn.query(queryDevicesSQL))[0] as DeviceType[];
    if (devices.length !== deviceConfigs.length) {
      deviceConfigs = devices;
      while (scheduleQuene.length > 0) {
        const task = scheduleQuene.pop();
        task && task.stop();
      }
      console.log('claer scheduleQuene');
      console.log('restart poll data');
      deviceConfigs.forEach(d => pollData(d, conn));
    }
  });

  deviceConfigs.forEach(d => pollData(d, conn));
}

async function pollData(device: DeviceType, conn: Pool) {
  try {
    const deviceConfig = (await conn.query(queryDeviceConfigSQL, [device.device_id]))[0] as ConfigProps[];
    const config: typeof defaultConfig = JSON.parse(deviceConfig[0].device_config);
    if (config.os_list.includes(device.os || '')) {
      Object.keys(config.poll).forEach(k => {
        if (config.poll[k].enabled) {
          const cronTask = cron.schedule(config.poll[k].poll_cron, async () => {
            console.log(`开始轮询${device.os}-${device.hostname}-${k}的数据-轮询周期${config.poll[k].poll_cron}`);
            functionMap[k](device);
          });
          scheduleQuene.push(cronTask);
        }
      });
    }
  } catch (error) {
    console.log('json 解析error');
  }
}
