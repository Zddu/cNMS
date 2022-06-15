import { DeviceType } from './monitor/types';
import { randomUUID } from 'crypto';
import DeviceConfig from './default.config';
import { getCPU } from './monitor/discover/linux/cpu';
import { connect } from './database';
import getMem from './monitor/discover/linux/mem';

export const timeticksTohour = (ticks: number) => {
  const seconds = ticks / 100;
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds / 3600 - hour) * 60);
  const second = seconds % 60;

  return hour + ':' + pad2(minute) + ':' + pad2(second);
};

export const pad2 = (number: number) => {
  const num: string = '0' + number;
  return num.substring(num.length - 2);
};

export function uuid() {
  return randomUUID().replace(/-/g, '');
}

export function timesInterval(times: number, ms: number, cb) {
  let init = 0;
  cb();
  const timer = setInterval(() => {
    init++;
    cb();
    console.log('init', init);
    if (init === times - 1) {
      clearInterval(timer);
    }
  }, ms);
}

export function objBuffer2String(obj: object, except?: string[], codeMap?: Record<string, string>) {
  if (isObj(obj)) {
    Object.keys(obj).forEach(k => {
      if (isObj(obj[k])) {
        Object.keys(obj[k]).forEach(v => {
          if (!except?.includes(v) && Buffer.isBuffer(obj[k][v])) {
            if (codeMap?.[v]) {
              obj[k][v] = obj[k][v].toString(codeMap?.[v]);
            } else {
              obj[k][v] = obj[k][v].toString();
            }
          }
        });
      }
    });
  }
  if (isArray(obj)) {
    const arr = obj as any[];
    arr.forEach(v => {
      if (Buffer.isBuffer(v.value)) {
        v.value = v.value.toString();
      }
    });
  }
  return obj;
}

export function isObj(obj: object) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isArray(arr: object) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

export function isNumber(val: any) {
  return typeof val === 'number' && !isNaN(val);
}

export function bytesToReadable(bytes: number, n = 2) {
  const GB = bytes / (1024 * 1024 * 1024);

  if (GB > 1) {
    return formatFloat(GB, n) + ' GB';
  } else {
    const MB = bytes / (1024 * 1024);
    return formatFloat(MB, n) + ' MB';
  }
}

export function bitsToReadable(bits: number, n: number, unit: string) {
  const UNIT_MAP = {
    b: bits,
    B: bits / 8,
    Kb: bits / 1024,
    KB: bits / 8 / 1024,
    Mb: bits / (1024 * 1024),
    MB: bits / 8 / (1024 * 1024),
    Gb: bits / (1024 * 1024 * 1024),
    GB: bits / 8 / (1024 * 1024 * 1024),
  };
  return formatFloat(UNIT_MAP[unit], n);
}

export function formatFloat(value: number, n: number) {
  const f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
  let s = f.toString();
  const rs = s.indexOf('.');
  if (rs < 0) {
    s += '.';
  }
  for (var i = s.length - s.indexOf('.'); i <= n; i++) {
    s += '0';
  }
  return Number(s);
}

export function strSplice(str: string, count: number, splitChar: string) {
  let arr: string[] = [];
  for (let i = 0, len = str.length / count; i < len; i++) {
    let subStr = str.substring(0, count);
    arr.push(subStr);
    str = str.replace(subStr, '');
  }

  return arr.join(splitChar);
}

export function mergeDeviceConfig(device: DeviceType) {
  ['ip', 'snmpver', 'port', 'community'].forEach(k => {
    !device[k] && (device[k] = DeviceConfig.device[k]);
  });
}

export function dynamicQueryParams<T>(query: T) {
  const sqlValues = Object.values(query);
  let sqlText = '';
  Object.keys(query || {}).forEach(k => {
    sqlText += `${k} = ?,`;
  });
  sqlText = sqlText.replace(/,$/gi, '');

  return {
    sqlText,
    sqlValues,
  };
}

export function parserHtml(tpl: string, data: any) {
  var reg = /{{(.+?)}}/g;
  var match;
  while ((match = reg.exec(tpl))) {
    tpl = tpl.replace(match[0], data[match[1]]);
  }
  return tpl;
}

export async function generateTopologyModel(devices: DeviceType[]) {
  const conn = await connect()
  const data: Record<string, any> = {
    nodes: [],
    edges: []
  };
  for (let i = 0; i < devices.length; i++) {
    data.nodes.push({
      id: devices[i].device_id,
      label: devices[i].type,
      ip: devices[i].ip,
      data: {
        cpu: (await conn.query('select cpu_rate from cool_cpu_rate where device_id = ? group by id desc', [devices[i].device_id]))[0][0],
        mem: (await conn.query('select mem_usage from cool_mem_rate where device_id = ? group by id desc', [devices[i].device_id]))[0][0],
        ...devices[i]
      }
    })
  }

  if (devices.length >= 2) {
    data.edges.push({
      source: devices[0].device_id,
      target: devices[1].device_id
    })
  }


  return data;
}