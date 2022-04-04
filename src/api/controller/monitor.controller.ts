import ErrorCode from '../../consts';
import { Request, Response } from 'express';
import GlobalIntercept from '../../globalIntercept';

export async function createMonitorItem(req: Request, res: Response): Promise<Response | void> {
  try {
    res.json();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function getMonitorList(req: Request, res: Response): Promise<Response | void> {
  try {
    res.json();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}
