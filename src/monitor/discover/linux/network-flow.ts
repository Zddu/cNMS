import { snmpTableColumns } from '../../../monitor/utils/snmp-utils';
import { DeviceType } from '../../../monitor/types';
import { bitsToReadable, formatFloat, isObj } from '../../../common';
import { connect } from '../../../database';

const TIME = 60 * 1000 * 5;
const ifXTableOid = '1.3.6.1.2.1.31.1.1';

/**
 * In流量 = ((ifHCInOctets2 - ifHCInOctets1) * 8) / ((time2 - time1) * 1024 * 1024) Mbits / s
 * Out流量 = ((ifHCOutOctets2 - ifHCOutOctets1) * 8) / ((time2 - time1) * 1024 * 1024) Mbits / s
 * @param device
 */
export default async function getNetworkFlow(device: DeviceType) {
  try {
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

    const interFlowTable: any = [];
    setTimeout(async () => {
      const net_flow2 = await snmpTableColumns(device, ifXTableOid, [1, 6, 10], 100);

      Object.keys(isObj(net_flow2) ? net_flow2 : {}).forEach(k => {
        net_flow2[k]['1'] = net_flow2[k]['1'].toString();
        let buff6 = Buffer.alloc(8);
        let buff10 = Buffer.alloc(8);
        buff6.fill(net_flow2[k]['6'], 8 - Buffer.byteLength(net_flow2[k]['6']));
        buff10.fill(net_flow2[k]['10'], 8 - Buffer.byteLength(net_flow2[k]['10']));
        net_flow2[k]['6'] = buff6.readBigInt64BE(0).toString();
        net_flow2[k]['10'] = buff10.readBigInt64BE(0).toString();
        const notNaN = !isNaN(Number(net_flow2[k]['6'])) && !isNaN(Number(net_flow1[k]['6'])) && !isNaN(Number(net_flow2[k]['10'])) && !isNaN(Number(net_flow1[k]['10']));

        const inFlow = formatFloat(((Number(net_flow2[k]['6']) - Number(net_flow1[k]['6'])) * 8) / TIME, 1);
        const outFlow = formatFloat(((Number(net_flow2[k]['6']) - Number(net_flow1[k]['6'])) * 8) / TIME, 1);
        if (Number(inFlow) > 1 && Number(outFlow) > 1) {
          const interFlow = {
            device_id: device.device_id,
            physics_if_name: net_flow2[k]['1'],
            inflow_rate: notNaN ? bitsToReadable(((Number(net_flow2[k]['6']) - Number(net_flow1[k]['6'])) * 8) / TIME) : null,
            outflow_rate: notNaN ? bitsToReadable(((Number(net_flow2[k]['10']) - Number(net_flow1[k]['10'])) * 8) / TIME) : null,
            last_polled: new Date(),
          };
          interFlowTable.push(interFlow);
        }
      });

      console.log(`${device.hostname}`, interFlowTable);
      const conn = await connect();
      interFlowTable.forEach(async v => {
        await conn.query('insert into cool_network_flow set ?', [v]);
      });
    }, TIME);
  } catch (error) {
    console.log('get net flow error', error);
  }
}
