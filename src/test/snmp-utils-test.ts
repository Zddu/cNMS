import * as fs from 'fs/promises';
import { DeviceType } from '../monitor/types';
const { readMibFile } = require('../monitor/utils/mib-parser/mib_reader');

const fileNameArr = [
  'SNMPv2-TM',
  'SNMPv2-TC-v1',
  'SNMPv2-TC',
  'SNMPv2-SMI-v1',
  'SNMPv2-SMI',
  'SNMPv2-MIB',
  'SNMPv2-CONF',
  'SNMP-FRAMEWORK-MIB',
  'SNMP-VIEW-BASED-ACM-MIB',
  'SNMP-USER-BASED-SM-MIB',
  'SNMP-USM-DH-OBJECTS-MIB',
  'SNMP-USM-AES-MIB',
  'SNMP-TARGET-MIB',
  'RFC1155-SMI',
  'RFC-1212',
  'RFC-1215',
  'RFC1213-MIB',
  'SNMP-REPEATER-MIB',
  'SNMP-PROXY-MIB',
  'SNMP-NOTIFICATION-MIB',
  'SNMP-MPD-MIB',
  'SNMP-COMMUNITY-MIB',
  'IF-MIB',
  'SNA-SDLC-MIB',
  'INET-ADDRESS-MIB',
  'RMON-MIB',
  'RMON2-MIB',
  'SMON-MIB',
  'SML-MIB',
  'BRIDGE-MIB',
  'P-BRIDGE-MIB',
  'NET-SNMP-MIB',
  'NET-SNMP-TC',
  'NET-SNMP-EXTEND-MIB',
  'NET-SNMP-EXAMPLES-MIB',
  'NET-SNMP-VACM-MIB',
  'NET-SNMP-PASS-MIB',
  'NET-SNMP-AGENT-MIB',
  'MTA-MIB',
  'LLDP-V2-TC-MIB',
  'IANA-ADDRESS-FAMILY-NUMBERS-MIB',
  'LLDP-V2-MIB',
  'LLDP-MIB',
  'LLDP-EXT-MED-MIB',
  'LLDP-EXT-DOT3-MIB',
  'LLDP-EXT-DOT1-MIB',
  'LLDP-EXT-DCBX-MIB',
  'ITU-ALARM-TC-MIB',
  'DIFFSERV-DSCP-TC',
  'INTEGRATED-SERVICES-MIB',
  'DIFFSERV-MIB',
  'IANAifType-MIB',
  'ISDN-MIB',
  'IPV6-TC',
  'IPV6-UDP-MIB',
  'IPV6-TCP-MIB',
  'IPV6-MLD-MIB',
  'IPV6-MIB',
  'IPV6-ICMP-MIB',
  'IPV6-FLOW-LABEL-MIB',
  'IANA-RTPROTO-MIB',
  'IPMROUTE-STD-MIB',
  'IPMROUTE-MIB',
  'IP-MIB',
  'IP-FORWARD-MIB',
  'INT-SERV-MIB',
  'IGMP-STD-MIB',
  'IGMP-MIB',
  'ISIS-MIB',
  'Q-BRIDGE-MIB',
  'IEEE8021-CFMD8-MIB',
  'IEEE802dot11-MIB',
  'IEEE8023-LAG-MIB',
  'IEEE802171-CFM-MIB',
  'IEEE8021-TC-MIB',
  'IEEE8021-SECY-MIB',
  'IEEE8021-BRIDGE-MIB',
  'IEEE8021-Q-BRIDGE-MIB',
  'IEEE8021-PAE-MIB',
  'IEEE8021-CFM-MIB',
  'HC-PerfHist-TC-MIB',
  'IEEE-802DOT17-RPR-MIB',
  'IANA-PWE3-MIB',
  'IANA-PRINTER-MIB',
  'IANA-MAU-MIB',
  'IANA-LANGUAGE-MIB',
  'IANA-ITU-ALARM-TC-MIB',
  'IANA-GMPLS-TC-MIB',
  'IANA-CHARSET-MIB',
  'HOST-RESOURCES-TYPES',
  'HOST-RESOURCES-MIB',
  'OSPFV3-MIB',
  'OSPF-TRAP-MIB',
  'OSPF-MIB',
  'HOST-RESOURCES-TYPES',
  'HOST-RESOURCES-MIB',
  'PerfHist-TC-MIB',
  'HDSL2-SHDSL-LINE-MIB',
  'HCNUM-TC',
  'HC-RMON-MIB',
  'HC-ALARM-MIB',
  'GBOND-MIB',
  'FROGFOOT-RESOURCES-MIB',
  'FRAME-RELAY-DTE-MIB',
  'FLOAT-TC-MIB',
  'FDDI-SMT73-MIB',
  'FCMGMT-MIB',
  'EtherLike-MIB',
  'ENTITY-MIB',
  'ENTITY-STATE-TC-MIB',
  'ENTITY-STATE-MIB',
  'ENTITY-SENSOR-MIB',
  'DVMRP-STD-MIB',
  'DVMRP-MIB',
  'DOT3-OAM-MIB',
  'DOCS-IF-MIB',
  'DNS-SERVER-MIB',
  'DNS-RESOLVER-MIB',
  'BGP4V2-TC-MIB',
  'BGP4-MIB',
  'ADSL2-LINE-TC-MIB',
  'ADSL-TC-MIB',
  'VRRP-MIB',
  'VRRPV3-MIB',
  'VPN-TC-STD-MIB',
];

const device: DeviceType = {
  ip: '47.94.238.68',
  community: 'public',
};
// const oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

export const jRun = async () => {
  //   snmpGet(device, oids).then(res => {
  //     console.log(res);
  //   });
  // const json = parseMibsFile('SNMPv2-MIB');
  // console.log(json);
  // fs.writeFile('./src/test/SNMPv2-MIB.json', JSON.stringify(json, null, '\t'), 'utf-8');
  const path = 'src/monitor/mibs/';
  // fileNameArr.forEach(async f => {
  // });
  const data = await fs.readFile(`${path}/SNMPv2-MIB`, 'utf-8');
  readMibFile('SNMPv2-MIB', data);
};
