export interface CoolCpuRateProps {
  cpu_rate: number;
  last_polled: Date;
  device_id?: string;
}

export interface CoolDiskProps {
  device_id: string;
  disk_path: any;
  disk_size: number;
  disk_used: number;
  last_polled: Date;
}
