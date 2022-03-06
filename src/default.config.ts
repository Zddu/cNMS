export default {
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
      },
      physics: {
        enabled: false,
        poll_corn: '* * 0 * * 0', // 每周日 0时
      },
    },
  },
  os_list: ['Linux', 'Windows', 'Ruijie'],
  ssh: {
    username: null,
    password: null,
  },
  telnet: {
    username: null,
    password: null,
  },
};
