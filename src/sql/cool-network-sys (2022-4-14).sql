/*
 Navicat Premium Data Transfer

 Source Server         : 腾讯云
 Source Server Type    : MySQL
 Source Server Version : 50737
 Source Host           : 82.157.237.245:3306
 Source Schema         : cool-network-sys

 Target Server Type    : MySQL
 Target Server Version : 50737
 File Encoding         : 65001

 Date: 17/04/2022 12:17:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cool_alarm
-- ----------------------------
DROP TABLE IF EXISTS `cool_alarm`;
CREATE TABLE `cool_alarm`  (
  `alarm_id` int(11) NOT NULL AUTO_INCREMENT,
  `mission_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monitor_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monitor_host` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `alarm_status` int(11) NOT NULL,
  `alarm_continued` int(11) NOT NULL,
  `alarm_inform_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `alarm_inform_target` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `error_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `alarm_times` int(11) NULL DEFAULT NULL,
  `create_time` datetime(0) NOT NULL,
  `update_time` datetime(0) NOT NULL,
  PRIMARY KEY (`alarm_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_alarm_contacts
-- ----------------------------
DROP TABLE IF EXISTS `cool_alarm_contacts`;
CREATE TABLE `cool_alarm_contacts`  (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contact_phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `contact_email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contact_wechat_token` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `contact_dingtalk_token` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` datetime(0) NOT NULL,
  PRIMARY KEY (`contact_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_alarm_group
-- ----------------------------
DROP TABLE IF EXISTS `cool_alarm_group`;
CREATE TABLE `cool_alarm_group`  (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `group_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `create_time` datetime(0) NOT NULL,
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_contacts_group
-- ----------------------------
DROP TABLE IF EXISTS `cool_contacts_group`;
CREATE TABLE `cool_contacts_group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_cpu_rate
-- ----------------------------
DROP TABLE IF EXISTS `cool_cpu_rate`;
CREATE TABLE `cool_cpu_rate`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cpu_rate` double NULL DEFAULT NULL,
  `last_polled` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1293 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_device_config
-- ----------------------------
DROP TABLE IF EXISTS `cool_device_config`;
CREATE TABLE `cool_device_config`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `device_config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_polled` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_devices
-- ----------------------------
DROP TABLE IF EXISTS `cool_devices`;
CREATE TABLE `cool_devices`  (
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `community` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `port` int(100) NULL DEFAULT NULL,
  `alias_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ssh_enabled` tinyint(2) NULL DEFAULT 0,
  `snmpver` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hostname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sysName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sysDescr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `os` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `uptime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_polled` datetime(0) NOT NULL,
  `type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sysContact` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`device_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_disk
-- ----------------------------
DROP TABLE IF EXISTS `cool_disk`;
CREATE TABLE `cool_disk`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `disk_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `disk_size` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `disk_used` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_polled` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_mem_rate
-- ----------------------------
DROP TABLE IF EXISTS `cool_mem_rate`;
CREATE TABLE `cool_mem_rate`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mem_usage` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_polled` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1237 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_mibs
-- ----------------------------
DROP TABLE IF EXISTS `cool_mibs`;
CREATE TABLE `cool_mibs`  (
  `oid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `module_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`oid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_monitor
-- ----------------------------
DROP TABLE IF EXISTS `cool_monitor`;
CREATE TABLE `cool_monitor`  (
  `mission_id` int(11) NOT NULL AUTO_INCREMENT,
  `monitor_hosts` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monitor_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monitor_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `alarm_group` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `alarm_mode` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `alarm_silent` int(10) NOT NULL,
  `monitor_frequency` int(10) NOT NULL,
  `monitor_threshold` int(10) NULL DEFAULT NULL,
  `monitor_interface` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `mission_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `alarm_threshold` int(11) NOT NULL,
  `create_time` datetime(0) NOT NULL,
  PRIMARY KEY (`mission_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_monitor_index
-- ----------------------------
DROP TABLE IF EXISTS `cool_monitor_index`;
CREATE TABLE `cool_monitor_index`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `monitor_index` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `monitor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `index_type` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_network_flow
-- ----------------------------
DROP TABLE IF EXISTS `cool_network_flow`;
CREATE TABLE `cool_network_flow`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `physics_if_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `inflow_rate` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `outflow_rate` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `in_discards_rate` double NULL DEFAULT NULL,
  `out_discards_rate` double NULL DEFAULT NULL,
  `in_error_rate` double NULL DEFAULT NULL,
  `out_error_rate` double NULL DEFAULT NULL,
  `if_status` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_polled` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1573 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_physics
-- ----------------------------
DROP TABLE IF EXISTS `cool_physics`;
CREATE TABLE `cool_physics`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cpu_number` int(11) NOT NULL,
  `inter_number` int(11) NULL DEFAULT NULL,
  `last_polled` datetime(0) NOT NULL,
  `mem_total_size` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `disk_total_size` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `cpu_model` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `inter_model` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 225 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_physics_inter
-- ----------------------------
DROP TABLE IF EXISTS `cool_physics_inter`;
CREATE TABLE `cool_physics_inter`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `physics_if_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `physics_if_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `physics_if_mac` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `physics_if_operation_status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `physics_if_admin_status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `physics_if_ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `physics_if_ip_mask` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `physics_if_speed` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_polled` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 594 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_ssh
-- ----------------------------
DROP TABLE IF EXISTS `cool_ssh`;
CREATE TABLE `cool_ssh`  (
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `port` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`device_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cool_user
-- ----------------------------
DROP TABLE IF EXISTS `cool_user`;
CREATE TABLE `cool_user`  (
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户id',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
