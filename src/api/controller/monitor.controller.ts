import ErrorCode from '../../consts';
import { Request, Response } from 'express';
import GlobalIntercept from '../../globalIntercept';
import { connect } from '../../database';
import { dynamicQueryParams } from '../../common';
import { alarmEntry } from '../../monitor/discover/linux/alarm';
import { Monitor } from '../../api/interface/Monitor';
const squel = require('squel');

export async function createMonitorItem(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const monitor = req.body as Monitor;
    const result = (await conn.query('select mission_name from cool_monitor where mission_name = ?', [monitor.mission_name]))[0] as any[];
    if (result.length > 0) {
      res.json(new GlobalIntercept().error(ErrorCode.EXIST, '该任务已存在'));
      return;
    }
    await alarmEntry(monitor);
    await conn.query('insert into cool_monitor set ?', [{ ...monitor, create_time: new Date() }]);
    res.json(new GlobalIntercept().success());
    conn.end();
  } catch (error) {
    console.log('error', error);
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
    const conn = await connect();
    const { current, pageSize, ...query }: any = req.query;
    const sql = squel
      .select()
      .from('cool_monitor')
      .where(dynamicQueryParams(query).sqlText, dynamicQueryParams(query).sqlValues)
      .order('create_time', true)
      .limit(Number(pageSize))
      .offset((Number(current) - 1) * Number(pageSize))
      .toParam();
    const monitors = (await conn.query(sql.text, sql.values))[0];
    res.json(new GlobalIntercept().success(monitors));
    conn.end();
  } catch (error) {
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function deleteMonitorItem(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { mission_id } = req.body;
    console.log('mission_id', mission_id);
    if (mission_id) {
      await conn.query('delete from cool_monitor where mission_id = ?', [mission_id]);
    }
    res.json(new GlobalIntercept().success());
    conn.end();
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

export async function getContacts(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { current, pageSize, ...query }: any = req.query;
    const sql = squel
      .select()
      .from('cool_alarm_contacts')
      .where(dynamicQueryParams(query).sqlText, dynamicQueryParams(query).sqlValues)
      .order('create_time', true)
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

export async function getGroups(req: Request, res: Response): Promise<Response | void> {
  try {
    const conn = await connect();
    const { current, pageSize, ...query }: any = req.query;
    const sql = squel
      .select()
      .field('a.*')
      .field('ac.contact_name')
      .field('ac.contact_phone')
      .field('ac.contact_dingtalk_token')
      .field('ac.contact_email')
      .field('ac.contact_wechat_token')
      .from(squel.select().field('ag.*').field('cg.contact_id').from('cool_contacts_group', 'cg').from('cool_alarm_group', 'ag').where('cg.group_id = ag.group_id'), 'a')
      .left_join('cool_alarm_contacts', 'ac', 'a.contact_id = ac.contact_id')
      .order('create_time', true)
      .having(dynamicQueryParams(query).sqlText, dynamicQueryParams(query).sqlValues)
      .limit(Number(pageSize))
      .offset((Number(current) - 1) * Number(pageSize))
      .toParam();
    console.log('sql', sql);
    const groups = (await conn.query(sql.text, sql.values))[0] as any[];
    let record = {};
    const groupContacts: any[] = [];
    groups.forEach(group => {
      if (!record[group.group_id]) {
        groupContacts.push({
          group_id: group.group_id,
          group_name: group.group_name,
          group_description: group.group_description,
          create_time: group.create_time,
          group_contacts: [group],
        });
        record[group.group_id] = group.group_id;
      } else {
        groupContacts.forEach(item => {
          if (item.group_id === record[item.group_id]) {
            item.group_contacts.push(group);
          }
        });
      }
    });
    res.json(new GlobalIntercept().success(groupContacts));
    conn.end();
  } catch (error) {
    console.log('error', error);
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function createContacts(req: Request, res: Response): Promise<Response | void> {
  try {
    const { contact_name, contact_phone, contact_email, contact_wechat_token, contact_dingtalk_token } = req.body;
    const conn = await connect();
    await conn.query('insert into  cool_alarm_contacts set ?', [
      {
        contact_name,
        contact_phone,
        contact_email,
        contact_wechat_token,
        contact_dingtalk_token,
        create_time: new Date(),
      },
    ]);
    res.json(new GlobalIntercept().success());
    conn.end();
  } catch (error) {
    console.log(error);
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}

export async function createGroup(req: Request, res: Response): Promise<Response | void> {
  try {
    const { group_name, group_contacts, group_description } = req.body;
    const conn = await connect();
    const result = (
      await conn.query('insert into cool_alarm_group set ?', [
        {
          group_name,
          group_description,
          create_time: new Date(),
        },
      ])
    )[0];

    await group_contacts.map(
      async (contact_id: string) =>
        await conn.query('insert into cool_contacts_group set ?', [
          {
            group_id: (result as any).insertId,
            contact_id: Number(contact_id),
          },
        ])
    );

    console.log('result', result);
    console.log('group_contacts', group_contacts);
    res.json(new GlobalIntercept().success());
  } catch (error) {
    console.log(error);
    res.json(new GlobalIntercept().error(ErrorCode.UNKNOWN_EXCEPTION, '服务器错误'));
  }
}
