/*
 Navicat Premium Data Transfer

 Source Server         : huawei
 Source Server Type    : MySQL
 Source Server Version : 50732
 Source Host           : 124.71.7.170:8082
 Source Schema         : crm

 Target Server Type    : MySQL
 Target Server Version : 50732
 File Encoding         : 65001

 Date: 11/08/2021 18:12:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for data_admin_info
-- ----------------------------
DROP TABLE IF EXISTS `data_admin_info`;
CREATE TABLE `data_admin_info` (
  `admin_guid` char(32) NOT NULL DEFAULT '-' COMMENT 'admin表唯一id',
  `nick_name` varchar(32) NOT NULL DEFAULT '-' COMMENT '昵称',
  `phone` char(11) NOT NULL DEFAULT '-' COMMENT '手机号',
  `avatar` varchar(64) NOT NULL COMMENT '头像'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for data_admin_login
-- ----------------------------
DROP TABLE IF EXISTS `data_admin_login`;
CREATE TABLE `data_admin_login` (
  `guid` char(32) NOT NULL,
  `user_name` varchar(32) NOT NULL DEFAULT '-' COMMENT '账户名称',
  `password` char(32) NOT NULL DEFAULT '-' COMMENT '密码',
  `salt` char(32) NOT NULL DEFAULT '-' COMMENT '密码盐',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 正常 2冻结',
  `token` char(32) NOT NULL DEFAULT '-' COMMENT 'token',
  `token_time` int(11) NOT NULL DEFAULT '0' COMMENT 'token超时时间(30天后)',
  `add_time` int(11) NOT NULL DEFAULT '0' COMMENT '注册时间',
  `last_time` int(11) NOT NULL COMMENT '最后登录时间',
  `last_ip` varchar(15) NOT NULL DEFAULT '-' COMMENT '最后登录ip',
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for data_customer
-- ----------------------------
DROP TABLE IF EXISTS `data_customer`;
CREATE TABLE `data_customer` (
  `guid` char(32) NOT NULL DEFAULT '-',
  `type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1企业 2个人',
  `customer_name` varchar(32) NOT NULL DEFAULT '-' COMMENT '客户名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1未跟进 2已跟进 3已成交',
  `add_staff` char(32) NOT NULL DEFAULT '-' COMMENT '添加人guid',
  `add_time` int(11) NOT NULL DEFAULT '0' COMMENT '添加时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for data_customer_link
-- ----------------------------
DROP TABLE IF EXISTS `data_customer_link`;
CREATE TABLE `data_customer_link` (
  `guid` char(32) NOT NULL DEFAULT '-',
  `name` varchar(32) NOT NULL COMMENT '联系人名称',
  `phone` char(11) NOT NULL DEFAULT '-' COMMENT '手机号',
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1男  2女',
  `birthday` datetime NOT NULL COMMENT '出生年月',
  `email` varchar(64) NOT NULL COMMENT '电子邮箱',
  `city` varchar(64) NOT NULL COMMENT '城市三级联动',
  `address` varchar(64) NOT NULL COMMENT '地址详情',
  `add_staff` char(32) NOT NULL COMMENT '操作人id',
  `add_time` int(11) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for log_customer_consult
-- ----------------------------
DROP TABLE IF EXISTS `log_customer_consult`;
CREATE TABLE `log_customer_consult` (
  `id` int(11) NOT NULL,
  `customer_guid` char(32) NOT NULL COMMENT '客户唯一id',
  `duration` int(3) NOT NULL DEFAULT '1' COMMENT '时长',
  `content` varchar(255) NOT NULL DEFAULT '-' COMMENT '内容',
  `remark` varchar(255) NOT NULL DEFAULT '-' COMMENT '备注',
  `add_staff` char(32) NOT NULL COMMENT '添加人唯一id',
  `add_time` int(11) NOT NULL DEFAULT '0' COMMENT '添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for rel_customer_link
-- ----------------------------
DROP TABLE IF EXISTS `rel_customer_link`;
CREATE TABLE `rel_customer_link` (
  `customer_guid` char(32) NOT NULL,
  `link_guid` char(32) NOT NULL,
  PRIMARY KEY (`customer_guid`,`link_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
