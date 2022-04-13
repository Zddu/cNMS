export interface Monitor {
  mission_id?: number;
  mission_name?: string;
  monitor_hosts?: string;
  monitor_type?: string;
  monitor_threshold?: number;
  monitor_note?: string;
  alarm_mode?: string;
  alarm_silent?: number;
  alarm_group?: string;
  monitor_interface?: string;
  monitor_frequency?: number;
  alarm_threshold?: number;
  create_time?: Date;
}

export interface MonitorIndex {
  id?: number;
  monitor_index?: string;
  monitor_name?: string;
  index_type?: number;
}

export interface AlarmMonitor {
  alarm_id?: number;
  mission_name?: string;
  monitor_type?: string;
  monitor_host?: string;
  alarm_status?: number;
  alarm_times?: number;
  alarm_continued?: number;
  alarm_inform_type?: string;
  alarm_inform_target?: string;
  error_info?: string;
  create_time?: Date;
  update_time?: Date;
}

export interface Contact {
  contact_id?: number;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_wechat_token?: string;
  contact_dingtalk_token?: string;
  create_time?: Date;
}
