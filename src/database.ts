import { createPool, Pool } from 'mysql2/promise';

export async function connect(): Promise<Pool> {
  const connection = await createPool({
    host: '47.94.238.68',
    user: 'root',
    password: '',
    database: 'cool_network_sys',
    connectionLimit: 100,
  });
  return connection;
}
