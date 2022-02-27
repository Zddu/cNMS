import linuxInfo from '../monitor/discover/linux';
// import { pollLinux } from '../monitor/discover/linux/poll';

export const jRun = async () => {
  // addHost({ ip: '47.94.238.68', port: 161, community: 'public' });
  linuxInfo();
};
