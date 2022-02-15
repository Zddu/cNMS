import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { Routes } from './router/crmRoutes';
import userRouter from './router/user.routes';

class App {
  public app: express.Application;
  private route: Routes = new Routes();

  constructor() {
    this.app = express();
    this.middleware();
    // 引入路由
    this.routes();
  }

  private middleware() {
    //开启 cors
    this.app.use(cors());
    //支持  application/json类型 发送数据
    this.app.use(json());
    //支持 application/x-www-form-urlencoded 发送数据
    this.app.use(urlencoded({ extended: false }));
    //日志中间件
    this.app.use(morgan('dev'));
  }

  private routes() {
    this.app.use('/user', userRouter);
  }
}
export default new App().app;
