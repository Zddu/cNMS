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
    console.log('sql', sql);
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
