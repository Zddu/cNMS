import { createMonitorItem, handleMessage, getMonitorIndexs, validateWechat, getMonitorList, createContacts, getContacts, createGroup, getGroups, deleteMonitorItem, getAlarms, findTopology } from '../controller/monitor.controller';
import { Router } from 'express';
import { setTonken, timingSetTonken } from '../../monitor/wechat/tonken-config';

const monitorRouter = Router();

//微信Token

setTonken().then(() => {
  timingSetTonken();
});

monitorRouter.route('/').post(createMonitorItem).get(getMonitorList).delete(deleteMonitorItem);
monitorRouter.route('/index').get(getMonitorIndexs);
monitorRouter.route('/alarm/contact').post(createContacts).get(getContacts);
monitorRouter.route('/alarm/group').post(createGroup).get(getGroups);
monitorRouter.route('/alarm/wechat').get(validateWechat).post(handleMessage);
monitorRouter.route('/alarms').get(getAlarms);
monitorRouter.route('/topology').get(findTopology);

export default monitorRouter;
