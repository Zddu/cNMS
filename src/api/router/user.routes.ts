import { createUser, getUsers } from '../controller/user.controller';
import { Router } from 'express';

const userRouter = Router();

userRouter.route('/').get(getUsers).post(createUser);

export default userRouter;
