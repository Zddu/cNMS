import { DeviceType } from '../../../monitor/types';
import { AlarmMonitor, Monitor, MonitorIndex } from '../../../api/interface/Monitor';
import { connect } from '../../../database';
import { getCPU } from './cpu';
import dayjs from 'dayjs';
const cron = require('node-cron');

export async function alarmEntry(mission: Monitor) {
  const conn = await connect();
  const monitorIndex = (await conn.query('select * from cool_monitor_index where monitor_index = ?', [mission.monitor_type]))[0] as MonitorIndex[];

  if (monitorIndex[0].index_type === 1) {
    const hosts = JSON.parse(mission.monitor_hosts || '[]') as string[];
    hosts.forEach(id => alarmFunctionMap[monitorIndex[0].monitor_index as string](id, mission));
  }
}

const alarmFunctionMap: { [key: string]: (device_id: string, mission: Monitor) => Promise<any> } = {
  monitor_cpu: (device_id: string, mission: Monitor) => alarmCPU(device_id, mission),
  //   monitor_mem: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_flow: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_ping: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_snmp: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_disk_rate: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_interface: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_inflow: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_outflow: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_in_discards: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_out_discards: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_in_errors: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  //   monitor_out_errors: (device: DeviceType, conn: Pool) => getCPU(device, conn),
};

async function alarmCPU(device_id: string, mission: Monitor) {
  const conn = await connect();
  const devices = (await conn.query('select * from cool_devices where device_id = ?', [device_id]))[0] as DeviceType[];
  console.log('device', devices);
  console.log('mission', mission);
  let triggerTimes = 0;
  cron.schedule(`*/${mission.monitor_frequency} * * * *`, async () => {
    console.log('running a task every two minutes');
    const ut = await getCPU(devices[0], conn);
    if (mission.monitor_threshold && ut >= Number(mission.monitor_threshold)) {
      triggerTimes++;
    }
    if (triggerTimes === Number(mission.alarm_threshold)) {
      // 通知联系组

      // 历史告警入库
      const alarms = (await conn.query('select * from cool_alarm where mission_name = ? and monitor_host = ?', [mission.mission_name, device_id]))[0] as AlarmMonitor[];
      if (alarms.length > 0) {
        const hours = dayjs(alarms[0].create_time).diff(new Date(), 'hour');
        await conn.query('update cool_alarm set alarm_continued = ?', [hours]);
      } else {
        const alarm: AlarmMonitor = {
          mission_name: mission.mission_name,
          monitor_host: device_id,
          monitor_type: mission.monitor_type,
          alarm_status: '告警中',
          alarm_continued: 0,
          alarm_inform_type: mission.alarm_mode,
          alarm_inform_target: mission.alarm_group,
          create_time: new Date(),
        };

        await conn.query('insert into cool_alarm set ?', [alarm]);
      }
    }

    console.log('cpu', ut);
  });
}
