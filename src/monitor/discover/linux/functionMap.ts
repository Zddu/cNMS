import { Pool } from 'mysql2/promise';
import { DeviceType } from '../../types';
import { getCPU } from './cpu';
import getDisk from './disk';
import getInterface from './interface';
import getMem from './mem';
import getNetworkFlow from './network-flow';
import { getPhysics } from './physics';

export const functionMap = {
  cpu: (device: DeviceType, conn: Pool) => getCPU(device, conn),
  mem: (device: DeviceType, conn: Pool) => getMem(device, conn),
  disk: (device: DeviceType, conn: Pool) => getDisk(device, conn),
  interface: (device: DeviceType, conn: Pool) => getInterface(device, conn),
  flow: (device: DeviceType, conn: Pool) => getNetworkFlow(device, conn),
  physics: (device: DeviceType, conn: Pool) => getPhysics(device, conn),
};
