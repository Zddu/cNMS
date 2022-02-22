import { connect } from '../../../database';

export default (async function linuxInfo() {
  const conn = await connect();
  const device = (await conn.query('select * from cool_devices'))[0];
  console.log(device);
})();
