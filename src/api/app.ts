import expressWs from 'express-ws';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import xmlparser  from 'express-xml-bodyparser';
import userRouter from './router/user.routes';
import mibRouter from './router/mib.routes';
import deviceRouter from './router/device.routes';
import monitorRouter from './router/monitor.routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    expressWs(this.app);
    this.middleware();
    // 引入路由
    this.routes();
  }

  private middleware() {
    //开启 cors
    this.app.use(cors());
    //支持  application/json类型 发送数据
    this.app.use(json());
    //解析微信公众号xml消息
    this.app.use(xmlparser())
    //支持 application/x-www-form-urlencoded 发送数据
    this.app.use(urlencoded({ extended: false }));
    //日志中间件
    this.app.use(morgan('dev'));
  }

  private routes() {
    this.app.use('/user', userRouter);
    this.app.use('/mib', mibRouter);
    this.app.use('/cool', deviceRouter);
    this.app.use('/monitor', monitorRouter);
    this.app.use('/ws', deviceRouter);
  }
}
export default new App().app;
