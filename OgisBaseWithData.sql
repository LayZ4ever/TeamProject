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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--
-- customer1 pass = 'customerPass'
LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (5,'Simo Vel','987654321',NULL,5),(11,'Ognyan Bozhinov','0987654321',NULL,22),(12,'Donkey Shrek','0864297531',NULL,23),(13,'Simeon Simeonov','0888888888',NULL,25),(14,'Shrek Shrekov','9876543201',NULL,26),(15,'Fiona Shrekova','0981234567',NULL,27);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `Firm_FirmId` int DEFAULT '1',
  `UserId` int NOT NULL,
  `EmpId` int NOT NULL AUTO_INCREMENT,
  `EmpName` varchar(255) NOT NULL,
  `EmpType` enum('courier','office worker') NOT NULL,
  PRIMARY KEY (`EmpId`),
  KEY `fk_Employees_Firm1_idx` (`Firm_FirmId`),
  KEY `fk_Employees_Users1_idx` (`UserId`),
  CONSTRAINT `fk_Employees_Firm1` FOREIGN KEY (`Firm_FirmId`) REFERENCES `firm` (`FirmId`),
  CONSTRAINT `fk_Employees_Users1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--
-- ALL EMPLOYEE PASSWORDS ARE = 'LogComp'
LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,11,2,'Georgi Ivanov Slavchev','courier'),(1,12,3,'Mari Vel Press','office worker'),(1,14,5,'Ivan Ivanov Ivanov','courier'),(1,30,6,'Georgi Georgiev Marinov','courier'),(1,31,7,'Shopi Shopov Shopov','courier'),(1,32,8,'Chichko Chichev Chichkov','courier');
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
  `Firm_FirmId` int NOT NULL,
  `OfficeId` int NOT NULL AUTO_INCREMENT,
  `OfficeName` varchar(255) NOT NULL,
  PRIMARY KEY (`OfficeId`),
  KEY `fk_offices_Firm1_idx` (`Firm_FirmId`),
  CONSTRAINT `fk_offices_Firm1` FOREIGN KEY (`Firm_FirmId`) REFERENCES `firm` (`FirmId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcels`
--

DROP TABLE IF EXISTS `parcels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;


CREATE TABLE parcels (
  ParcelsId int NOT NULL AUTO_INCREMENT,
  SenderId int NOT NULL,
  ReceiverId int NOT NULL,
  OfficeOrAddress int NOT NULL,
  SenderAddress varchar(255) NOT NULL,
  ReceiverAddress varchar(255) NOT NULL,
  Weight double NOT NULL,
  Price double NOT NULL,
  DispachDate date DEFAULT NULL,
  ReceiptDate date DEFAULT NULL,
  StatusId int NOT NULL DEFAULT '1',
  StatusDate date DEFAULT NULL,
  EmpId int DEFAULT NULL,
  PaidOn date DEFAULT NULL,
  PRIMARY KEY (ParcelsId),
  KEY fk_packages_clients1_idx (SenderId),
  KEY fk_packages_clients2_idx (ReceiverId),
  KEY fk_packages_statuses1_idx (StatusId),
  KEY fk_packages_employees1_idx (EmpId),
  CONSTRAINT fk_packages_clients1 FOREIGN KEY (SenderId) REFERENCES customer (CustId),
  CONSTRAINT fk_packages_clients2 FOREIGN KEY (ReceiverId) REFERENCES customer (CustId),
  CONSTRAINT fk_packages_employees1 FOREIGN KEY (EmpId) REFERENCES employees (EmpId)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb3
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--
-- admin pass = 'employeePass'. Yes, I know, don't ask.
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,5,'customer1','$2b$10$2L1fvfLDA7VfFo166pD.ceuHPv9/O0NaCB9zERYj6rbqSi4WXlT1C'),(1,7,'admin','$2b$10$vhcVF3L8KwOs04KzUCkl5eEz2lGfJ6Is9hopaYlw3Cfg2Qr2fUdFG'),(3,11,'AUentrry','$2b$10$8atgDwapfWu90Z.dcF.2meItP/uPn6yh3880XaOJps7op5SD7rhMu'),(3,12,'MVPress','$2b$10$IZKhYzwXSO8CbWOCIo9XOeZcwSE3/CjamRAKt2a2xNOnnPapq66M6'),(3,14,'IIIvanov','$2b$10$.kH4WWZrh1qKwAKTmyp9E.vfXiaJ/EuLMQxe8P8mamO6CSszpveRi'),(2,22,'customer2','$2b$10$9xibsvgChWY1gChMe2s.x.axLBkJP0c.IuEz2nB8ifmH48I4cA4um'),(2,23,'customer3','$2b$10$./lbb10plMHwT4sNrn7SrOMmkN/oIRFqmgWnyoM5aqqQuEM3Eqfnq'),(2,25,'customer5','$2b$10$/5TtkVeSBz.l6m3mp1vxVued/7VNYIPuMI0X/ExH8QlMXOJ6oObNK'),(2,26,'customer6','$2b$10$D0QiGjiPGuFC.asWFTG.bew8ne5e7l1gtimuOMICeEyeK6T3VytnC'),(2,27,'customer8','$2b$10$zmnADZ/MmjYsXEaFHB0F0.cYcFdPHTiPn4MD6kloTTOyQxsQ5i8cK'),(3,30,'GGMarinov','$2b$10$NzadKfRkcsWRygbF49L7Uee4L3IfIpE7k3ssgCYlvdQ2weUKaeC6u'),(3,31,'SSShopov','$2b$10$oaVUwhLoX9w0ofcsiDzfjeEBKQlw1.UluKPeJxasasOznaM/gQmoG'),(3,32,'CCChichkov','$2b$10$ECQMAUiMHIbpn/hrrZpdeOOeRfSi6v0Ab25rd8npkBlCPNIXWD6uu');
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

-- Dump completed on 2024-01-25  7:05:40
