## 进展

- 2022-3-2 基本完成 linux 服务器数据检测
- 2022-4-4 数据展示
- 2022-4-14 监控告警流程打通
- 监控中心
 ![监控中心](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220417-01.png)
 ![监控配置](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220417-02.png)
- 告警历史
 ![告警历史](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220417-03.png)
 ![邮件告警](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220417-04.png)
- 添加设备
  ![添加设备](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-01.png)
- 设备配置
  ![设备配置](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-01.png)
- 设备管理
  ![设备管理](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-03.png)
- webSSH
  ![webSSH](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-04.png)
  ![webSSH](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-05.png)
- 设备基本信息
  ![设备基本信息](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-06.png)
- 设备磁盘信息
  ![设备磁盘信息](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-07.png)
- 设备进程信息
  ![设备进程信息](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-08.png)
- 设备网卡信息
  ![设备网卡信息](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-09.png)
- 设备服务信息
  ![设备服务信息](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-10.png)
- 设备应用信息
  ![设备应用信息](https://gitee.com/zdde/cool-network-system/raw/master/src/assets/cool-20220404-11.png)

## 功能介绍

- 设备监控
- 网络自动发现
- 流量监控

## 运行说明

1.全局安装 ts ts-node

- `npm install -g typescript ts-node`

  2.安装项目依赖

- `npm install`

  3.创建数据库文件

- 在 src 目录下创建 database.ts 文件

```javascript
import { createPool, Pool } from 'mysql2/promise';

export async function connect(): Promise<Pool> {
  const connection = await createPool({
    host: 'ip',
    user: 'root',
    password: '密码',
    database: 'cool_network_sys',
    connectionLimit: 100,
  });
  return connection;
}
```
- 告警配置
- 在 src 目录下创建 alarm-config.ts 文件
```javascript
export default {
  // 邮箱
  qq: {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
      user: 'your email',
      pass: 'your pass'
    }
  },
  // 微信公众号
  wechat: {
    dev_token: 'token',
    APPID: 'appid',
    APPSECRET: 'secret'
  }
}
```
4.启动解释
```javascript
"build": "tsc", // 打包代码生成js，此时会生成dist文件夹，用于start命令
"monitor": "nodemon --watch src/monitor -e ts --exec ts-node src/test/index.ts", 监听monitor文件夹用调试
"test": "nodemon --watch src/test -e ts --exec ts-node src/test/index.ts", 执行测试文件
"dev": "nodemon --watch src/api -e ts --exec ts-node src/api/server.ts", 启动http服务器，此时是作为web项目进行开发
"start": "nodemon ./dist/server.js", 启动构建后的代码
"prod": "npm run build && npm run start" build 和 start的快捷命令
```