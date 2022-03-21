import { connect } from '../../database';
import { Request } from 'express';
import squel from 'squel';
const { Client } = require('ssh2');
const conn = new Client();
let termCols;
let termRows;

export const handleSSH = (ws, req: Request) => {
  ws.on('message', async msg => {
    try {
      await eventHandle(msg);
    } catch (error) {
      ws.send(JSON.stringify({ event: 'error', data: error.message }));
    }
  });
  try {
    conn
      .once('error', err => {
        console.log('shell err level', err.level);
        console.log('shell err message', err.message);
        if (err && err.level === 'client-authentication') {
          ws.send(JSON.stringify({ event: 'reauth', data: err.message }));
        } else {
          ws.send(JSON.stringify({ event: 'error', data: err.message }));
        }
        conn.end();
      })
      .once('ready', () => {
        conn.shell(
          {
            term: 'xterm-color',
            cols: termCols,
            rows: termRows,
          },
          (err, stream) => {
            if (err) throw err;
            ws.on('message', msg => {
              if (msg) {
                msg = JSON.parse(msg);
                if (msg.event === 'data') {
                  stream.write(msg.data);
                }
              }
            });
            stream.on('close', (code, signal) => {
              ws.send(JSON.stringify({ event: 'close', data: 'close' }));
              conn.end();
            });

            stream.on('data', data => {
              ws.send(JSON.stringify({ event: 'data', data: data.toString('utf-8') }));
            });

            stream.on('error', err => {
              ws.send(JSON.stringify({ event: 'error', data: err.message }));
            });

            stream.stderr.on('data', data => {
              console.error(`STDERR: ${data}`);
            });
          }
        );
      });
  } catch (error) {
    ws.send(JSON.stringify({ event: 'error', data: (error as Error).message }));
  }
};

async function eventHandle(data: string) {
  const wsData = JSON.parse(data || '{}') as { event: string; data: any };
  console.log('wsData', wsData);
  switch (wsData.event) {
    case 'auth':
      const sshConfig = {
        host: wsData.data.ip,
        port: wsData.data.port,
        username: wsData.data.username,
        password: wsData.data.password,
        tryKeyboard: true,
      };
      const sqlSession = await connect();
      const ssh = (await sqlSession.query('select * from cool_ssh where device_id = ?', [wsData.data.device_id]))[0];
      const update = squel
        .update()
        .table('cool_ssh')
        .setFields({
          port: wsData.data.port,
          username: wsData.data.username,
          password: wsData.data.password,
        })
        .where(`device_id = ?`, wsData.data.device_id)
        .toString();
      const insert = squel
        .insert()
        .into('cool_ssh')
        .setFields({
          device_id: wsData.data.device_id,
          port: wsData.data.port,
          username: wsData.data.username,
          password: wsData.data.password,
        })
        .toString();
      if (!ssh[0]) {
        await sqlSession.query(insert);
      } else {
        await sqlSession.query(update);
      }
      sqlSession.end();
      conn.connect(sshConfig);
    case 'geometry':
      termCols = wsData.data.cols;
      termRows = wsData.data.rows;
  }
}
