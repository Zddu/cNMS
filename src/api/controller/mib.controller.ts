import { connect } from '../../database';
import { Request, Response } from 'express';
import { getMibModule, getMibModules } from '../../monitor/utils/snmp-utils';

export async function getMib(req: Request, res: Response) {
  try {
    const { mibName } = req.params;
    res.json(getMibModule(mibName));
  } catch (error) {
    res.json({
      message: error,
    });
  }
}

export async function getMibs(req: Request, res: Response) {
  try {
    getMibModules();
  } catch (error) {
    res.json({
      message: error,
    });
  }
}

export async function deleteAll(req: Request, res: Response) {
  try {
    const conn = await connect();
    const result = await conn.query('delete from mibs');
    res.json(result);
  } catch (error) {
    res.json({
      message: error,
    });
  }
}

export async function getMibByOid(oid: string) {
  try {
    const conn = await connect();
    return await conn.query('select * from mibs where oid = ?', [oid]);
  } catch (error) {
    return error;
  }
}
