import { connect } from '../../database';
import { Request } from 'express';
const { Client } = require('ssh2');
const conn = new Client();
let termCols;
let termRows;
let sshConfig: any;

export const handleSSH = (ws, req: Request) => {
  ws.on('message', msg => {
    try {
      console.log('msg', msg);
      // msg = JSON.parse(msg);
      eventHandle(msg);
    } catch (error) {
      ws.send(JSON.stringify({ event: 'error', data: error.message }));
    }
  });
  try {
    conn
      .once('error', err => {
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

function eventHandle(data: string) {
  const wsData = JSON.parse(data || '{}') as { event: string; data: any };
  console.log('wsData', wsData);
  switch (wsData.event) {
    case 'auth':
      sshConfig = {
        host: wsData.data.ip,
        port: wsData.data.port,
        username: wsData.data.username,
        password: wsData.data.password,
        tryKeyboard: true,
      };
      conn.connect({
        host: wsData.data.ip,
        port: wsData.data.port,
        username: wsData.data.username,
        password: wsData.data.password,
        tryKeyboard: true,
      });
    case 'geometry':
      termCols = wsData.data.cols;
      termRows = wsData.data.rows;
  }
}
