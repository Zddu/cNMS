import { DeviceType } from '../../../monitor/types';
import { AlarmMonitor, Contact, Monitor, MonitorIndex } from '../../../api/interface/Monitor';
import { connect } from '../../../database';
import { getCPU } from './cpu';
import dayjs from 'dayjs';
import { sendMail } from '../../../monitor/mail/mail-send';
import fs from 'fs/promises';
import { formatFloat, parserHtml } from '../../../common';
import { Pool } from 'mysql2/promise';
import getMem from './mem';
import getNetworkFlow, { NetworkFlowProps } from './network-flow';
import getInterface, { PhysicsInterfaceProps } from './interface';
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
  monitor_mem: (device_id: string, mission: Monitor) => alarmMem(device_id, mission),
  monitor_flow: (device_id: string, mission: Monitor) => alarmFlow(device_id, mission),
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

const alarmModeFunctionMap: { [key: string]: (params: AlarmParamsProps) => Promise<any> } = {
  email: (params: AlarmParamsProps) => mailAlarm(params),
};

const IndexToTextMap = {
  monitor_cpu: 'CPU使用率',
  monitor_mem: '内存使用率',
  monitor_flow: '总带宽使用率',
  monitor_disk_rate: '磁盘使用率',
  monitor_ping: 'PING连通性',
  monitor_snmp: 'SNMP连通性',
};

async function alarmFlow(device_id: string, mission: Monitor) {
  const getTotalFlowRate = async (device: DeviceType, conn: Pool): Promise<number> => {
    const data = await getNetworkFlow(device, conn);
    let maxSpeed: number = 0;
    const pInterface = (await conn.query('select * from cool_physics_inter where device_id = ?', [device.device_id]))[0] as PhysicsInterfaceProps[];
    if (pInterface.length > 0) {
      pInterface.forEach(item => {
        if (item.physics_if_speed) {
          maxSpeed = Math.max(maxSpeed, Number(item.physics_if_speed));
        }
      });
    }
    if (maxSpeed === 0) {
      const inters = await getInterface(device, conn);
      inters.forEach(item => {
        if (item.physics_if_speed) {
          maxSpeed = Math.max(maxSpeed, Number(item.physics_if_speed));
        }
      });
    }
    const flowRate = data.reduce((pre, curr, _index) => {
      return pre + pre + (curr.inflow_rate || 0) + (curr.outflow_rate || 0);
    }, 0);

    return (flowRate * 100) / maxSpeed;
  };
  alarmNumericalBase(device_id, mission, getTotalFlowRate);
}
async function alarmMem(device_id: string, mission: Monitor) {
  alarmNumericalBase(device_id, mission, getMem);
}
async function alarmCPU(device_id: string, mission: Monitor) {
  alarmNumericalBase(device_id, mission, getCPU);
}

