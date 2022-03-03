import { DeviceType } from '../../../monitor/types';
import { connect } from '../../../database';
import { getCPU } from './cpu';
import { getPhysics } from './physics';
import getMem from './mem';
import getDisk from './disk';
import getInterface from './interface';
import getNetworkFlow from './network-flow';

export default async function linuxInfo() {
  const conn = await connect();
  const devices = (await conn.query('select * from cool_devices where os = ?', ['Linux']))[0] as DeviceType[];
  devices.forEach(device => {
    // 获取CPU信息
    getCPU(device);
    // 获取接口信息
    getInterface(device);
    // 获取物理设备信息
    getPhysics(device);
    // 获取内存信息
    getMem(device);
    // 获取硬盘存储信息
    getDisk(device);
    // 获取网络流量信息
    getNetworkFlow(device);
  });
}
