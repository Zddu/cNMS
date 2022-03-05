import { DeviceType } from './../../types';
const cron = require('node-cron');
import { connect } from '../../../database';
import defaultConfig from '../../../default.config';
import { functionMap } from './functionMap';

interface ConfigProps {
  device_config: string;
}

export async function pollLinux() {
  const conn = await connect();
  const query = await conn.query('SELECT d.*, c.device_config FROM cool_devices AS d LEFT JOIN cool_device_config AS c ON d.device_id = c.device_id');
  const deviceConfigs = query[0] as (DeviceType & ConfigProps)[];
  deviceConfigs.forEach(d => {
    try {
      const config: typeof defaultConfig = JSON.parse(d.device_config);
      console.log('config', config);
      if (config.os_list.includes(d.os || '')) {
        Object.keys(config.poll).forEach(k => {
          if (config.poll[k].enabled) {
            cron.schedule(config.poll[k].poll_cron, async () => {
              console.log(`开始轮询${d.os}-${d.hostname}-${k}的数据-轮询周期${config.poll[k].poll_cron}`);
              functionMap[k](d);
            });
          }
        });
      }
    } catch (error) {
      console.log('json 解析error');
    }
  });
}
