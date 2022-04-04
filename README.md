## 进展

- 2022-3-2 基本完成 linux 服务器数据检测
- 2022-4-4 数据展示
- 添加设备
  ![添加设备](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-01.png)
- 设备配置
  ![设备配置](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-02.png)
- 设备管理
  ![设备管理](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-03.png)
- webSSH
  ![webSSH](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-04.png)
  ![webSSH](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-05.png)
- 设备基本信息
  ![设备基本信息](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-06.png)
- 设备磁盘信息
  ![设备磁盘信息](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-07.png)
- 设备进程信息
  ![设备进程信息](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-08.png)
- 设备网卡信息
  ![设备网卡信息](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-09.png)
- 设备服务信息
  ![设备服务信息](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-10.png)
- 设备应用信息
  ![设备应用信息](https://gitee.com/zdde/cool-network-system/blob/master/src/assets/cool-20220404-11.png)

## 功能介绍

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
