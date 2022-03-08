import { getAllDevice } from '../controller/device.controller';
import { Router } from 'express';

const deviceRouter = Router();

deviceRouter.route('/devices').get(getAllDevice);

export default deviceRouter;
