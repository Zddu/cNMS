/*
 * @Author: zengyan.zdde@bytedance.com
 * @Date: 2022-04-06 10:14:07
 * @LastEditTime: 2022-04-06 21:08:05
 * @LastEditors: zengyan.zdde@bytedance.com
 * @Description:
 * @FilePath: /cool-network-system/src/api/controller/monitor.controller.ts
 */
import ErrorCode from '../../consts';
import { Request, Response } from 'express';
import GlobalIntercept from '../../globalIntercept';
import { connect } from '../../database';
import { dynamicQueryParams } from '../../common';
const squel = require('squel');

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
