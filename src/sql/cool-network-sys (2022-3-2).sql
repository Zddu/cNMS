-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: 47.94.238.68    Database: cool_network_sys
-- ------------------------------------------------------
-- Server version	5.7.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cool_cpu_rate`
--

DROP TABLE IF EXISTS `cool_cpu_rate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_cpu_rate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `cpu_rate` double DEFAULT NULL,
  `last_polled` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_devices`
--

DROP TABLE IF EXISTS `cool_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_devices` (
  `device_id` varchar(255) NOT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `community` varchar(100) DEFAULT NULL,
  `port` int(100) DEFAULT NULL,
  `alias_name` varchar(255) DEFAULT NULL,
  `ssh_enabled` tinyint(2) DEFAULT '0',
  `snmpver` varchar(45) NOT NULL,
  `hostname` varchar(255) DEFAULT NULL,
  `sysName` varchar(255) DEFAULT NULL,
  `sysDescr` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `uptime` varchar(255) DEFAULT NULL,
  `last_polled` datetime NOT NULL,
  `type` varchar(45) NOT NULL,
  `sysContact` mediumtext,
  PRIMARY KEY (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_disk`
--

DROP TABLE IF EXISTS `cool_disk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_disk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `disk_path` varchar(255) DEFAULT NULL,
  `disk_size` varchar(10) DEFAULT NULL,
  `disk_used` varchar(10) DEFAULT NULL,
  `last_polled` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_mem_rate`
--

DROP TABLE IF EXISTS `cool_mem_rate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_mem_rate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `mem_usage` varchar(45) NOT NULL,
  `last_polled` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_mibs`
--

DROP TABLE IF EXISTS `cool_mibs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_mibs` (
  `oid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `module_name` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_network_flow`
--

DROP TABLE IF EXISTS `cool_network_flow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_network_flow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `physics_if_name` varchar(255) NOT NULL,
  `inflow_rate` varchar(45) NOT NULL,
  `outflow_rate` varchar(45) NOT NULL,
  `in_discards_rate` double DEFAULT NULL,
  `out_discards_rate` double DEFAULT NULL,
  `in_error_rate` double DEFAULT NULL,
  `out_error_rate` double DEFAULT NULL,
  `if_status` varchar(45) DEFAULT NULL,
  `last_polled` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_physics`
--

DROP TABLE IF EXISTS `cool_physics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_physics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `cpu_number` int(11) NOT NULL,
  `inter_number` int(11) DEFAULT NULL,
  `last_polled` datetime NOT NULL,
  `mem_total_size` varchar(45) DEFAULT NULL,
  `disk_total_size` varchar(45) DEFAULT NULL,
  `cpu_model` text,
  `inter_model` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_physics_inter`
--

DROP TABLE IF EXISTS `cool_physics_inter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_physics_inter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `physics_if_name` varchar(45) NOT NULL,
  `physics_if_type` varchar(45) DEFAULT NULL,
  `physics_if_mac` varchar(45) DEFAULT NULL,
  `physics_if_admin_status` varchar(2) DEFAULT NULL,
  `physics_if_ip_address` varchar(45) DEFAULT NULL,
  `physics_if_ip_mask` varchar(45) DEFAULT NULL,
  `last_polled` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cool_user`
--

DROP TABLE IF EXISTS `cool_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cool_user` (
  `user_id` varchar(255) NOT NULL COMMENT '用户id',
  `user_name` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-02 15:03:39
