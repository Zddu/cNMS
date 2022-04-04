import { snmpTable } from './../../utils/snmp-utils';
import { Pool } from 'mysql2/promise';
import { DeviceType } from './../../types';
import { isObj, objBuffer2String } from '../../../common';
const tcpConnTable = '1.3.6.1.2.1.6.13';
const udpTableOid = '1.3.6.1.2.1.7.5';

interface TcpConnItemProps {
  device_id?: string;
  tcp_conn_state: 'closed' | 'listen' | 'synSent' | 'synReceived' | 'established' | 'finWait1' | 'finWait2' | 'closeWait' | 'lastAck' | 'closing' | 'timeWait' | 'deleteTCB';
  local_address: string;
  local_port: number;
  remote_address: string;
  remote_port: number;
  last_polled: Date;
}

interface UdpConnItemProps {
  device_id?: string;
  local_address: string;
  local_port: number;
  last_polled: Date;
}

const getServices = async (device: DeviceType, conn?: Pool) => {
  const tcp_conn_table = await snmpTable(device, tcpConnTable, 1000);
  const udp_table = await snmpTable(device, udpTableOid, 1000);
  objBuffer2String(tcp_conn_table);
  objBuffer2String(udp_table);
  const tcpTable: TcpConnItemProps[] = [];
  const udpTable: UdpConnItemProps[] = [];
  if (isObj(tcp_conn_table)) {
    Object.values(tcp_conn_table).forEach((v: any) => {
      const tcpConnItem: TcpConnItemProps = {
        device_id: device.device_id,
        tcp_conn_state: STATUS_MAP[v['1']],
        local_address: v['2'],
        local_port: v['3'],
        remote_address: v['4'],
        remote_port: v['5'],
        last_polled: new Date(),
      };
      tcpTable.push(tcpConnItem);
    });
  }

  if (isObj(udp_table)) {
    Object.values(udp_table).forEach((v: any) => {
      const udpItem: UdpConnItemProps = {
        device_id: device.device_id,
        local_address: v['1'],
        local_port: v['2'],
        last_polled: new Date(),
      };
      udpTable.push(udpItem);
    });
  }

  if (conn) {
    // todo 入库
  }

  return { tcpTable, udpTable };
};

const STATUS_MAP = {
  '1': 'closed',
  '2': 'listen',
  '3': 'synSent',
  '4': 'synReceived',
  '5': 'established',
  '6': 'finWait1',
  '7': 'finWait2',
  '8': 'closeWait',
  '9': 'lastAck',
  '10': 'closing',
  '11': 'timeWait',
  '12': 'deleteTCB',
};

export default getServices;
