import { createPool, Pool } from 'mysql2/promise';

export async function connect(): Promise<Pool> {
  const connection = await createPool({
    host: '47.94.238.68',
    user: 'root',
    password: '@123456Com',
    database: 'monitorsys',
    connectionLimit: 100,
  });
  return connection;
}
