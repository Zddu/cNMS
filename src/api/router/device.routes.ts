import {
  addDevice,
  getAllDevice,
  getDefaultConfig,
  getDeviceInfo,
  getDiskData,
  getCpuData,
  getMemData,
  getSSHConfig,
  addSSHConfig,
  getProcessData,
  getAdapterData,
  getServicesData,
  getNetflowData,
  getApplicationData,
} from '../controller/device.controller';
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
deviceRouter.route('/process/info').get(getProcessData);
deviceRouter.route('/disk/info').get(getDiskData);
deviceRouter.route('/adapter/info').get(getAdapterData);
deviceRouter.route('/services/info').get(getServicesData);
deviceRouter.route('/netflow/info').get(getNetflowData);
deviceRouter.route('/application/info').get(getApplicationData);

deviceRouter.route('/ssh/info').get(getSSHConfig).post(addSSHConfig);

(deviceRouter as any).ws('/ws/host', handleSSH);

export default deviceRouter;
