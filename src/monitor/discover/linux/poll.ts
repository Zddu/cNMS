import { DeviceType } from './../../types';
const cron = require('node-cron');
import { connect } from '../../../database';
import defaultConfig from '../../../default.config';
import { functionMap } from './functionMap';

interface ConfigProps {
  device_config: string;
}
const scheduleQuene: any[] = [];
const queryDevicesSQL = 'SELECT d.*, c.device_config FROM cool_devices AS d LEFT JOIN cool_device_config AS c ON d.device_id = c.device_id';
const resetQueryCorn = '10 * * * * *'; // todo 系统配置中提取

export async function pollLinux() {
  scheduleQuene.forEach(s => s.destroy());
  const conn = await connect();
  const query = await conn.query(queryDevicesSQL);
  let deviceConfigs = query[0] as (DeviceType & ConfigProps)[];
  cron.schedule(resetQueryCorn, async () => {
    const devices = (await conn.query(queryDevicesSQL))[0] as (DeviceType & ConfigProps)[];
    if (devices.length !== deviceConfigs.length) {
      deviceConfigs = devices;
      while (scheduleQuene.length > 0) {
        const task = scheduleQuene.pop();
        task && task.stop();
      }
      console.log('claer scheduleQuene');
      console.log('restart poll data');
      deviceConfigs.forEach(d => pollData(d));
    }
  });

  deviceConfigs.forEach(d => pollData(d));
}

function pollData(device: DeviceType & ConfigProps) {
  try {
    const config: typeof defaultConfig = JSON.parse(device.device_config);
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
