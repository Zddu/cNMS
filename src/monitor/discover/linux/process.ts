import { isObj, objBuffer2String } from '../../../common';
import { snmpTableColumns } from '../../../monitor/utils/snmp-utils';
import { DeviceType } from './../../types';
import { ProcessItemProps, RunStatus, RunTypeMap } from './typings';

const hrSWRunTable = '1.3.6.1.2.1.25.4.2';
const getProcess = async (device: DeviceType) => {
  const hr_swRun_table = await snmpTableColumns(device, hrSWRunTable, [1, 2, 4, 5, 6, 7], 1000);
  objBuffer2String(hr_swRun_table);
  const processTable: ProcessItemProps[] = [];
  if (isObj(hr_swRun_table)) {
    Object.values(hr_swRun_table).forEach((v: any) => {
      const item: ProcessItemProps = {
        pid: Number(v['1']),
        processName: v['2'],
        processPath: v['4'],
        runParameters: v['5'],
        runType: RunTypeMap[v['6']],
        runStatus: RunStatus[v['7']],
        last_polled: new Date(),
      };
      processTable.push(item);
    });
  }

  return processTable;
};

export default getProcess;
