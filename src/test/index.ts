const snmp = require('net-snmp');
const oids = ['1.3.6.1.2.1.4.20.1.1'];

type VarbindsProp = {oid: string; type: number; value: Buffer};

const getOids = ({ip, commity}: {ip: string; commity: string}) => {
  let session = snmp.createSession(ip, commity);

  return new Promise<VarbindsProp[]>((resolve, reject) => {
    session.get(oids, function (error, varbinds: VarbindsProp[]) {
      if (error) {
        reject(error);
      } else {
        resolve(varbinds);
      }
      session.close();
    });
  });
};

getOids({ip: '10.1.1.1', commity: 'public'}).then(res => {
  console.log('res', res[0].value.toString());
});

const getTableOids = ({ip, commity}: {ip: string; commity: string}) => {
  let session = snmp.createSession(ip, commity);

  return new Promise((resolve, reject) => {
    session.table('1.3.6.1.2.1.2.2', 20, function (error, table) {
      if (error) {
        reject(error);
      } else {
        resolve(table);
      }
      session.close();
    });
  });
};
// getTableOids({ip: '10.1.1.1', commity: 'public'}).then(res => {
//   console.log('res', res);
// });

// Default options
var options = {
  port: 162,
  disableAuthorization: false,
  accessControlModelType: snmp.AccessControlModelType.None,
  address: '192.168.199.1',
  transport: 'udp4',
};

var callback = function (error, notification) {
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(notification, null, 2));
  }
};

const receiver = snmp.createReceiver(options, callback);
