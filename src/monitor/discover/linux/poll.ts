import { DeviceType } from './../../types';
const cron = require('node-cron');
import { connect } from '../../../database';
import defaultConfig from '../../../default.config';
import { functionMap } from './functionMap';
import { ConfigProps } from './typings';
import { Pool } from 'mysql2/promise';

let scheduleQueue: { [key: string]: any }[] = [];
const queryDevicesSQL = 'SELECT d.*, c.device_config FROM cool_devices AS d LEFT JOIN cool_device_config AS c ON d.device_id = c.device_id and d.os = "Linux"';
const resetQueryCorn = '10 * * * * *'; // todo 系统配置中提取

export async function pollLinux() {
  scheduleQueue.forEach(task => {
    Object.values(task)[0].stop();
  });
  const conn = await connect();
  const query = await conn.query(queryDevicesSQL);
  let deviceConfigs = query[0] as (DeviceType & ConfigProps)[];

  cron.schedule(resetQueryCorn, async () => {
    const devices = (await conn.query(queryDevicesSQL))[0] as (DeviceType & ConfigProps)[];
    if (devices.length !== deviceConfigs.length) {
      deviceConfigs = devices;
      scheduleQueue.forEach(task => {
        if (Object.values(task)[0]) {
          Object.values(task)[0].stop();
        }
      });
      scheduleQueue = [];
      console.log('clear scheduleQueue restart poll data');
      deviceConfigs.forEach(d => pollData(d, conn));
    }
  });

  deviceConfigs.forEach(d => pollData(d, conn));
}

function pollData(device: DeviceType & ConfigProps, conn: Pool) {
  try {
    const config = JSON.parse(device.device_config) as typeof defaultConfig;
    if (config.poll.enabled) {
      Object.keys(config.poll.poll_item).forEach(k => {
        if (config.poll.poll_item[k].enabled) {
          const cronTask = cron.schedule(config.poll.poll_item[k].poll_cron, async () => {
            console.log(`开始轮询${device.os}-${device.hostname}-${k}的数据-轮询周期${config.poll.poll_item[k].poll_cron}`);
            functionMap[k](device, conn);
          });
          scheduleQueue.push({ [device.device_id + k]: cronTask });
        }
      });
    }
  } catch (error) {
    console.log('json 解析error');
  }
}

export function modifyConfigResetPoll(deviceConfig: DeviceType & ConfigProps, conn: Pool) {
  scheduleQueue.splice(
    scheduleQueue.findIndex(task => {
      if (Object.keys(task)[0] === deviceConfig.device_id) {
        Object.values(task)[0].stop();
        return true;
      }
      return false;
    }),
    1
  );

  pollData(deviceConfig, conn);
}
