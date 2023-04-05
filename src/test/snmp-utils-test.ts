import { addHost } from '../add-host';
import { pollLinux } from '../monitor/discover/linux/poll';
import process from '../monitor/discover/linux';

export const jRun = async () => {


  pollLinux();
};
