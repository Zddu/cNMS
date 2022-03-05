import { DeviceType } from '../../types';
import { getCPU } from './cpu';
import getDisk from './disk';
import getInterface from './interface';
import getMem from './mem';
import getNetworkFlow from './network-flow';
import { getPhysics } from './physics';

export const functionMap = {
  cpu: (device: DeviceType) => getCPU(device),
  mem: (device: DeviceType) => getMem(device),
  disk: (device: DeviceType) => getDisk(device),
  interface: (device: DeviceType) => getInterface(device),
  flow: (device: DeviceType) => getNetworkFlow(device),
  physics: (device: DeviceType) => getPhysics(device),
};
