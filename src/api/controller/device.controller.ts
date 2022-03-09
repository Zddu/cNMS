import { connect } from '../../database';
import { Request, Response } from 'express';
import GlobalIntercept from '../../globalIntercept';
import ErrorCode from '../../consts';
import defaultConfig from '../../default.config';

export async function getAllDevice(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const devices = (await conn.query('select * from cool_devices'))[0];
    return res.json(new GlobalIntercept().success(devices));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function getDefaultConfig(req: Request, res: Response): Promise<Response | void> {
  try {
    return res.json(new GlobalIntercept().success(defaultConfig));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}
