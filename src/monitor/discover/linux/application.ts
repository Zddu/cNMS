import { isObj, objBuffer2String } from '../../../common';
import { DeviceType } from './../../types';
import { snmpTable } from './../../utils/snmp-utils';

const hrSWInstalledTable = '1.3.6.1.2.1.25.6.3';

interface InstalledItemProps {
  device_id?: string;
  index: string;
  name: string;
  type: string;
  datetime: string;
  last_polled: Date;
}

const getApplication = async (device: DeviceType) => {
  try {
    const installedTable: InstalledItemProps[] = [];
    const installed_walk = await snmpTable(device, hrSWInstalledTable, 5000);
    objBuffer2String(installed_walk, [], { '2': 'utf8', '5': 'hex' });
    if (isObj(installed_walk)) {
      Object.values(installed_walk).forEach((item: any) => {
        const year = parseInt(item['5'].slice(0, 4), 16);
        const month = parseInt(item['5'].slice(4, 6), 16);
        const day = parseInt(item['5'].slice(6, 8), 16);
        const hour = parseInt(item['5'].slice(8, 10));
        const minte = parseInt(item['5'].slice(10, 12));
        const secods = parseInt(item['5'].slice(12, 14));
        const zone = item['5'].slice(16, 18) === '2b' ? '+' : '-';
        const zontime = parseInt(item['5'].slice(18, 20), 16);
        const end = parseInt(item['5'].slice(20, 22), 16);
        const timeStr = `${year}-${month}-${day} ${hour}:${minte}:${secods}, ${zone}${zontime}:${end}`;
        item['5'] = timeStr;
        const installItem: InstalledItemProps = {
          device_id: device.device_id,
          index: item['1'],
          name: item['2'],
          type: installTypeMap[item['4']],
          datetime: item['5'],
          last_polled: new Date(),
        };

        installedTable.push(installItem);
      });
    }
    return installedTable;
  } catch (error) {
    console.log('err', error);
    throw error;
  }
};

const installTypeMap = {
  '1': 'unknown',
  '2': 'operatingSystem',
  '3': 'deviceDriver',
  '4': 'application',
};

export default getApplication;
