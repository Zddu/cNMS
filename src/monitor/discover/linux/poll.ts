const cron = require('node-cron');

cron.schedule('*/5 * * * *', () => {
  // 每5分钟运行一次
  console.log('running a task every two minutes');
});
