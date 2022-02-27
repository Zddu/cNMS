import { DeviceType } from '../../../monitor/types';
import { connect } from '../../../database';
import { getCPU } from './cpu';
import { getPhysisc } from './physisc';
import getMem from './mem';

export default async function linuxInfo() {
  const conn = await connect();
  const devices = (
    await conn.query('select * from cool_devices where type = ?', ['Linux'])
  )[0] as DeviceType[];
  devices.forEach(device => {
    // 获取CPU信息
    getCPU(device);
    // 获取物理设备信息
    getPhysisc(device);
    // 获取内存信息
    getMem(device);
    // 获取硬盘存储信息

    // 获取上下行网络流量信息

    //
  });
}
