CREATE DATABASE  IF NOT EXISTS `parttimejob` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `parttimejob`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: parttimejob
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `employers`
--

DROP TABLE IF EXISTS `employers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employers` (
  `employer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `email_contact` varchar(255) DEFAULT NULL,
  `phone_contact` varchar(255) DEFAULT NULL,
  `description` text,
  `website` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employer_id`),
  UNIQUE KEY `uq_employers_user_id` (`user_id`),
  KEY `idx_employers_company_name` (`company_name`),
  KEY `idx_employers_status` (`status`),
  CONSTRAINT `fk_employers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_employers_status` CHECK ((`status` in (_utf8mb4'ACTIVE',_utf8mb4'SUSPENDED',_utf8mb4'INACTIVE')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employers`
--

LOCK TABLES `employers` WRITE;
/*!40000 ALTER TABLE `employers` DISABLE KEYS */;
INSERT INTO `employers` VALUES (1,3,'ThanhMiLa Group','Cafe','hr@thanhmiucoffee.vn','0763769325','Chuoi quan cafe tuyen part-time cho sinh vien','https://thanhmiucoffee.vn','ACTIVE','2026-03-14 02:19:22','2026-03-25 00:44:00');
/*!40000 ALTER TABLE `employers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employment_records`
--

DROP TABLE IF EXISTS `employment_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employment_records` (
  `employment_record_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `job_post_id` int DEFAULT NULL,
  `application_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `work_status` varchar(255) NOT NULL,
  `verified_by_employer_id` int DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `note` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employment_record_id`),
  KEY `idx_employment_records_user_id` (`user_id`),
  KEY `idx_employment_records_store_id` (`store_id`),
  KEY `idx_employment_records_job_post_id` (`job_post_id`),
  KEY `idx_employment_records_application_id` (`application_id`),
  KEY `idx_employment_records_verified_by_employer_id` (`verified_by_employer_id`),
  KEY `idx_employment_records_work_status` (`work_status`),
  KEY `idx_employment_records_start_date` (`start_date`),
  KEY `idx_employment_records_end_date` (`end_date`),
  KEY `idx_employment_records_user_store` (`user_id`,`store_id`),
  CONSTRAINT `fk_employment_records_application` FOREIGN KEY (`application_id`) REFERENCES `job_applications` (`application_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_employment_records_job_post` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_employment_records_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_employment_records_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_employment_records_verified_by_employer` FOREIGN KEY (`verified_by_employer_id`) REFERENCES `employers` (`employer_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_employment_records_date_range` CHECK (((`end_date` is null) or (`start_date` is null) or (`end_date` >= `start_date`))),
  CONSTRAINT `chk_employment_records_work_status` CHECK ((`work_status` in (_utf8mb4'HIRED',_utf8mb4'WORKING',_utf8mb4'COMPLETED',_utf8mb4'QUIT',_utf8mb4'TERMINATED')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employment_records`
--

LOCK TABLES `employment_records` WRITE;
/*!40000 ALTER TABLE `employment_records` DISABLE KEYS */;
INSERT INTO `employment_records` VALUES (10,6,13,13,23,'2026-03-25',NULL,'HIRED',1,'2026-03-25 02:40:31',NULL,'2026-03-25 02:40:31'),(11,6,11,11,24,'2026-03-25',NULL,'HIRED',1,'2026-03-25 02:49:40',NULL,'2026-03-25 02:49:40'),(12,6,15,15,25,'2026-03-25',NULL,'HIRED',1,'2026-03-25 02:54:10',NULL,'2026-03-25 02:54:10'),(13,6,15,15,25,'2026-03-25',NULL,'HIRED',1,'2026-03-25 02:55:16',NULL,'2026-03-25 02:55:16'),(14,6,15,15,25,'2026-03-25',NULL,'HIRED',1,'2026-03-25 03:00:15',NULL,'2026-03-25 03:00:15'),(15,8,11,11,26,'2026-03-27',NULL,'HIRED',1,'2026-03-27 16:01:43',NULL,'2026-03-27 16:01:43');
/*!40000 ALTER TABLE `employment_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invalidated_token`
--

DROP TABLE IF EXISTS `invalidated_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidated_token` (
  `jti` varchar(255) NOT NULL,
  `expiry_time` datetime NOT NULL,
  PRIMARY KEY (`jti`),
  KEY `idx_invalidated_token_expiry_time` (`expiry_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invalidated_token`
--

LOCK TABLES `invalidated_token` WRITE;
/*!40000 ALTER TABLE `invalidated_token` DISABLE KEYS */;
INSERT INTO `invalidated_token` VALUES ('2512538c-d09f-48fb-99d6-6dd4719cb0c5','2026-03-25 01:42:23'),('2b9dbdbc-0775-4d88-980e-4b9e8e5f236f','2026-03-25 01:56:31'),('9e75e516-78e1-4499-aa52-5efd5d9adc67','2026-03-25 02:19:58'),('56f6aa62-81d2-48ec-a7ad-6cb9bb1678db','2026-03-25 02:21:13'),('e4967711-05a4-4d23-919d-8b8474bde258','2026-03-25 02:39:47'),('7f1a1a80-39aa-4e7e-aecd-49e8bc6dc136','2026-03-25 02:54:14'),('4249fdd2-68b4-4fd4-aaa1-ae3310b11f5c','2026-03-25 03:02:06'),('6e8ef842-fd1b-43ca-b183-900a95682ac9','2026-03-25 03:37:37'),('fa5c98a4-a494-4203-a6e6-273d4fcc0bb9','2026-03-25 14:09:30'),('9da3c4e8-fb48-4471-aa43-d3763c24ac76','2026-03-25 14:12:49'),('e486ac56-c382-477e-80d4-1b08dd5f16b7','2026-03-25 15:13:15'),('e5117695-a544-4720-9bf9-5b4fe65dc159','2026-03-25 15:18:17'),('21b3acae-e7dd-403d-a4d0-3828d1dc15b9','2026-03-25 15:34:17'),('6c6181ff-4257-418a-afc9-e8236341f1fc','2026-03-27 15:20:15'),('e19aa774-14bd-4a31-b845-78edbd5da820','2026-03-27 15:20:32'),('6a0d14ca-7438-4338-bb40-bf1a229aa847','2026-03-27 16:20:45'),('8ae8c622-400e-4393-a713-d72351788503','2026-03-27 17:01:15'),('9a6edd31-04db-4ddf-8ff4-3a99d29c8bf9','2026-03-27 17:25:34'),('a076f294-9748-41e0-b40d-e6ef067912a1','2026-05-22 23:27:00'),('7f7a0239-03ef-45a9-a290-c1543f927af6','2026-05-26 12:32:41');
/*!40000 ALTER TABLE `invalidated_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `job_post_id` int NOT NULL,
  `applicant_user_id` int NOT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `note` text,
  `status` varchar(255) NOT NULL,
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `uq_job_applications_job_post_applicant` (`job_post_id`,`applicant_user_id`),
  KEY `idx_job_applications_applicant_user_id` (`applicant_user_id`),
  KEY `idx_job_applications_status` (`status`),
  KEY `idx_job_applications_applied_at` (`applied_at`),
  CONSTRAINT `fk_job_applications_applicant_user` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_job_applications_job_post` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_job_applications_status` CHECK ((`status` in (_utf8mb4'PENDING',_utf8mb4'ACCEPTED',_utf8mb4'REJECTED')))
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (23,13,6,'0708177837','Em có thể làm được ca tối','REJECTED','2026-03-25 02:40:07','2026-03-25 02:42:11'),(24,11,6,'0905628618','','ACCEPTED','2026-03-25 02:49:27','2026-03-25 02:49:40'),(25,15,6,'0817 857 816','','ACCEPTED','2026-03-25 02:53:57','2026-03-25 03:00:15'),(26,11,8,'0905628618','','REJECTED','2026-03-27 16:01:08','2026-03-27 16:03:48');
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_categories`
--

DROP TABLE IF EXISTS `job_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_job_categories_category_name` (`category_name`),
  UNIQUE KEY `uq_job_categories_slug` (`slug`),
  KEY `idx_job_categories_is_active` (`is_active`),
  KEY `idx_job_categories_sort_order` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_categories`
--

LOCK TABLES `job_categories` WRITE;
/*!40000 ALTER TABLE `job_categories` DISABLE KEYS */;
INSERT INTO `job_categories` VALUES (1,'Phục vụ','phuc-vu','Các công việc phục vụ khách hàng tại quán, nhà hàng, cafe',1,1),(2,'Pha chế','pha-che','Các công việc pha chế đồ uống, trà sữa, cafe',1,2),(3,'Phụ bếp','phu-bep','Các công việc sơ chế, hỗ trợ bếp, chuẩn bị món ăn',1,3),(4,'Bán hàng','ban-hang','Các công việc tư vấn bán hàng tại cửa hàng, showroom',1,4),(5,'Thu ngân','thu-ngan','Các công việc thanh toán, hỗ trợ thu ngân tại quầy',1,5),(6,'Nhân viên cửa hàng tiện ích / quầy hàng','nhan-vien-cua-hang-quay-hang','Các công việc tại quầy hàng, gian hàng trong trung tâm thương mại',1,6),(7,'Nhà hàng - khách sạn','nha-hang-khach-san','Các công việc part-time trong lĩnh vực nhà hàng và dịch vụ ăn uống',1,7),(8,'Cafe - trà sữa','cafe-tra-sua','Các công việc tại quán cafe, trà sữa, đồ uống',1,8),(9,'Bếp - bánh','bep-banh','Các công việc phụ bếp, làm bánh, hỗ trợ bếp bánh',1,9),(10,'Bán lẻ - thời trang','ban-le-thoi-trang','Các công việc bán lẻ, thời trang, phụ kiện, trang sức',1,10),(11,'Giữ xe','giu-xe','Các công việc hỗ trợ giữ xe, trông xe cho khách',1,11),(12,'Đồ ăn nhanh / take-away','do-an-nhanh-take-away','Các công việc tại mô hình phục vụ nhanh, mang đi',1,12),(13,'Trợ lý quầy / hỗ trợ vận hành','tro-ly-quay-ho-tro-van-hanh','Các công việc hỗ trợ vận hành quầy, chuẩn bị hàng hóa, vệ sinh, sắp xếp',1,13),(14,'Chăm sóc khách hàng trực tiếp','cham-soc-khach-hang-truc-tiep','Các công việc tiếp xúc và hỗ trợ khách hàng trực tiếp tại cửa hàng',1,14),(15,'Part-time sinh viên','part-time-sinh-vien','Các công việc làm thêm phù hợp cho học sinh, sinh viên',1,15);
/*!40000 ALTER TABLE `job_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_post_categories`
--

DROP TABLE IF EXISTS `job_post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_post_categories` (
  `job_post_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`job_post_id`,`category_id`),
  KEY `idx_job_post_categories_category_id` (`category_id`),
  CONSTRAINT `fk_job_post_categories_category` FOREIGN KEY (`category_id`) REFERENCES `job_categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_job_post_categories_job_post` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_post_categories`
--

LOCK TABLES `job_post_categories` WRITE;
/*!40000 ALTER TABLE `job_post_categories` DISABLE KEYS */;
INSERT INTO `job_post_categories` VALUES (2,1),(3,1),(4,1),(5,1),(9,1),(12,1),(13,1),(14,1),(15,1),(3,2),(6,2),(7,2),(15,2),(1,3),(5,3),(8,3),(10,4),(11,4),(6,5),(11,6),(2,7),(4,7),(5,7),(8,7),(9,7),(13,7),(3,8),(6,8),(7,8),(12,8),(15,8),(1,9),(10,10),(11,10),(14,11),(6,12),(7,13),(11,13),(2,14),(4,14),(9,14),(10,14),(12,14),(13,14),(14,14),(15,14),(1,15),(2,15),(3,15),(4,15),(5,15),(6,15),(7,15),(8,15),(9,15),(10,15),(11,15),(12,15),(13,15),(14,15),(15,15);
/*!40000 ALTER TABLE `job_post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_post_images`
--

DROP TABLE IF EXISTS `job_post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_post_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `job_post_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `uploaded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `idx_job_post_images_job_post_id` (`job_post_id`),
  KEY `idx_job_post_images_sort_order` (`sort_order`),
  CONSTRAINT `fk_job_post_images_job_post` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_post_images`
--

LOCK TABLES `job_post_images` WRITE;
/*!40000 ALTER TABLE `job_post_images` DISABLE KEYS */;
INSERT INTO `job_post_images` VALUES (9,1,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380490/1_1_pdoe3k.png',1,'2026-03-25 02:35:15'),(10,1,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380490/1_2_q6uni6.png',2,'2026-03-25 02:35:15'),(11,2,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380488/2_1_fgiq8p.png',1,'2026-03-25 02:35:15'),(12,2,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380486/2_2_q9vpst.png',2,'2026-03-25 02:35:15'),(13,2,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380484/2_3_jllwor.png',3,'2026-03-25 02:35:15'),(14,3,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380486/3_1_j8wofc.png',1,'2026-03-25 02:35:15'),(15,3,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380491/3_2_r5djwp.png',2,'2026-03-25 02:35:15'),(16,4,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380480/4_1_cdslhi.png',1,'2026-03-25 02:35:15'),(17,4,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380480/4_2_ihgyl9.png',2,'2026-03-25 02:35:15'),(18,4,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380480/4_3_ellhez.png',3,'2026-03-25 02:35:15'),(19,5,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380492/5_1_ibttuv.png',1,'2026-03-25 02:35:15'),(20,5,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380492/5_2_ehdbgd.png',2,'2026-03-25 02:35:15'),(21,5,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380492/5_3_oqe5sh.png',3,'2026-03-25 02:35:15'),(22,6,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380492/6_1_urnfuu.png',1,'2026-03-25 02:35:15'),(23,7,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380495/7_1_qyadt4.png',1,'2026-03-25 02:35:15'),(24,8,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380489/8_1_ldljqq.png',1,'2026-03-25 02:35:15'),(25,9,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380490/9_1_blnnxe.png',1,'2026-03-25 02:35:15'),(26,10,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380487/10_1_g6xuxz.png',1,'2026-03-25 02:35:15'),(27,11,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380484/11_1_bz7bz7.png',1,'2026-03-25 02:35:15'),(28,11,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380485/11_2_mjkjdk.png',2,'2026-03-25 02:35:15'),(29,12,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380486/12_1_e7vv7f.png',1,'2026-03-25 02:35:15'),(30,13,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380492/13_1_zjaimm.png',1,'2026-03-25 02:35:15'),(31,13,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380482/13_2_irotii.png',2,'2026-03-25 02:35:15'),(32,14,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380481/14_1_mn9unt.png',1,'2026-03-25 02:35:15'),(33,15,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380481/15_1_zeydce.png',1,'2026-03-25 02:35:15'),(34,15,'https://res.cloudinary.com/depjjczfh/image/upload/v1774380480/15_2_xf6s1v.png',2,'2026-03-25 02:35:15');
/*!40000 ALTER TABLE `job_post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_post_shifts`
--

DROP TABLE IF EXISTS `job_post_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_post_shifts` (
  `job_post_id` int NOT NULL,
  `shift_id` int NOT NULL,
  PRIMARY KEY (`job_post_id`,`shift_id`),
  KEY `idx_job_post_shifts_shift_id` (`shift_id`),
  CONSTRAINT `fk_job_post_shifts_job_post` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_job_post_shifts_shift` FOREIGN KEY (`shift_id`) REFERENCES `work_shifts` (`shift_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_post_shifts`
--

LOCK TABLES `job_post_shifts` WRITE;
/*!40000 ALTER TABLE `job_post_shifts` DISABLE KEYS */;
INSERT INTO `job_post_shifts` VALUES (1,1),(13,2),(1,3),(10,3),(4,4),(8,4),(9,4),(13,4),(14,4),(10,6),(11,6),(2,7),(3,7),(5,7),(7,7),(12,7),(15,7),(6,8),(15,8);
/*!40000 ALTER TABLE `job_post_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_posts`
--

DROP TABLE IF EXISTS `job_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_posts` (
  `job_post_id` int NOT NULL AUTO_INCREMENT,
  `employer_id` int NOT NULL,
  `store_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `job_description` text NOT NULL,
  `requirements` text,
  `benefits` text,
  `hourly_wage_min` decimal(10,2) NOT NULL,
  `hourly_wage_max` decimal(10,2) DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `vacancy_count` int NOT NULL DEFAULT '1',
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `gender_requirement` varchar(255) NOT NULL,
  `employment_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `published_at` datetime DEFAULT NULL,
  `expired_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_post_id`),
  KEY `idx_job_posts_employer_id` (`employer_id`),
  KEY `idx_job_posts_store_id` (`store_id`),
  KEY `idx_job_posts_status` (`status`),
  KEY `idx_job_posts_published_at` (`published_at`),
  KEY `idx_job_posts_expired_at` (`expired_at`),
  KEY `idx_job_posts_hourly_wage_min` (`hourly_wage_min`),
  KEY `idx_job_posts_hourly_wage_max` (`hourly_wage_max`),
  KEY `idx_job_posts_created_at` (`created_at`),
  KEY `idx_job_posts_title` (`title`),
  CONSTRAINT `fk_job_posts_employer` FOREIGN KEY (`employer_id`) REFERENCES `employers` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_job_posts_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_job_posts_age_range` CHECK ((((`min_age` is null) or (`min_age` >= 0)) and ((`max_age` is null) or (`max_age` >= 0)) and ((`max_age` is null) or (`min_age` is null) or (`max_age` >= `min_age`)))),
  CONSTRAINT `chk_job_posts_employment_type` CHECK ((`employment_type` in (_utf8mb4'PART_TIME',_utf8mb4'SHIFT_BASED',_utf8mb4'SEASONAL'))),
  CONSTRAINT `chk_job_posts_gender_requirement` CHECK ((`gender_requirement` in (_utf8mb4'ANY',_utf8mb4'MALE',_utf8mb4'FEMALE'))),
  CONSTRAINT `chk_job_posts_hourly_wage` CHECK (((`hourly_wage_max` is null) or (`hourly_wage_max` >= `hourly_wage_min`))),
  CONSTRAINT `chk_job_posts_status` CHECK ((`status` in (_utf8mb4'ACTIVE',_utf8mb4'CLOSED',_utf8mb4'EXPIRED'))),
  CONSTRAINT `chk_job_posts_vacancy_count` CHECK ((`vacancy_count` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_posts`
--

LOCK TABLES `job_posts` WRITE;
/*!40000 ALTER TABLE `job_posts` DISABLE KEYS */;
INSERT INTO `job_posts` VALUES (1,1,1,'Nhân Viên Part-time Phụ Bếp / Phụ Bánh','Hỗ trợ sơ chế nguyên liệu và chuẩn bị món ăn, bánh.\nPhụ làm bánh theo hướng dẫn.\nGiữ vệ sinh khu vực bếp và đảm bảo an toàn thực phẩm.\nHỗ trợ các công việc khác theo phân công.','Có tinh thần chủ động, tích cực trong công việc.\nCó trách nhiệm, chăm chỉ, đúng giờ.\nPhù hợp với sinh viên cần làm thêm.','Thu nhập theo giờ lên đến 29,000 VND/giờ (bao gồm thưởng).\nThu nhập tháng khoảng 3.2 – 4.8 triệu.\nTăng lương theo năng lực và thị trường.\nCó lộ trình đào tạo và cơ hội phát triển lên vị trí quản lý.\nMôi trường làm việc thân thiện, năng động, chuyên nghiệp.\nLịch làm việc linh hoạt theo lịch học.\nHỗ trợ giảm ca trong thời gian thi, thực tập.\nTạo điều kiện thực tập cho sinh viên sắp ra trường.',20000.00,29000.00,'VND',4,18,30,'ANY','PART_TIME','ACTIVE','2026-03-25 01:19:27','2026-04-04 01:19:27','2026-03-25 01:19:27','2026-03-25 01:19:47'),(2,1,2,'Nhân Viên Phục Vụ','Phục vụ khách hàng, nhận order và hỗ trợ trong quá trình dùng bữa.\nĐảm bảo vệ sinh khu vực làm việc.\nHỗ trợ các bộ phận khác khi cần.\nLàm việc theo ca đăng ký linh hoạt.','Vui vẻ, hòa đồng, có trách nhiệm.\nKhông yêu cầu kinh nghiệm (được đào tạo 1 kèm 1).\nPhù hợp sinh viên hoặc người cần việc làm thêm.','Part-time: 20,000 – 28,000 VND/giờ.\nFull-time: 6 – 8 triệu/tháng.\nTrợ cấp tiền ăn.\nThưởng tháng, tăng lương theo năng lực.\nTham gia BHXH (đối với full-time).\nMôi trường làm việc năng động, tích cực.\nCó cơ hội thăng tiến lên các vị trí cao hơn.\nTham gia các hoạt động ngoại khóa thường xuyên.',20000.00,28000.00,'VND',7,18,30,'ANY','PART_TIME','ACTIVE','2026-03-25 01:19:27','2026-04-08 01:19:27','2026-03-25 01:19:27','2026-03-25 01:39:05'),(3,1,3,'Nhân Viên Phục Vụ','Bấm máy, pha chế đồ uống theo hướng dẫn.\nPhục vụ khách hàng.\nHỗ trợ các công việc tại quầy.\nGiữ vệ sinh khu vực làm việc.','Nữ, từ 18 – 23 tuổi.\nNhanh nhẹn, hoạt bát, trung thực.\nKhông yêu cầu kinh nghiệm.','Lương từ 19,000 – 23,000 VND/giờ.\nMôi trường làm việc trẻ trung, năng động.\nLịch làm linh hoạt phù hợp sinh viên.\nĐược đào tạo công việc.',19000.00,23000.00,'VND',3,18,23,'FEMALE','PART_TIME','ACTIVE','2026-03-25 01:19:27','2026-04-03 01:19:27','2026-03-25 01:19:27','2026-03-25 01:39:05'),(4,1,4,'Nhân Viên Phục Vụ','Phục vụ khách hàng, mang thức ăn và đồ uống.\nDọn dẹp, giữ vệ sinh khu vực làm việc.\nHỗ trợ các công việc theo phân công.\nVị trí quản lý sẽ trao đổi chi tiết khi phỏng vấn.','Nhanh nhẹn, có trách nhiệm.\nPhù hợp làm ca tối/đêm.\nVị trí quản lý yêu cầu có kinh nghiệm và ưu tiên biết tiếng Anh hoặc tiếng Hàn.','Lương phục vụ: 30,000 VND/giờ.\nNhiều đãi ngộ cho nhân viên.\nTăng lương theo năng lực.\nThưởng sinh nhật, lễ tết.\nCó ngày nghỉ hưởng lương (1–2 ngày/tháng).',30000.00,40000.00,'VND',5,18,30,'ANY','PART_TIME','ACTIVE','2026-03-25 01:19:27','2026-04-06 01:19:00','2026-03-25 01:19:27','2026-03-25 02:38:07'),(5,1,5,'Nhân Viên Phục Vụ / Phụ Bếp','Phục vụ khách hàng.\nPha chế nước đơn giản (soda, nước ép...).\nHỗ trợ các công việc trong quán.\nGiữ vệ sinh khu vực làm việc.','Thái độ thân thiện, vui vẻ, hiếu khách.\nChăm chỉ, có trách nhiệm.\nCó thể giao tiếp tiếng Anh cơ bản là lợi thế.','Lương từ 25,000 – 30,000 VND/giờ.\nBao ăn tại quán.\nMôi trường phù hợp để rèn luyện tiếng Anh.\nCông việc ổn định, lâu dài.',25000.00,30000.00,'VND',6,18,30,'ANY','PART_TIME','ACTIVE','2026-03-25 01:19:27','2026-04-09 01:19:27','2026-03-25 01:19:27','2026-03-25 01:39:05'),(6,1,6,'Nhân Viên Pha Chế – Quán Cà Phê Mang Đi','Pha chế các loại đồ uống theo menu của quán.\nChuẩn bị nguyên liệu, đảm bảo chất lượng và vệ sinh.\nPhục vụ khách mang đi nhanh chóng, đúng quy trình.\nHỗ trợ thu ngân khi cần.\nDọn dẹp, giữ vệ sinh khu vực làm việc.\nLàm việc xoay ca sáng – chiều – tối.','Nữ, từ 18 – 26 tuổi.\nCó thể làm xoay ca linh hoạt.\nƯu tiên có kinh nghiệm phục vụ, thu ngân hoặc pha chế (không bắt buộc).\nSiêng năng, nhanh nhẹn, có trách nhiệm.\nCó mong muốn làm lâu dài.\nGiao tiếp cơ bản, thái độ tốt với khách hàng.','Môi trường làm việc thân thiện, thoải mái.\nĐược training pha chế nếu chưa có kinh nghiệm.\nLịch làm linh hoạt phù hợp sinh viên.\nCơ hội gắn bó lâu dài, tăng lương theo năng lực.\nThưởng thêm nếu làm tốt.',18000.00,25000.00,'VND',4,18,26,'FEMALE','PART_TIME','ACTIVE','2026-03-25 01:37:39','2026-04-05 01:37:39','2026-03-25 01:37:39','2026-03-25 01:39:05'),(7,1,7,'Nhân Viên Trà Sữa – Order & Pha Chế','Order món cho khách tại quầy.\nPha chế trà sữa theo công thức có sẵn.\nChuẩn bị và trộn bánh tráng theo quy trình.\nDọn dẹp, giữ vệ sinh quán sau mỗi ca làm.\nHỗ trợ các công việc khác khi cần.','Từ 18 – 26 tuổi.\nKhông yêu cầu kinh nghiệm (sẽ được đào tạo).\nSiêng năng, nhanh nhẹn, sạch sẽ.\nCó trách nhiệm với công việc.\nƯu tiên ứng viên có thể làm cuối tuần.\nƯu tiên có kinh nghiệm order hoặc pha chế.','Môi trường làm việc trẻ trung, thoải mái.\nĐược hướng dẫn đào tạo từ đầu.\nLịch làm linh hoạt theo ca đăng ký.\nCó cơ hội tăng lương nếu làm tốt.',20000.00,25000.00,'VND',6,18,26,'ANY','PART_TIME','ACTIVE','2026-03-25 01:37:39','2026-04-07 01:37:39','2026-03-25 01:37:39','2026-03-25 01:39:05'),(8,1,8,'Nhân Viên Phụ Bếp – Nhà Hàng Ari Foods','Phụ bếp.\nSơ chế nguyên liệu.\nHỗ trợ bếp chính trong quá trình chế biến.\nĐảm bảo vệ sinh khu vực bếp.','Nam/Nữ, từ 18 – 30 tuổi.\nNhanh nhẹn, siêng năng, có trách nhiệm.\nCẩn thận, tỉ mỉ trong công việc.\nChấp hành nội quy của nhà hàng.\nCó thể làm ca tối.','Lương: 4,000,000 – 4,500,000 VND/tháng (tùy năng lực).\nThưởng: 300,000 – 500,000 VND/tháng.\nCó liên hoan, party cuối tháng.\nMôi trường làm việc năng động, vui vẻ, thoải mái.\nCơ hội gắn bó lâu dài và phát triển.',22000.00,28000.00,'VND',3,18,30,'ANY','PART_TIME','ACTIVE','2026-03-25 01:37:39','2026-04-09 01:37:39','2026-03-25 01:37:39','2026-03-25 01:38:12'),(9,1,9,'Nhân Viên Phục Vụ – Nhà Hàng Hàn Quốc','Phục vụ.\nĐón tiếp khách, ghi order, hỗ trợ khách trong suốt bữa ăn.\nPhục vụ món ăn, dọn dẹp bàn.\nGiao tiếp cơ bản với khách nước ngoài.','Từ 18 – 28 tuổi.\nƯu tiên đã có kinh nghiệm làm nhà hàng Hàn Quốc.\nBiết tiếng Anh hoặc tiếng Hàn cơ bản (đối với phục vụ).\nNhanh nhẹn, chăm chỉ, có trách nhiệm.\nCó thể làm việc theo ca cố định.','Môi trường làm việc năng động, chuyên nghiệp.\nCó phụ cấp cơm 30,000 VND/ca.\nCơ hội nâng lương nếu làm tốt.\nĐược đào tạo thêm kỹ năng phục vụ và bếp.',30000.00,35000.00,'VND',5,18,28,'ANY','PART_TIME','ACTIVE','2026-03-25 01:37:39','2026-04-04 01:37:39','2026-03-25 01:37:39','2026-03-25 01:39:05'),(10,1,10,'Nhân Viên Bán Hàng Trang Sức - DORI Jewelry','Tư vấn, giới thiệu sản phẩm phù hợp cho khách tại cửa hàng.\nĐóng gói sản phẩm, hỗ trợ giao hàng khi cần.\nTrưng bày, quản lý sản phẩm và giữ gìn cửa hàng gọn gàng, sạch đẹp.\nGhi đơn, nhập dữ liệu lên hệ thống bán hàng.\nSử dụng phần mềm bán hàng (được đào tạo nếu chưa biết).','Từ 18 – 27 tuổi.\nGiao tiếp tốt, ngoại hình ưa nhìn là lợi thế.\nYêu thích thời trang, trang sức và phong cách hiện đại.\nNhanh nhẹn, trung thực, chủ động trong công việc.\nKhông yêu cầu kinh nghiệm (được đào tạo).','Lương: Thỏa thuận theo năng lực.\nMôi trường làm việc trẻ trung, năng động.\nĐược đào tạo kỹ năng bán hàng và sử dụng phần mềm.\nCơ hội phát triển lâu dài trong lĩnh vực thời trang – phụ kiện.',22000.00,30000.00,'VND',2,18,27,'ANY','PART_TIME','ACTIVE','2026-03-25 01:37:39','2026-04-08 01:37:39','2026-03-25 01:37:39','2026-03-25 01:38:12'),(11,1,11,'Nhân viên bán hàng – Sport1 Lotte Mart Đà Nẵng','Tư vấn bán hàng các mặt hàng thể thao và thời trang thương hiệu Nike và Adidas: giày, dép, áo quần, phụ kiện.\nDọn dẹp vệ sinh quầy kệ trong gian hàng.\nTrưng bày hàng hóa và thực hiện một số công việc khác.','Nhanh nhẹn, trung thực.\nKhông vướng bận lịch học.\nBiết tiếng Anh cơ bản là lợi thế (không biết sẽ được đào tạo).','Mức lương bắt đầu từ 5,5 triệu + doanh thu.\nTăng lương định kì.\nĐược nghỉ 2 ngày/tháng.\nĐược cấp đồng phục.\nĐược đào tạo nếu chưa có kinh nghiệm.\nLễ, tết được x2 lương.',20000.00,30000.00,'VND',0,18,35,'ANY','PART_TIME','CLOSED','2026-03-25 01:51:15','2026-04-06 01:51:00','2026-03-25 01:51:15','2026-03-27 16:04:08'),(12,1,12,'Nhân viên bán trà sữa & phục vụ – Obt Milktea & Coffee','Bán trà sữa và thức ăn cho khách.\nPhục vụ khách hàng tại quán.\nHỗ trợ các công việc liên quan trong ca làm.','Nhanh nhẹn, trung thực.\nLàm việc gắn bó lâu dài.\nCó thể xoay ca theo lịch học.','Làm tốt trên 6 tháng sẽ được nâng lương.\nSắp xếp ca linh hoạt theo lịch học.',16000.00,22000.00,'VND',3,18,25,'ANY','PART_TIME','ACTIVE','2026-03-25 01:51:15','2026-04-04 01:51:15','2026-03-25 01:51:15','2026-03-25 01:51:31'),(13,1,13,'Nhân viên phục vụ – Nhà hàng Cơm Niêu Má Hai','Phục vụ khách hàng tại nhà hàng.\nHỗ trợ dọn dẹp, sắp xếp bàn ghế và khu vực làm việc.\nPhối hợp với các bộ phận khác để đảm bảo phục vụ nhanh chóng và chuyên nghiệp.','Đã có kinh nghiệm ở vị trí ứng tuyển.\nCó tinh thần trách nhiệm trong công việc.\nTác phong nhanh nhẹn, thái độ chuẩn mực.\nCó thể làm việc ổn định theo ca được phân công.','Mức lương cao.\nThưởng lễ, Tết.\nBao ăn.\nMôi trường làm việc ổn định, có cơ hội gắn bó lâu dài.',22000.00,30000.00,'VND',4,18,32,'ANY','PART_TIME','ACTIVE','2026-03-25 01:51:15','2026-04-08 01:51:15','2026-03-25 01:51:15','2026-03-25 01:51:31'),(14,1,14,'Nhân viên phục vụ & giữ xe – MixFood','Phục vụ khách hàng tại quán.\nHỗ trợ các công việc liên quan đến phục vụ.\nGiữ xe cho khách đối với vị trí giữ xe.\nĐảm bảo hoạt động phục vụ diễn ra nhanh chóng và hiệu quả trong giờ cao điểm.','Nhanh nhẹn, trung thực, có trách nhiệm trong công việc.\nCó thể làm việc ổn định theo ca đăng ký.\nBiết phối hợp với đồng nghiệp và hỗ trợ khách hàng tốt.\nƯu tiên ứng viên có kinh nghiệm phục vụ hoặc giữ xe.','Lễ x2.\nQuán không bán Tết.\nThưởng chuyên cần, cố gắng.\nMỗi tháng được off 1 ngày có lương.\nLàm 1 năm có lương tháng 13.',20000.00,25000.00,'VND',6,18,30,'ANY','PART_TIME','ACTIVE','2026-03-25 01:51:15','2026-04-03 01:51:15','2026-03-25 01:51:15','2026-03-25 01:51:31'),(15,1,15,'Nhân viên phục vụ & pha chế – The47 Coffee','Phục vụ khách hàng tại quán.\nPha chế đồ uống theo menu của quán.\nHỗ trợ giữ vệ sinh khu vực làm việc và phối hợp với các bộ phận khác để đảm bảo phục vụ nhanh chóng, hiệu quả.','Nhanh nhẹn, trung thực, có trách nhiệm trong công việc.\nCó thể làm part time hoặc full time theo ca xoay.\nGiao tiếp cơ bản, thái độ tốt với khách hàng.\nƯu tiên ứng viên có kinh nghiệm, chưa có sẽ được hướng dẫn.','Môi trường làm việc trẻ trung, thoải mái.\nĐược training nếu chưa có kinh nghiệm đối với vị trí phục vụ.\nCơ hội gắn bó lâu dài.\nThưởng lễ, tết, KPI rõ ràng.\nCó tip và thưởng thêm theo năng lực.',20000.00,24000.00,'VND',0,18,27,'ANY','PART_TIME','CLOSED','2026-03-25 01:51:15','2026-04-09 01:51:00','2026-03-25 01:51:15','2026-03-27 16:04:45');
/*!40000 ALTER TABLE `job_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `permission_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`permission_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES ('APPLICATION_CREATE','Apply for a job'),('APPLICATION_UPDATE_STATUS','Update application status'),('APPLICATION_VIEW','View job applications'),('CATEGORY_MANAGE','Create and update job categories'),('CATEGORY_VIEW','View job categories'),('EMPLOYER_APPROVE','Approve employer accounts'),('JOB_CREATE','Create a new job post'),('JOB_DELETE','Delete or close a job post'),('JOB_UPDATE','Update own job posts'),('JOB_VIEW','View job listings and job details'),('REVIEW_CREATE','Create a store review'),('REVIEW_MODERATE','Hide or manage reviews'),('REVIEW_VIEW','View store reviews'),('ROLE_ASSIGN','Assign roles to users'),('SHIFT_MANAGE','Create and update work shifts'),('SHIFT_VIEW','View work shifts'),('STORE_CREATE','Create a store'),('STORE_UPDATE','Update own store information'),('STORE_VIEW','View store information'),('USER_READ','View user profile information'),('USER_UPDATE','Update own user profile');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('ADMIN','System administrator'),('EMPLOYER','Employer who posts job listings'),('USER','Regular user looking for part-time jobs');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_name` varchar(255) NOT NULL,
  `permission_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_name`,`permission_name`),
  KEY `idx_role_permissions_permission_name` (`permission_name`),
  CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_name`) REFERENCES `permission` (`permission_name`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_name`) REFERENCES `role` (`role_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES ('USER','APPLICATION_CREATE'),('ADMIN','APPLICATION_UPDATE_STATUS'),('EMPLOYER','APPLICATION_UPDATE_STATUS'),('ADMIN','APPLICATION_VIEW'),('EMPLOYER','APPLICATION_VIEW'),('USER','APPLICATION_VIEW'),('ADMIN','CATEGORY_MANAGE'),('ADMIN','CATEGORY_VIEW'),('EMPLOYER','CATEGORY_VIEW'),('USER','CATEGORY_VIEW'),('ADMIN','EMPLOYER_APPROVE'),('ADMIN','JOB_CREATE'),('EMPLOYER','JOB_CREATE'),('ADMIN','JOB_DELETE'),('EMPLOYER','JOB_DELETE'),('ADMIN','JOB_UPDATE'),('EMPLOYER','JOB_UPDATE'),('ADMIN','JOB_VIEW'),('EMPLOYER','JOB_VIEW'),('USER','JOB_VIEW'),('USER','REVIEW_CREATE'),('ADMIN','REVIEW_MODERATE'),('ADMIN','REVIEW_VIEW'),('EMPLOYER','REVIEW_VIEW'),('USER','REVIEW_VIEW'),('ADMIN','ROLE_ASSIGN'),('ADMIN','SHIFT_MANAGE'),('ADMIN','SHIFT_VIEW'),('EMPLOYER','SHIFT_VIEW'),('USER','SHIFT_VIEW'),('ADMIN','STORE_CREATE'),('EMPLOYER','STORE_CREATE'),('ADMIN','STORE_UPDATE'),('EMPLOYER','STORE_UPDATE'),('ADMIN','STORE_VIEW'),('EMPLOYER','STORE_VIEW'),('USER','STORE_VIEW'),('ADMIN','USER_READ'),('EMPLOYER','USER_READ'),('USER','USER_READ'),('ADMIN','USER_UPDATE'),('EMPLOYER','USER_UPDATE'),('USER','USER_UPDATE');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_reviews`
--

DROP TABLE IF EXISTS `store_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `reviewer_user_id` int NOT NULL,
  `employment_record_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `uq_store_reviews_employment_record` (`employment_record_id`),
  KEY `idx_store_reviews_store_id` (`store_id`),
  KEY `idx_store_reviews_reviewer_user_id` (`reviewer_user_id`),
  KEY `idx_store_reviews_rating` (`rating`),
  KEY `idx_store_reviews_status` (`status`),
  KEY `idx_store_reviews_created_at` (`created_at`),
  CONSTRAINT `fk_store_reviews_employment_record` FOREIGN KEY (`employment_record_id`) REFERENCES `employment_records` (`employment_record_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_store_reviews_reviewer_user` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_store_reviews_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_store_reviews_rating` CHECK ((`rating` between 1 and 5)),
  CONSTRAINT `chk_store_reviews_status` CHECK ((`status` in (_utf8mb4'VISIBLE',_utf8mb4'HIDDEN',_utf8mb4'REPORTED')))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_reviews`
--

LOCK TABLES `store_reviews` WRITE;
/*!40000 ALTER TABLE `store_reviews` DISABLE KEYS */;
INSERT INTO `store_reviews` VALUES (11,13,6,10,5,'Không gian làm việc ok vl','VISIBLE','2026-03-25 02:41:17','2026-03-25 02:41:17');
/*!40000 ALTER TABLE `store_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `employer_id` int NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `phone_contact` varchar(255) DEFAULT NULL,
  `description` text,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`store_id`),
  KEY `idx_stores_employer_id` (`employer_id`),
  KEY `idx_stores_store_name` (`store_name`),
  KEY `idx_stores_city` (`city`),
  KEY `idx_stores_district` (`district`),
  KEY `idx_stores_ward` (`ward`),
  KEY `idx_stores_is_active` (`is_active`),
  CONSTRAINT `fk_stores_employer` FOREIGN KEY (`employer_id`) REFERENCES `employers` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,1,'EZI’s Sweet - Teabreak & Cakes','0905119689','Quán cà phê kết hợp bếp bánh, không gian thân thiện, phù hợp sinh viên, môi trường làm việc năng động tại Đà Nẵng.','Đà Nẵng','Liên Chiểu','Hòa Minh','535 Kinh Dương Vương, Liên Chiểu, Đà Nẵng',16.08170000,108.15860000,1,'2026-03-25 00:56:59','2026-03-25 00:57:54'),(2,1,'Gyusachi - Nhà Hàng Nướng Nhật','0795672527','Nhà hàng nướng Nhật Bản Gyusachi, không gian hiện đại, phục vụ các món nướng phong cách Nhật, môi trường làm việc năng động và chuyên nghiệp.','Đà Nẵng','Hải Châu','Thạch Thang','54 Quang Trung, Hải Châu, Đà Nẵng',16.07180000,108.22250000,1,'2026-03-25 00:56:59','2026-03-25 00:57:54'),(3,1,'RAU MÁ - MÁ PHA','0866469886','Chuỗi cửa hàng đồ uống chuyên rau má pha máy, phong cách trẻ trung, phù hợp sinh viên, môi trường làm việc năng động tại Đà Nẵng.','Đà Nẵng','Hải Châu','Hòa Thuận','167 Lê Đình Lý, Đà Nẵng',16.05200000,108.21020000,1,'2026-03-25 00:56:59','2026-03-25 00:57:54'),(4,1,'DALBIT - Nhà Hàng Hàn Quốc','0868797972','Nhà hàng Hàn Quốc Dalbit, phục vụ các món ăn chuẩn vị Hàn, không gian hiện đại, phù hợp giới trẻ và khách quốc tế tại Đà Nẵng.','Đà Nẵng','Sơn Trà','An Hải Tây','212 Bạch Đằng, Sơn Trà, Đà Nẵng',16.06750000,108.23020000,1,'2026-03-25 00:56:59','2026-03-25 00:57:54'),(5,1,'CƠM CHAY QUAN THẾ ÂM 3','0901122819','Quán cơm chay phục vụ khách địa phương và khách nước ngoài, không gian thân thiện, phù hợp sinh viên làm thêm và rèn luyện giao tiếp tiếng Anh.','Đà Nẵng','Ngũ Hành Sơn','Mỹ An','298 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng',16.05500000,108.24700000,1,'2026-03-25 00:56:59','2026-03-25 00:57:54'),(6,1,'Milano Coffee & Cà Phê Nhàn – Đà Nẵng','0905198 089','Chuỗi quán cà phê phục vụ nhanh, chuyên bán mang đi, không gian gọn gàng, phù hợp cho khách hàng bận rộn. Quán có 2 cơ sở tại Đà Nẵng, phục vụ đa dạng đồ uống như cà phê, trà sữa, nước ép với phong cách hiện đại, tiện lợi.','Đà Nẵng','Liên Chiểu, Hải Châu','Hoà Khánh Bắc','68 Thái Phiên, Quận Hải Châu, Đà Nẵng',16.06536883,108.22151511,1,'2026-03-25 01:34:15','2026-03-25 01:42:29'),(7,1,'Trà Đây','0968771 608','Quán trà sữa phong cách trẻ trung, chuyên phục vụ trà sữa, trà trái cây và các món ăn vặt như bánh tráng trộn. Không gian thoải mái, phù hợp với học sinh – sinh viên, tập trung vào hình thức phục vụ nhanh và tiện lợi.','Đà Nẵng','Thanh Khê','Chính Gián','72 Nguyễn Hoàng, Quận Thanh Khê, TP. Đà Nẵng',16.06050000,108.20550000,1,'2026-03-25 01:34:15','2026-03-25 01:36:20'),(8,1,'Ari Foods – Ari Grill & Chill','0905834 697','Chuỗi nhà hàng chuyên các món ăn và nướng BBQ với phong cách hiện đại, không gian rộng rãi, phù hợp tụ họp bạn bè và gia đình. Môi trường làm việc năng động, trẻ trung, thường xuyên tổ chức hoạt động nội bộ cho nhân viên.','Đà Nẵng','Hải Châu','Hòa Cường Nam','12 Xô Viết Nghệ Tĩnh, Quận Hải Châu, TP. Đà Nẵng',16.04750000,108.23300000,1,'2026-03-25 01:34:15','2026-03-25 01:36:20'),(9,1,'Nhà Hàng Thịt Nướng Hàn Quốc – Trần Phú','0382484 525','Nhà hàng chuyên các món thịt nướng Hàn Quốc với không gian ấm cúng, phục vụ tại bàn, phù hợp cho nhóm bạn và gia đình. Menu đa dạng gồm BBQ, lẩu và các món ăn truyền thống Hàn Quốc, phục vụ khách trong nước và quốc tế.','Đà Nẵng','Hải Châu','Phước Ninh','91 Trần Phú, Quận Hải Châu, TP. Đà Nẵng',16.06680000,108.22150000,1,'2026-03-25 01:34:15','2026-03-25 01:36:20'),(10,1,'DORI Jewelry – Trang Sức Bạc','0356829 415','Cửa hàng chuyên kinh doanh trang sức bạc với phong cách hiện đại, trẻ trung. Sản phẩm đa dạng từ nhẫn, vòng tay, dây chuyền đến phụ kiện thời trang, phù hợp với giới trẻ và khách hàng yêu thích phong cách tinh tế, cá tính.','Đà Nẵng','Thanh Khê','Vĩnh Trung','322 Hùng Vương, Quận Thanh Khê, TP. Đà Nẵng',16.06600000,108.20850000,1,'2026-03-25 01:34:15','2026-03-25 01:36:20'),(11,1,'Sport1 Lotte Mart Đà Nẵng','0905628618','Cửa hàng bán các mặt hàng thể thao và thời trang thương hiệu Nike, Adidas như giày, dép, áo quần, phụ kiện tại Lotte Mart Đà Nẵng.','Đà Nẵng','Hải Châu','Hòa Cường Bắc','Tầng 2, Lotte Mart Đà Nẵng, 06 Nại Nam, Đà Nẵng',16.02916700,108.22416700,1,'2026-03-25 01:50:29','2026-05-22 22:25:36'),(12,1,'Obt - Milktea & Coffee','0914 768 239','Quán trà sữa và đồ ăn nhẹ, phục vụ đa dạng thức uống và món ăn, phù hợp với học sinh – sinh viên.','Đà Nẵng','Hải Châu','Thanh Bình','35 Cao Thắng, Hải Châu, Đà Nẵng',16.05440000,108.22010000,1,'2026-03-25 01:50:29','2026-03-25 01:51:02'),(13,1,'Nhà hàng Cơm Niêu Má Hai','0708177837','Nhà hàng cơm niêu phục vụ các món ăn truyền thống, không gian ấm cúng, phù hợp cho khách cá nhân, gia đình và nhóm tại khu vực trung tâm Đà Nẵng.','Đà Nẵng','Hải Châu','Hòa Cường Nam','88 đường 2 tháng 9, Phường Hòa Cường Nam, Quận Hải Châu, Đà Nẵng',16.01860000,108.22170000,1,'2026-03-25 01:50:29','2026-03-25 01:51:02'),(14,1,'MixFood','0935 386 194','Quán ăn phục vụ đa dạng món ăn, không gian thoải mái, phù hợp cho khách cá nhân và nhóm tại khu vực Sơn Trà, Đà Nẵng.','Đà Nẵng','Sơn Trà','Phước Mỹ','K38/37 Nguyễn Duy Hiệu, Phường Phước Mỹ, Quận Sơn Trà, TP. Đà Nẵng',16.06740000,108.24580000,1,'2026-03-25 01:50:29','2026-03-25 01:51:02'),(15,1,'The47 Coffee','0817 857 816','Quán cà phê hiện đại, không gian trẻ trung, phục vụ đồ uống đa dạng tại khu vực trung tâm Đà Nẵng.','Đà Nẵng','Hải Châu','Hải Châu I','47 Phan Bội Châu, Phường Hải Châu I, Quận Hải Châu, Đà Nẵng',16.04320000,108.21490000,1,'2026-03-25 01:50:29','2026-03-25 01:51:02');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`role_name`),
  KEY `idx_user_roles_role_name` (`role_name`),
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_name`) REFERENCES `role` (`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'ADMIN'),(3,'EMPLOYER'),(4,'EMPLOYER'),(2,'USER'),(4,'USER'),(5,'USER'),(6,'USER'),(7,'USER'),(8,'USER');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$10$E13luNJBL.RtFDdCPYyyye5ma.bBDuVRzHQB3mlRjsLS8igVV3qjW','admin','2005-06-10'),(2,'ngocthanhvo','$2a$10$ru6x4fRptIAKGj6BQLh34.acAswYHL7/9A0R84X2FwVm2PhZKqBMu','Thanh_MiLa','2005-06-10'),(3,'employee','$2a$10$L.XTcJht8qVtuAbkbfptruMkjfEe0My0YaYGBPP/CmZe0Qn20dcxK','Employee','2005-06-10'),(4,'boss','$2a$10$rWytHlrVUXcOls3RG9YqeewoWM0VvujfVEG6nDETg4eXxQWTRvDx.','boss','2005-06-10'),(5,'boss1','$2a$10$orFep3Ca51P4eDgseIHXvu9QdOLneSsnrRONgjUDNaZqeQuhxN0DK','boss1','2005-06-10'),(6,'thanh','$2a$10$QkjIxNGkL3T4Wz3Xugmh7uusK8dh/6/M9eHRg/ifmGVo/7wNUTxnS','Thanh_MiLa','2011-06-16'),(7,'hoag','$2a$10$Tul.J571WL.yyVd2kjSAuOImwIt9kZTKWHTC94QqPOFnLkx9XaRRW','Hoang Dep Trai','2003-02-05'),(8,'fpt3','$2a$10$adeCsAvGAKKiUo4j3kNTaua2QVRFnzAZJXlcNxhD2Npvxnf4UNksW','Nguyen Van C','2026-03-25');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_shifts`
--

DROP TABLE IF EXISTS `work_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_shifts` (
  `shift_id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(255) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_flexible` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`shift_id`),
  UNIQUE KEY `uq_work_shifts_shift_name` (`shift_name`),
  KEY `idx_work_shifts_is_active` (`is_active`),
  KEY `idx_work_shifts_sort_order` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_shifts`
--

LOCK TABLES `work_shifts` WRITE;
/*!40000 ALTER TABLE `work_shifts` DISABLE KEYS */;
INSERT INTO `work_shifts` VALUES (1,'Ca sáng','06:00:00','12:00:00',0,1,1),(2,'Ca trưa','11:00:00','17:00:00',0,2,1),(3,'Ca chiều','13:00:00','18:00:00',0,3,1),(4,'Ca tối','17:00:00','22:00:00',0,4,1),(5,'Ca đêm','22:00:00','06:00:00',0,5,1),(6,'Ca hành chính','08:00:00','17:00:00',0,6,1),(7,'Ca linh hoạt',NULL,NULL,1,7,1),(8,'Ca xoay',NULL,NULL,1,8,1);
/*!40000 ALTER TABLE `work_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'parttimejob'
--

--
-- Dumping routines for database 'parttimejob'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03  1:19:29
