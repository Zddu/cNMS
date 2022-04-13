import { createMonitorItem, getMonitorIndexs, getMonitorList, createContacts, getContacts, createGroup, getGroups, deleteMonitorItem, getAlarms } from '../controller/monitor.controller';
import { Router } from 'express';

const monitorRouter = Router();

monitorRouter.route('/').post(createMonitorItem).get(getMonitorList).delete(deleteMonitorItem);
monitorRouter.route('/index').get(getMonitorIndexs);
monitorRouter.route('/alarm/contact').post(createContacts).get(getContacts);
monitorRouter.route('/alarm/group').post(createGroup).get(getGroups);
monitorRouter.route('/alarms').get(getAlarms);

export default monitorRouter;
