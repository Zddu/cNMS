import { deleteAll, getMib, getMibs } from '../controller/mib.controller';
import { Router } from 'express';

const mibRouter = Router();

mibRouter.route('/:mibName').get(getMib);
mibRouter.route('/').get(getMibs).delete(deleteAll);

export default mibRouter;
