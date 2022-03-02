export type SnmpOptionsType = {
  /**
   * snmp协议端口
   */
  port?: number;

  /**
   * 重试次数
   */
  retries?: number;

  /**
   * 超时时间毫秒
   */
  timeout?: number;

  /**
   * 每次重试时增加 "超时 "的系数
   */
  backoff?: number;

  /**
   * 指定要使用的传输，可以是udp4或udp6，默认为udp4。
   */
  transport?: 'udp4' | 'udp6';

  /**
   * trap port
   */
  trapPort?: number;

  /**
   * snmp.Version1 | snmp.Version2c
   * default: snmpVersion1
   */
  version?: any;

  /**
   * 允许进行GetNext操作的布尔值，以检索词法上在前的OIDs
   */
  backwardsGetNexts?: boolean; //

  /**
   * 16或32，默认为32。用来减少生成的id的大小，以便与一些旧设备兼容。
   */
  idBitsSize?: 16 | 32;
};

export interface DeviceType extends SnmpOptionsType {
  device_id: string;
  /**
   * 设备IP地址
   */
  ip: string;

  /**
   * 设备团体名
   */
  community: string;

  /**
   * 设备端口
   */
  port: number;

  /**
   * 设备别名
   */
  aliasName?: string;
  ssh_enabled?: number;
  snmpver?: string;
  hostname?: string;
  sysName?: string;
  sysDescr?: string;
  sysContact?: string;
  hardware?: string;
  os?: string;
  uptime?: string;
  last_polled?: Date;
  type?: string;
}

export type VarbindsType = { oid: string; type: number; value: Buffer };

export interface Session {
  /**
   * close()方法关闭UDP套接字的底层会话。这将导致会话底层UDP套接字发出 "close "事件，并传递给会话，导致会话也发出 "close "事件。
   */
  close: () => void;

  /**
   * on() 监听事件
   */
  on: (eventName: string, callback: (meta: any) => void) => void;

  /**
   * get() 方法获取一个或多个OID的值。
   */
  get: (oids: string[], callback: (error: Error, varbinds: VarbindsType[]) => void) => void;

  getNext: (oids: string[], callback: (error: Error, varbinds: VarbindsType[]) => void) => void;

  /**
   * table() 方法获取MIB树中以指定的OID为基础的、按词法排列在指定OID之后的所有OID的值。
   */
  table: (oid: string, maxRepetitions?: number, callback?: (error: Error, table: any) => void) => void;

  tableColumns: (oid: string, columns: number[], maxRepetitions?: number, callback?: (error: Error, table: any) => void) => void;

  /**
   * walk()方法获取MIB树中指定的OID之后所有OID的词法值。
   */
  walk: (oid: string, maxRepetitions?: number, feedCallback?: (varbinds: VarbindsType) => void, doneCallback?: (error: Error) => void) => void;
}
