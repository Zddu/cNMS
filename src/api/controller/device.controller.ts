import { DeviceType } from './../../monitor/types';
import { connect } from '../../database';
import { Request, Response } from 'express';
const squel = require('squel');
import GlobalIntercept from '../../globalIntercept';
import ErrorCode from '../../consts';
import defaultConfig from '../../default.config';
import { addHost } from '../../add-host';
import { ConfigProps } from '../../monitor/discover/linux/typings';
import { dynamicQueryParams } from '../../common';
import getProcess from '../../monitor/discover/linux/process';
import getInterface from '../../monitor/discover/linux/interface';
import getServices from '../../monitor/discover/linux/services';
import getApplication from '../../monitor/discover/linux/application';

export async function getAllDevice(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { current, pageSize, ...query }: any = req.query;
    const sql = squel
      .select()
      .from('cool_devices')
      .where(dynamicQueryParams(query).sqlText, dynamicQueryParams(query).sqlValues)
      .order('last_polled', true)
      .limit(Number(pageSize))
      .offset((Number(current) - 1) * Number(pageSize))
      .toParam();
    const devices = (await conn.query(sql.text, sql.values))[0];
    res.json(new GlobalIntercept().success(devices));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function getDefaultConfig(req: Request, res: Response): Promise<Response | void> {
  try {
    res.json(new GlobalIntercept().success(defaultConfig));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function addDevice(req: Request, res: Response): Promise<Response | void> {
  try {
    // console.log(req.body);
    const deviceInfo = req.body as { device: DeviceType; config: ConfigProps };
    console.log('deviceInfo', deviceInfo);
    try {
      await addHost(deviceInfo.device, JSON.stringify(deviceInfo.config));
      res.json(new GlobalIntercept().success());
    } catch (error) {
      res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
    }
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function getDeviceInfo(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const physics = (await conn.query('select * from cool_physics where device_id = ?', [device_id]))[0];
    const inter = (await conn.query('select * from cool_physics_inter where device_id = ?', [device_id]))[0];
    const cpu = (await conn.query('select * from cool_cpu_rate where device_id = ?', [device_id]))[0];
    const mem = (await conn.query('select * from cool_mem_rate where device_id = ?', [device_id]))[0];
    const disk = (await conn.query('select * from cool_disk where device_id = ?', [device_id]))[0];

    res.json(new GlobalIntercept().success({ physics, interface: inter, cpu, mem, disk }));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getCpuData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const cpu = (await conn.query('select * from cool_cpu_rate  where device_id = ? order by last_polled DESC', [device_id]))[0];
    res.json(new GlobalIntercept().success(cpu[0]));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getMemData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const mem = (await conn.query('select * from cool_mem_rate  where device_id = ? order by last_polled DESC', [device_id]))[0];
    res.json(new GlobalIntercept().success(mem[0]));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getSSHConfig(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const ssh = (await conn.query('select * from cool_ssh  where device_id = ? ', [device_id]))[0];
    res.json(new GlobalIntercept().success(ssh[0]));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function addSSHConfig(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id, username, password, port } = req.body;
    const ssh = (await conn.query('select * from cool_ssh  where device_id = ? ', [device_id]))[0];
    console.log(ssh);
    if (!Boolean(ssh[0])) {
      await conn.query('insert into cool_ssh set ?', [{ device_id, username, password, port }]);
    } else {
      res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, 'SSH账户已存在'));
    }
    res.json(new GlobalIntercept().success());
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getProcessData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const device = (await conn.query('select * from cool_devices  where device_id = ? ', [device_id]))[0];
    const data = await getProcess(device[0]);
    res.json(new GlobalIntercept().success(data));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getDiskData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const disk = (await conn.query('select * from cool_disk  where device_id = ? ', [device_id]))[0];
    res.json(new GlobalIntercept().success(disk));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getAdapterData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const device = (await conn.query('select * from cool_devices  where device_id = ? ', [device_id]))[0];
    const data = await getInterface(device[0]);
    res.json(new GlobalIntercept().success(data));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getServicesData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const device = (await conn.query('select * from cool_devices  where device_id = ? ', [device_id]))[0];
    const data = await getServices(device[0]);
    res.json(new GlobalIntercept().success(data));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getNetflowData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id, adapter } = req.query;
    let flows;
    if (adapter) {
      flows = (await conn.query('select * from cool_network_flow  where device_id = ? and physics_if_name = ? ', [device_id, adapter]))[0];
    } else {
      flows = (await conn.query('select * from cool_network_flow  where device_id = ? ', [device_id]))[0];
    }

    res.json(new GlobalIntercept().success(flows));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}

export async function getApplicationData(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { device_id } = req.query;
    const device = (await conn.query('select * from cool_devices  where device_id = ? ', [device_id]))[0];
    const data = await getApplication(device[0]);
    res.json(new GlobalIntercept().success(data));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, (error as Error).message));
  }
}
