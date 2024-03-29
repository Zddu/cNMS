import { snmpTableColumns } from '../../../monitor/utils/snmp-utils';
import { DeviceType } from '../../../monitor/types';
import { bitsToReadable, formatFloat, isObj, objBuffer2String } from '../../../common';
import { Pool } from 'mysql2/promise';
import { ConfigProps, DeviceConfigProps } from './typings';

const ifXTableOid = '1.3.6.1.2.1.31.1.1';

/**
 * @oid说明 \
 * ifInErrors: 1.3.6.1.2.1.31.1.1.14 接收错误数据包数 \
 * ifOutErrors: 1.3.6.1.2.1.31.1.1.20 发送错误数据包数 \
 * ifHCInOctets: 1.3.6.1.2.1.31.1.1.6 发送字符累积量 \
 * ifHCOutOctets: 1.3.6.1.2.1.31.1.1.1.10 接收字符累积量 \
 * ifInDiscards: 1.3.6.1.2.1.31.1.1.13 接收丢包数 \
 * ifOutDiscards: 1.3.6.1.2.1.31.1.1.19 发送丢包数 \
 * ifHighSpeed: 1.3.6.1.2.1.31.1.1.1.15 接口总数据包
 * In流量 = ((ifHCInOctets2 - ifHCInOctets1) * 8) / ((time2 - time1) * 1024 * 1024) Mbits / s \
 * Out流量 = ((ifHCOutOctets2 - ifHCOutOctets1) * 8) / ((time2 - time1) * 1024 * 1024) Mbits / s
 * @param device
 * @param conn
 */

export interface NetworkFlowProps {
  device_id?: string;
  physics_if_name: string;
  inflow_rate?: number;
  outflow_rate?: number;
  in_discards_rate?: number;
  out_discards_rate?: number;
  in_error_rate?: number;
  out_error_rate?: number;
  if_status?: string;
  last_polled: Date;
}

