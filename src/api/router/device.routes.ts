import { addDevice, getAllDevice, getDefaultConfig, getDeviceInfo, getCpuData } from '../controller/device.controller';
import { Router } from 'express';

const deviceRouter = Router();

deviceRouter.route('/devices').get(getAllDevice).post(addDevice);
deviceRouter.route('/device/default_config').get(getDefaultConfig);
deviceRouter.route('/device/info').get(getDeviceInfo);

deviceRouter.route('/cpu/info').get(getCpuData);

export default deviceRouter;
