import { createMonitorItem } from '../controller/monitor.controller';
import { Router } from 'express';

const monitorRouter = Router();

monitorRouter.route('/').post(createMonitorItem).get();

export default monitorRouter;
