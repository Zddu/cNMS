import { createMonitorItem, getMonitorIndexs, getMonitorList } from '../controller/monitor.controller';
import { Router } from 'express';

const monitorRouter = Router();

monitorRouter.route('/').post(createMonitorItem).get(getMonitorList);
monitorRouter.route('/index').get(getMonitorIndexs);

export default monitorRouter;
