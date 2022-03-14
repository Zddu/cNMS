import { addDevice, getAllDevice, getDefaultConfig } from '../controller/device.controller';
import { Router } from 'express';

const deviceRouter = Router();

deviceRouter.route('/devices').get(getAllDevice).post(addDevice);
deviceRouter.route('/device/default_config').get(getDefaultConfig);

export default deviceRouter;
