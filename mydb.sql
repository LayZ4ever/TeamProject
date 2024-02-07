-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.36

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Петър Василев','0888995544','София, Красна поляна бл 21',NULL),(2,'АртМатер ООД','0899443322','София, Овча купел 2, Народно хоро 5',NULL),(3,'Минка Тошева','0878123123','Бургас, Изгрев бл 5',NULL),(4,'Кънчо Петров','0898223344','Варна, Крайморска 5',NULL),(5,'Висла АД','0899234234','Перник, Китка 5',NULL),(6,'Михаил Красимиров','0888456123','Стара Загора, Козлодуй 18',NULL),(7,'ТонериБГ ЕООД','0899112233','Варна, Хаджи Димитър 67',9),(8,'Димитринка Хаджиева','0878456789','София, Младост I , бл 422А',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (2,1,'Иван Петров Иванов','courier'),(3,2,'Милка Съева Добрева','office worker'),(4,3,'Красимир Петров Пеев','courier'),(1,4,'Диди Господинова Тодорова','office worker'),(6,5,'Владимир Добрев Златев','courier'),(7,6,'Стоян Кръстев Златев','courier'),(8,7,'Петър Виденов Иванов','courier');
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
INSERT INTO `firm` VALUES (1,'Фирма ООД','София, Обиколна 300');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'Слатина','София, Гео Милев 18'),(2,'Разсадника','София, Хъшове 33'),(3,'Дружба','София, Улица 25'),(4,'Сторгозия','Стара Загора, Зелено дърво 5'),(5,'Изгрев','Бургас, Крайбрежна 10'),(6,'Перник','Перник, Кукерски връх 2'),(7,'Чайка','Варна, Морски булевард 14');
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
  `DispatchDate` date DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcels`
--

LOCK TABLES `parcels` WRITE;
/*!40000 ALTER TABLE `parcels` DISABLE KEYS */;
INSERT INTO `parcels` VALUES (1,7,1,1,'Варна, Хаджи Димитър 67','София, Хъшове 33',0.3,3.15,'2024-02-07','2024-02-08',5,'2024-02-08',4,'2024-02-08'),(2,7,2,2,'Варна, Хаджи Димитър 67','gr. SOFIA (1000) Овча купел 2, Народно хоро 15 ',1.5,5.75,'2024-02-08','2024-02-13',2,'2024-02-11',4,NULL),(3,7,5,1,'Варна, Хаджи Димитър 67','Перник, Кукерски връх 2',5,5.5,'2024-02-09','2024-02-15',2,'2024-02-10',4,NULL),(4,8,7,1,'София, Младост I , бл 422А','Варна, Морски булевард 14',0.4,3.2,'2024-02-11','2024-02-13',2,'2024-02-12',4,NULL),(5,6,7,1,'Стара Загора, Козлодуй 18','Варна, Морски булевард 14',5,5.5,'2024-02-11','2024-02-14',3,'2024-02-13',4,NULL),(6,3,4,2,'Бургас, Изгрев бл 5','gr. VARNA (9000) Крайморска 25',0.5,5.25,'2024-02-08','2024-02-12',2,'2024-02-09',4,NULL),(7,5,7,1,'Перник, Китка 5','Варна, Морски булевард 14',0.4,3.2,'2024-02-12','2024-02-14',5,'2024-02-14',4,'2024-02-14'),(8,2,8,2,'София, Овча купел 2, Народно хоро 5','София Младост I , бл 422А',0.4,5.2,'2024-02-18','2024-02-20',2,'2024-02-18',4,NULL),(9,2,3,1,'София, Овча купел 2, Народно хоро 5','Бургас, Крайбрежна 10',0.2,3.1,'2024-02-15','2024-02-19',1,'2024-02-15',4,NULL),(10,6,2,2,'Стара Загора, Козлодуй 18','gr. SOFIA (1000) Монтевидео бл 145',0.4,5.2,'2024-02-11','2024-02-15',2,'2024-02-12',4,NULL),(11,5,7,1,'Перник, Китка 5','Варна, Морски булевард 14',1,3.5,'2024-02-18','2024-02-21',1,'2024-02-18',2,NULL),(12,1,5,1,'София, Красна поляна бл 21','Перник, Кукерски връх 2',0.5,3.25,'2024-02-07','2024-02-08',5,'2024-02-08',2,'2024-02-08'),(13,4,3,2,'Варна, Крайморска 5','gr. BURGAS (8000) Централна 22',0.4,5.2,'2024-02-08','2024-02-11',5,'2024-02-10',2,'2024-02-10');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
INSERT INTO `statuses` VALUES (1,'Приета'),(2,'Изпратена'),(3,'Получена'),(4,'Платена'),(5,'Приключена');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'admin','$2b$10$wWncfsd1/q6m3tiOcvfx9.YEclCpdlEjTfTc/KQUSIRZxQzwBgXZ2'),(3,2,'ИПИванов','$2b$10$8a4xdikWVQxQvekltCyEieYmtvJkPqa1foiRECnfRy8aD/oTl9okO'),(3,3,'МСДобрева','$2b$10$euD34v8OatMgOG.0vnppQumAXZG1c7Cb3N7kj0L3eGCUgRJkNYSSq'),(3,4,'КППеев','$2b$10$pS3VzUH0YCfMMrHZLmT/k.QHGXZYUxqOId7CnfLI.F1YNemMID1HK'),(3,5,'ДГТодорова','$2b$10$XKMFVoOtH8YvEJtfefUJp.UBNBzjLkPvPpZ8OWH5HV42eHr7xcfk.'),(3,6,'ВДЗлатев','$2b$10$I7hmn9rwAyKWhFlxjPQ4e.pVVfj3bvSh2NFhWvpH6vTT.KpqHK0Qu'),(3,7,'СКЗлатев','$2b$10$Blb5H0fUAae6HCV5ONsZheFqYDuEfqGLMrjByxoErJX0dmKfXm4fy'),(3,8,'ПВИванов','$2b$10$5iyy3WRg634IaO5OXrQbSO.hL0pPl2yVKY7Dh0IoVpbebOyyh/8wG'),(2,9,'toner','$2b$10$aW3udL1o62xOJOcJybYBBu45b5xIa3MzSNForzbf0B74hLoCLFlyW');
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

-- Dump completed on 2024-02-07 19:17:31