export default async function getNetworkFlow(device: DeviceType, conn: Pool) {
  return new Promise<NetworkFlowProps[]>(async (resolve, reject) => {
    const ifOtherData1 = await interOtherData(device);
    const deviceConfig = (await conn.query('select * from cool_device_config where device_id = ?', [device.device_id]))[0] as ConfigProps[];
    try {
      const config = JSON.parse(deviceConfig[0].device_config) as DeviceConfigProps;
      const TIME = config.poll.poll_item.flow.average_time.value * 1000;
      const deltaTime = config.poll.poll_item.flow.average_time.value;
      const decimal = config.poll.poll_item.flow.decimal.value; //小数位数
      const unit = config.poll.poll_item.flow.unit.value; //单位
      const net_flow1 = await snmpTableColumns(device, ifXTableOid, [1, 6, 10], 100);

      Object.keys(isObj(net_flow1) ? net_flow1 : {}).forEach(k => {
        net_flow1[k]['1'] = net_flow1[k]['1'].toString();
        let buff6 = Buffer.alloc(8);
        let buff10 = Buffer.alloc(8);
        buff6.fill(net_flow1[k]['6'], 8 - Buffer.byteLength(net_flow1[k]['6']));
        buff10.fill(net_flow1[k]['10'], 8 - Buffer.byteLength(net_flow1[k]['10']));
        net_flow1[k]['6'] = buff6.readBigInt64BE(0).toString();
        net_flow1[k]['10'] = buff10.readBigInt64BE(0).toString();
      });

      const interFlowTable: NetworkFlowProps[] = [];
      const rawFlowData: NetworkFlowProps[] = [];
      setTimeout(async () => {
        const net_flow2 = await snmpTableColumns(device, ifXTableOid, [1, 6, 10], 100);
        const ifOtherData2 = await interOtherData(device);

        Object.keys(isObj(net_flow2) ? net_flow2 : {}).forEach(k => {
          net_flow2[k]['1'] = net_flow2[k]['1'].toString();
          let buff6 = Buffer.alloc(8);
          let buff10 = Buffer.alloc(8);
          buff6.fill(net_flow2[k]['6'], 8 - Buffer.byteLength(net_flow2[k]['6']));
          buff10.fill(net_flow2[k]['10'], 8 - Buffer.byteLength(net_flow2[k]['10']));
          net_flow2[k]['6'] = buff6.readBigInt64BE(0).toString();
          net_flow2[k]['10'] = buff10.readBigInt64BE(0).toString();
          const notNaN = !isNaN(Number(net_flow2[k]['6'])) && !isNaN(Number(net_flow1[k]['6'])) && !isNaN(Number(net_flow2[k]['10'])) && !isNaN(Number(net_flow1[k]['10']));
          const inFlow = formatFloat(((Number(net_flow2[k]['6']) - Number(net_flow1[k]['6'])) * 8) / deltaTime, 1);
          const outFlow = formatFloat(((Number(net_flow2[k]['10']) - Number(net_flow1[k]['10'])) * 8) / deltaTime, 1);

          if (Number(inFlow) > 1 && Number(outFlow) > 1) {
            const ifTime1 = ifOtherData1.find(v => v.physics_if_name === net_flow2[k]['1']);
            const ifTime2 = ifOtherData2.find(v => v.physics_if_name === net_flow2[k]['1']);
            const interFlow: NetworkFlowProps = {
              device_id: device.device_id,
              physics_if_name: net_flow2[k]['1'],
              inflow_rate: notNaN ? bitsToReadable(((Number(net_flow2[k]['6']) - Number(net_flow1[k]['6'])) * 8) / deltaTime, decimal, unit) : undefined,
              outflow_rate: notNaN ? bitsToReadable(((Number(net_flow2[k]['10']) - Number(net_flow1[k]['10'])) * 8) / deltaTime, decimal, unit) : undefined,
              in_discards_rate: (ifTime2.in_discards_pkts - ifTime1.in_discards_pkts) / deltaTime,
              out_discards_rate: (ifTime2.out_discards_pkts - ifTime1.out_discards_pkts) / deltaTime,
              in_error_rate: (ifTime2.in_error_pkts - ifTime1.in_error_pkts) / deltaTime,
              out_error_rate: (ifTime2.out_error_pkts - ifTime1.out_error_pkts) / deltaTime,
              if_status: ifTime2.if_status,
              last_polled: new Date(),
            };

            const rawFlow: NetworkFlowProps = {
              device_id: device.device_id,
              physics_if_name: net_flow2[k]['1'],
              inflow_rate: notNaN ? ((Number(net_flow2[k]['6']) - Number(net_flow1[k]['6'])) * 8) / deltaTime : undefined,
              outflow_rate: notNaN ? ((Number(net_flow2[k]['10']) - Number(net_flow1[k]['10'])) * 8) / deltaTime : undefined,
              in_discards_rate: (ifTime2.in_discards_pkts - ifTime1.in_discards_pkts) / deltaTime,
              out_discards_rate: (ifTime2.out_discards_pkts - ifTime1.out_discards_pkts) / deltaTime,
              in_error_rate: (ifTime2.in_error_pkts - ifTime1.in_error_pkts) / deltaTime,
              out_error_rate: (ifTime2.out_error_pkts - ifTime1.out_error_pkts) / deltaTime,
              if_status: ifTime2.if_status,
              last_polled: new Date(),
            };

            interFlowTable.push(interFlow);
            rawFlowData.push(rawFlow);
          }
        });

        console.log(`${device.hostname}`, interFlowTable);
        resolve(rawFlowData);
        for (let i = 0; i < interFlowTable.length; i++) {
          await conn.query('insert into cool_network_flow set ?', [interFlowTable[i]]);
        }
      }, TIME);
    } catch (error) {
      console.log('get net flow error', error);
      reject(error);
    }
  });
}

const ifTable = '1.3.6.1.2.1.2.2';

async function interOtherData(device: DeviceType) {
  try {
    const interData = await snmpTableColumns(device, ifTable, [2, 3, 7, 8, 13, 14, 19, 20], 100);
    objBuffer2String(interData);
    const if_table: any = [];
    if (isObj(interData)) {
      Object.values(interData).forEach((v: { [key: string]: any }) => {
        const ifTableData = {
          physics_if_name: v['2'],
          if_status: checkIfStatus(v[8], v[7]),
          in_discards_pkts: v['13'],
          out_discards_pkts: v['14'],
          in_error_pkts: v['19'],
          out_error_pkts: v['20'],
        };
        if_table.push(ifTableData);
      });
    }
    return if_table;
  } catch (error) {
    console.log(`${device.hostname} interOtherData error`);
  }
}

function checkIfStatus(ifOperStatus: number, ifAdminStatus: number) {
  if (ifOperStatus === 1 && ifAdminStatus === 1) {
    return '正常';
  } else if (ifOperStatus === 2 && ifAdminStatus === 1) {
    return '故障';
  } else if (ifOperStatus === 2 && ifAdminStatus === 2) {
    return '停机';
  } else if (ifOperStatus === 3 && ifAdminStatus === 3) {
    return '测试';
  } else {
    return '未知';
  }
}
