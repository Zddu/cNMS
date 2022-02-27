const cron = require('node-cron');
import poll from './index';

export function pollLinux() {
  cron.schedule('*/1 * * * *', async () => {
    // 每5分钟运行一次
    console.log('开始轮询Linux数据');
    await poll();
  });
}
