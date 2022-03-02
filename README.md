## 进展

- 2022-3-2 基本完成linux服务器数据检测

## 功能介绍

- 网络自动发现
- 流量监控

## 运行说明

1.全局安装ts ts-node

- ``` npm install -g typescript ts-node ```

2.安装项目依赖

- ``` npm install ```

3.创建数据库文件

- 在src目录下创建database.ts文件

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
