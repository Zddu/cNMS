import { connect } from '../../database';
import { Request, Response } from 'express';
import GlobalIntercept from '../../globalIntercept';
import ErrorCode from '../../consts';

export async function getAllDevice(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const devices = (await conn.query('select * from cool_devices'))[0];
    return res.json(new GlobalIntercept().success(devices));
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}
