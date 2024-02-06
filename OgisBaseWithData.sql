-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `customer`
-- 
DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `CustId` int NOT NULL AUTO_INCREMENT,
  `CustName` varchar(45) NOT NULL,
  `PhoneNumber` varchar(10) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`CustId`),
  KEY `fk_Customer_Users_idx` (`UserId`),
  CONSTRAINT `fk_Customer_Users` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

-- 
LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (34,'Simona Velichkova','0877709043',NULL,49),(35,'Ivan Ivanov','0877709044',NULL,50),(36,'Stoyan Stoyanov','0877709033',NULL,51),(37,'Georgi Georgiev','0987654321',NULL,52),(38,'Simeon Simeonov','0877709555',NULL,53),(39,'Chichko Chichkov','0987654311',NULL,54),(40,'Fiona Shrekova','0877709999',NULL,57);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `UserId` int NOT NULL,
  `EmpId` int NOT NULL AUTO_INCREMENT,
  `EmpName` varchar(255) NOT NULL,
  `EmpType` enum('courier','office worker') NOT NULL,
  PRIMARY KEY (`EmpId`),
  KEY `fk_Employees_Users1_idx` (`UserId`),
  CONSTRAINT `fk_Employees_Users1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (58,9,'Georgi Georgiev Marinov','courier'),(59,10,'Mariana Chichkova Johnes','office worker'),(60,11,'Georgi Ivanov Slavchev','courier'),(61,12,'Mariah Bob Black','office worker'),(62,13,'Anastasia Anastasievna Anastasievna','office worker'),(63,14,'Denis Denisov Hristov','courier'),(64,15,'Evgeni Butilkov Chervenkov','courier'),(65,16,'Hristina Teodorova Himikalkova','courier');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `firm`
--

DROP TABLE IF EXISTS `firm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `firm` (
  `FirmId` int NOT NULL AUTO_INCREMENT,
  `FirmName` varchar(255) NOT NULL,
  `FirmAddress` varchar(255) NOT NULL,
  PRIMARY KEY (`FirmId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `firm`
--

LOCK TABLES `firm` WRITE;
/*!40000 ALTER TABLE `firm` DISABLE KEYS */;
INSERT INTO `firm` VALUES (1,'Orbico','Sofia, Obikolna 300');
/*!40000 ALTER TABLE `firm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offices` (
  `OfficeId` int NOT NULL AUTO_INCREMENT,
  `OfficeName` varchar(255) NOT NULL,
  `OfficeAddress` varchar(255) NOT NULL,
  PRIMARY KEY (`OfficeId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'Slatina\'s office','Sofia, Slatina 311');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcels`
--

DROP TABLE IF EXISTS `parcels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcels` (
  `ParcelsId` int NOT NULL AUTO_INCREMENT,
  `SenderId` int NOT NULL,
  `ReceiverId` int NOT NULL,
  `OfficeOrAddress` int NOT NULL,
  `SenderAddress` varchar(255) NOT NULL,
  `ReceiverAddress` varchar(255) NOT NULL,
  `Weight` double NOT NULL,
  `Price` double NOT NULL,
  `DispachDate` date DEFAULT NULL,
  `ReceiptDate` date DEFAULT NULL,
  `StatusId` int NOT NULL DEFAULT '1',
  `StatusDate` date DEFAULT NULL,
  `EmpId` int DEFAULT NULL,
  `PaidOn` date DEFAULT NULL,
  PRIMARY KEY (`ParcelsId`),
  KEY `fk_packages_clients1_idx` (`SenderId`),
  KEY `fk_packages_clients2_idx` (`ReceiverId`),
  KEY `fk_packages_statuses1_idx` (`StatusId`),
  KEY `fk_packages_employees1_idx` (`EmpId`),
  CONSTRAINT `fk_packages_clients1` FOREIGN KEY (`SenderId`) REFERENCES `customer` (`CustId`),
  CONSTRAINT `fk_packages_clients2` FOREIGN KEY (`ReceiverId`) REFERENCES `customer` (`CustId`),
  CONSTRAINT `fk_packages_employees1` FOREIGN KEY (`EmpId`) REFERENCES `employees` (`EmpId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcels`
--

LOCK TABLES `parcels` WRITE;
/*!40000 ALTER TABLE `parcels` DISABLE KEYS */;
/*!40000 ALTER TABLE `parcels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `RoleId` int NOT NULL,
  `RoleName` varchar(45) NOT NULL,
  PRIMARY KEY (`RoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'moderator'),(2,'customer'),(3,'employee');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statuses` (
  `StatusId` int NOT NULL AUTO_INCREMENT,
  `StatusName` varchar(255) NOT NULL,
  PRIMARY KEY (`StatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--
-- each employee's default password is "LogComp"
-- "admin"(username) -> "admin"(password)
-- the username and passwords for customers are the same. Example : "customer2" -> "customer2"
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `RoleId` int NOT NULL DEFAULT '2',
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`UserId`),
  KEY `fk_Users_Role1_idx` (`RoleId`),
  CONSTRAINT `fk_Users_Role1` FOREIGN KEY (`RoleId`) REFERENCES `role` (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,49,'admin','$2b$10$j8rcI/f3Scdv4exK0yrn3.bvBGtjj5erJTwRw52uXOqgVKxfyRFja'),(2,50,'customer1','$2b$10$RjWGQcJG0yXlnat.l31Gy.93HtTkm9miNOa8vpNHsGX5965ve5gDC'),(2,51,'customer2','$2b$10$CPC1egc2G5PgpJDR3XL4dOG3vqn5VOm0GfO5LBR0mwKk2g6CFspX6'),(2,52,'customer3','$2b$10$pXDQWlmW3wDH7zKwPfnQk.4/SwhNMbsm3WyIvHhCystm60J02NToO'),(2,53,'customer4','$2b$10$LzMPPQnGvEJyDAg1aSDcfuIj72v6lFtjUcEa8ax.6qlQbV0Wy5QPC'),(2,54,'customer5','$2b$10$kCiUhW1sXb79JN/XMUIAJuriUvB47MxH3QBDbBztY3kPcxONTafm.'),(2,57,'customer6','$2b$10$nWRGRL55i5sU1jTMrILWxO77gUWrg5K5akxlTZCMMQgumK6lCtHH.'),(3,58,'GGMarinov','$2b$10$Lp4/36Jjmy8WdYE76OarleCPGTaD.sPCIdwEE6vTvIvrti90lTRqO'),(3,59,'MCJohnes','$2b$10$nzmY/WonhzT4qUV0haRN6uILIvRlZlg2pesQ1wvtR7gCjLuYS0vP.'),(3,60,'GISlavchev','$2b$10$8WF8.4JcoZU7q8NgXpaMx.3TfrtvvWf9I9LZCD33iz2X7Y8RsepIC'),(3,61,'MBBlack','$2b$10$JFjAua1rN1grYdQ4FCP0yuQl0oqsoLFRFRM7hJFnzJYE1u6WymLJi'),(3,62,'AAAnastasievna','$2b$10$xDFUsIsLJlgF9Rqxwoyu3uGkCwnqm4VS8Xv4tHMgHh5yMleZwhGi2'),(3,63,'DDHristov','$2b$10$pGkqiooX7cjIyTWAgOFWa.6UvB2q5TDWW6AKzvilS4adzaxK3TMZm'),(3,64,'EBChervenkov','$2b$10$17tzxokgab1DGpapvnVvKeexQQhIkt2ymY2j2rqdWnYOHokF.FXqa'),(3,65,'HTHimikalkova','$2b$10$aTa4rVHf/kJeDMYM9U6z8Orxum7ig6YuPUn7qouyBvpvPDjcJdC6O');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-05 18:40:43
