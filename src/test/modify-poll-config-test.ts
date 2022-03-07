import { modifyConfigResetPoll } from '../monitor/discover/linux/poll';

export function modifyPollTest() {
  setTimeout(() => {
    modifyConfigResetPoll({
      device_id: '645dfcc0c1d54ede920fd569daebec68',
      ip: '81.70.253.123',
      community: 'public',
      port: 161,
      ssh_enabled: 0,
      snmpver: 'v2c',
      hostname: 'Zddv',
      sysName: 'Zddv',
      sysDescr: 'Linux Zddv 3.10.0-1160.11.1.el7.x86_64 #1 SMP Fri Dec 18 16:34:56 UTC 2020 x86_64',
      os: 'Linux',
      uptime: '149:27:96',
      last_polled: new Date(),
      type: 'host',
      sysContact: 'Root <root@localhost> (configure /etc/snmp/snmp.local.conf)',
      device_config:
        '{"discover":{"snmp_version":"v2c","snmp_community_list":["public"],"mode":{"arp":true,"ospf":false,"lldp":false,"ip_segment":[],"router":false}},"poll":{"enabled":true,"poll_item":{"cpu":{"enabled":false,"poll_cron":"*/1 * * * *"},"mem":{"enabled":true,"poll_cron":"*/1 * * * *"},"disk":{"enabled":true,"poll_cron":"* * * 15 * *"},"interface":{"enabled":true,"poll_cron":"*/5 * * * *"},"flow":{"enabled":true,"poll_cron":"*/1 * * * *"},"physics":{"enabled":false,"poll_corn":"* * 0 * * 0"}}},"ssh":{"username":null,"password":null},"telnet":{"username":null,"password":null}}',
    });
  }, 2000);
}
