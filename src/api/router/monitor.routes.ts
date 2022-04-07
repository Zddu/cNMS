/*
 * @Author: zengyan.zdde@bytedance.com
 * @Date: 2022-04-06 10:14:07
 * @LastEditTime: 2022-04-06 20:44:43
 * @LastEditors: zengyan.zdde@bytedance.com
 * @Description:
 * @FilePath: /cool-network-system/src/api/router/monitor.routes.ts
 */
import { createMonitorItem, getMonitorIndexs, getMonitorList, createContacts, getContacts, createGroup, getGroups } from '../controller/monitor.controller';
import { Router } from 'express';

const monitorRouter = Router();

monitorRouter.route('/').post(createMonitorItem).get(getMonitorList);
monitorRouter.route('/index').get(getMonitorIndexs);
monitorRouter.route('/alarm/contact').post(createContacts).get(getContacts);
monitorRouter.route('/alarm/group').post(createGroup).get(getGroups);

export default monitorRouter;
