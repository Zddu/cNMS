const snmp = require('net-snmp');
const oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

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

getOids({ip: '127.0.0.1', commity: 'public'}).then(res => {
  console.log('res', res[0].value.toString());
});

// var session = snmp.createSession('127.0.0.1', 'public');
// session.get(oids, function (error, varbinds) {
//   if (error) {
//     console.error(error.toString());
//   } else {
//     for (var i = 0; i < varbinds.length; i++) {
//       // for version 1 we can assume all OIDs were successful
//       console.log(varbinds[i].oid + '|' + varbinds[i].value);

//       // for version 2c we must check each OID for an error condition
//       if (snmp.isVarbindError(varbinds[i])) console.error(snmp.varbindError(varbinds[i]));
//       else console.log(varbinds[i].oid + '|' + varbinds[i].value);
//     }
//   }
// });
