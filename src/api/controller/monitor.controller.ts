import ErrorCode from '../../consts';
import { Request, Response } from 'express';
import GlobalIntercept from '../../globalIntercept';
import { connect } from '../../database';

export async function createMonitorItem(req: Request, res: Response): Promise<Response | void> {
  try {
    res.json();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

/**
 * 返回监控项列表
 * @param req
 * @param res
 */
export async function getMonitorList(req: Request, res: Response): Promise<Response | void> {
  try {
    res.json();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

/**
 * 返回监控指标列表
 */
export async function getMonitorIndexs(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const item = (await conn.query('select * from cool_monitor_index'))[0];
    res.json(new GlobalIntercept().success(item));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}
