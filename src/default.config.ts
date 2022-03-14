export default {
  poll: {
    enabled: true,
    poll_item: {
      cpu: {
        enabled: true,
        poll_cron: '*/1 * * * *', // 1分钟
      },
      mem: {
        enabled: true,
        poll_cron: '*/1 * * * *', // 1分钟
      },
      disk: {
        enabled: true,
        poll_cron: '* * * 15 * *', // 每月15日
      },
      interface: {
        enabled: true,
        poll_cron: '*/5 * * * *', // 5分钟
      },
      flow: {
        enabled: true,
        poll_cron: '*/1 * * * *', // 1分钟
        unit: {
          value: 'KB',
          list: ['b', 'B', 'Kb', 'KB', 'Mb', 'MB', 'Gb', 'GB'], // 比特，字符，千比特，千字符，兆比特，兆字符，吉比特，吉字符
        },
        decimal: {
          value: 2,
        },
        average_time: {
          value: 60, // 单位秒
          time_list: [1, 3, 5], // 单位分钟
        },
      },
      physics: {
        enabled: false,
        poll_cron: '* * 0 * * 0', // 每周日 0时
      },
    },
  },
  ssh: {
    username: null,
    password: null,
  },
  telnet: {
    username: null,
    password: null,
  },
  device: {
    ip: '127.0.0.1',
    snmpver: 'v2c',
    port: '161',
    community: 'public',
  },
};
