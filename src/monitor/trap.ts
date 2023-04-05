import { isObj } from "common";
import { connect } from "database";

const snmp = require('net-snmp');

const options = {
  port: 162,
  disableAuthorization: false,
  includeAuthentication: false,
  accessControlModelType: snmp.AccessControlModelType.None,
  address: null,
  transport: "udp4"
};

let callback = function (error, notification) {
  if (error) {
    console.error(error);
  } else {
    hanldeTrap(notification);
  }
};

export const receiver = snmp.createReceiver(options, callback);

async function hanldeTrap(notification: any) {
  const conn = await connect();

  if (isObj(notification) && notification.pdu) {
    notification.pdu.varbinds.forEach(async v => {
      await conn.query('insert into cool_trap set ?', [{ v }])
    });
  }
}