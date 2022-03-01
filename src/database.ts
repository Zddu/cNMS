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
