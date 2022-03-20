import { addDevice, getAllDevice, getDefaultConfig, getDeviceInfo, getCpuData, getMemData, getSSHConfig, addSSHConfig } from '../controller/device.controller';
import { Router } from 'express';
import expressWs from 'express-ws';
import { handleSSH } from '../../monitor/ssh/handle-ssh';

const deviceRouter = Router();
expressWs(deviceRouter);

deviceRouter.route('/devices').get(getAllDevice).post(addDevice);
deviceRouter.route('/device/default_config').get(getDefaultConfig);
deviceRouter.route('/device/info').get(getDeviceInfo);

deviceRouter.route('/cpu/info').get(getCpuData);
deviceRouter.route('/mem/info').get(getMemData);

deviceRouter.route('/ssh/info').get(getSSHConfig).post(addSSHConfig);

(deviceRouter as any).ws('/ws/host', handleSSH);

export default deviceRouter;
