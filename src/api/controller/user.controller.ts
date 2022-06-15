import { connect } from '../../database';

import { User } from 'api/interface/User';
import { Request, Response } from 'express';

export async function getUsers(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const users = await conn.query('select * from ts_user');
    return res.json(users[0]);
  } catch (error) {
    console.log(error);
  }
}


export async function createUser(req: Request, res: Response) {
  try {
    const newUser: User = req.body;
    newUser.created_at = new Date();
    const conn = await connect();
    await conn.query('insert into ts_user set ?', [newUser]);
    res.json({
      message: '创建了一个新用户',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}