async function alarmNumericalBase(device_id: string, mission: Monitor, poll: (device: DeviceType, conn: Pool) => Promise<number>) {
  const conn = await connect();
  const devices = (await conn.query('select * from cool_devices where device_id = ?', [device_id]))[0] as DeviceType[];
  let triggerTimes = 0;
  let sendInfoTime: Date;
  console.log('mission', mission);
  console.log('device', devices);
  cron.schedule(`*/${mission.monitor_frequency} * * * *`, async () => {
    const ut = await poll(devices[0], conn);
    if (mission.monitor_threshold && ut >= Number(mission.monitor_threshold)) {
      triggerTimes++;
    }

    if (triggerTimes === Number(mission.alarm_threshold)) {
      let alarm: AlarmMonitor = {
        mission_name: mission.mission_name,
        monitor_host: device_id,
        monitor_type: mission.monitor_type,
        alarm_status: 1, // 1初始化 2巡检中 3异常
        alarm_times: 1,
        alarm_continued: 0,
        alarm_inform_type: mission.alarm_mode,
        alarm_inform_target: mission.alarm_group,
        create_time: new Date(),
        update_time: new Date(),
      };

      try {
        triggerTimes = 0;
        const contactGroups: Contact[] = [];
        const alarms = (await conn.query('select * from cool_alarm where mission_name = ? and monitor_host = ?', [mission.mission_name, device_id]))[0] as AlarmMonitor[];
        const modes = mission.alarm_mode ? (JSON.parse(mission.alarm_mode) as string[]) : [];
        if (mission.alarm_group) {
          const groupIds = JSON.parse(mission.alarm_group) as string[];
          for (let i = 0; i < groupIds.length; i++) {
            const contacts = (
              await conn.query('select ac.* from cool_alarm_contacts ac left join  (SELECT contact_id FROM cool_contacts_group where group_id = ?) a on a.contact_id = ac.contact_id', [groupIds[i]])
            )[0] as Contact[];
            contactGroups.push(...contacts);
          }
        }

        // 通知联系组
        const alarmInfo = {
          mission_name: mission.mission_name,
          title: IndexToTextMap[mission.monitor_type as string],
          ip: devices[0].ip,
          device_id,
          monitor_threshold: mission.monitor_threshold,
          alarm_threshold: mission.alarm_threshold,
          hostname: devices[0].hostname,
          alarm_info: `${IndexToTextMap[mission.monitor_type as string]}超过监控阈值，当前监控值：${formatFloat(ut, 2)}, 累计时间0小时，累计次数：1， 请及时登录网站查看！`,
          alarm_group: contactGroups,
        };

        if (mission.alarm_mode && !Boolean(alarms.length > 0)) {
          console.log('first alarmInfo', alarmInfo);
          sendInfoTime = new Date();

          for (let i = 0; i < modes.length; i++) {
            console.log('modes', modes[i]);
            await alarmModeFunctionMap[modes[i]](alarmInfo);
          }
        }

        if (alarms.length > 0) {
          const minutes = dayjs(new Date()).diff(alarms[0].create_time, 'minutes');
          const condition = Number(dayjs(new Date()).diff(sendInfoTime, 'minutes')) >= (Number(mission.alarm_silent) || 10);

          for (let i = 0; i < modes.length; i++) {
            if (condition) {
              await alarmModeFunctionMap[modes[i]]({
                mission_name: mission.mission_name,
                title: IndexToTextMap[mission.monitor_type as string],
                ip: devices[0].ip,
                device_id,
                monitor_threshold: mission.monitor_threshold,
                alarm_threshold: mission.alarm_threshold,
                hostname: devices[0].hostname,
                alarm_info: `${IndexToTextMap[mission.monitor_type as string]}超过监控阈值，当前监控值：${formatFloat(ut, 2)}, 累计时间${formatFloat(minutes / 60, 2)}小时，累计次数：${
                  (alarms[0].alarm_times || 0) + 1
                }， 请及时登录网站查看！`,
                alarm_group: contactGroups,
              });
              sendInfoTime = new Date();
            }
          }

          await conn.query('update cool_alarm set alarm_continued = ?, alarm_status = ? , update_time = ?, alarm_times = ?', [
            formatFloat(minutes / 60, 2),
            2,
            new Date(),
            (alarms[0].alarm_times || 0) + 1,
          ]);
        } else {
          await conn.query('insert into cool_alarm set ?', [alarm]);
        }
      } catch (error) {
        console.log('error', error);
        alarm = {
          mission_name: mission.mission_name,
          monitor_host: device_id,
          monitor_type: mission.monitor_type,
          alarm_status: 3,
          alarm_continued: 0,
          alarm_inform_type: mission.alarm_mode,
          alarm_inform_target: mission.alarm_group,
          create_time: new Date(),
          update_time: new Date(),
          error_info: (error as Error).message,
        };
        await conn.query('insert into cool_alarm set ?', [alarm]);
      }
    }
  });
}

export interface AlarmParamsProps {
  hostname?: string;
  alarm_info?: string;
  alarm_threshold?: number;
  mission_name?: string;
  title?: string;
  device_id?: string;
  monitor_threshold?: number;
  ip?: string;
  alarm_group?: Contact[];
}

export async function mailAlarm(params: AlarmParamsProps) {
  const tpl = await fs.readFile('src/monitor/mail/template.html', 'utf8');

  const parserStr = parserHtml(tpl, params);
  console.log('parserStr', parserStr);
  if (params.alarm_group) {
    params.alarm_group.forEach(async contact => {
      await sendMail({
        to: contact.contact_email as string,
        subject: `${params.title}告警信息`,
        html: parserStr,
      });
    });
  } else {
    throw '没有联系组信息';
  }
}
