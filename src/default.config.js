module.exports = {
  discover: {
    snmp_version: 'v2c',
    snmp_community_list: ['public'],
    mode: {
      arp: true,
      ospf: false,
      lldp: false,
      ip_segment: [],
      router: false,
    },
  },
  poll: {
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
      poll_cron: '*/5 * * * *', // 5分钟
    },
    interface: {
      enabled: true,
      poll_cron: '*/5 * * * *', // 5分钟
    },
    flow: {
      enabled: true,
      poll_cron: '*/1 * * * *', // 1分钟
    },
  },
};
