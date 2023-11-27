--inserting the old code to create the tables didn't work for me for some reason (referencing tables that don't exist)
--this worked (reordered the tables): (for schema "teamprojectdb")

-- Role Table
CREATE TABLE `teamprojectdb`.`role` (
  `RoleId` INT NOT NULL DEFAULT 0 COMMENT 'Default is \"user\" (default id for user entries is RoleId=2).' ,
  `RoleName` varchar(45) NOT NULL,
  PRIMARY KEY (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Firm Table
CREATE TABLE `teamprojectdb`.`firm` (
  `FirmId` int NOT NULL AUTO_INCREMENT,
  `FirmName` varchar(255) NOT NULL,
  `FirmAddress` varchar(255) NOT NULL,
  PRIMARY KEY (`FirmId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


-- Statuses Table
CREATE TABLE `teamprojectdb`.`statuses` (
  `StatusId` int NOT NULL AUTO_INCREMENT,
  `StatusName` varchar(255) NOT NULL,
  PRIMARY KEY (`StatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


-- Users Table
CREATE TABLE `teamprojectdb`.`users` (
  `Role_RoleId` int NOT NULL DEFAULT '2',
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`UserId`),
  KEY `fk_Users_Role1_idx` (`Role_RoleId`),
  CONSTRAINT `fk_Users_Role1` FOREIGN KEY (`Role_RoleId`) REFERENCES `role` (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;


-- Customer Table
CREATE TABLE `teamprojectdb`.`customer` (
  `CustId` int NOT NULL AUTO_INCREMENT,
  `CustName` varchar(45) NOT NULL,
  `PhoneNumber` varchar(10) NOT NULL,
  `Address` VARCHAR(90) NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`CustId`),
  KEY `fk_Customer_Users_idx` (`UserId`),
  CONSTRAINT `fk_Customer_Users` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;


-- Employees Table
CREATE TABLE `teamprojectdb`.`employees` (
  `Firm_FirmId` int NOT NULL,
  `Users_UserId` int NOT NULL,
  `EmpId` int NOT NULL AUTO_INCREMENT,
  `EmpType` int NOT NULL,
  PRIMARY KEY (`EmpId`),
  KEY `fk_Employees_Firm1_idx` (`Firm_FirmId`),
  KEY `fk_Employees_Users1_idx` (`Users_UserId`),
  CONSTRAINT `fk_Employees_Firm1` FOREIGN KEY (`Firm_FirmId`) REFERENCES `firm` (`FirmId`),
  CONSTRAINT `fk_Employees_Users1` FOREIGN KEY (`Users_UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


-- Offices Table
CREATE TABLE `teamprojectdb`.`offices` (
  `Firm_FirmId` int NOT NULL,
  `OfficeId` int NOT NULL AUTO_INCREMENT,
  `OfficeName` varchar(255) NOT NULL,
  PRIMARY KEY (`OfficeId`),
  KEY `fk_offices_Firm1_idx` (`Firm_FirmId`),
  CONSTRAINT `fk_offices_Firm1` FOREIGN KEY (`Firm_FirmId`) REFERENCES `firm` (`FirmId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Parcels Table
CREATE TABLE `teamprojectdb`.`parcels` (
  `ParcelsId` int NOT NULL AUTO_INCREMENT,
  `SenderId` int NOT NULL,
  `ReceiverId` int NOT NULL,
  `OfficeOrAddress` int NOT NULL,
  `SenderAddress` varchar(45) NOT NULL,
  `DeliveryAddress` varchar(255) NOT NULL,
  `Weight` double NOT NULL,
  `Price` double NOT NULL,
  `StatusId` int DEFAULT NULL,
  `EmpId` int DEFAULT NULL,
  PRIMARY KEY (`ParcelsId`),
  KEY `fk_packages_clients1_idx` (`SenderId`),
  KEY `fk_packages_clients2_idx` (`ReceiverId`),
  KEY `fk_packages_statuses1_idx` (`StatusId`),
  KEY `fk_packages_employees1_idx` (`EmpId`),
  CONSTRAINT `fk_packages_clients1` FOREIGN KEY (`SenderId`) REFERENCES `customer` (`CustId`),
  CONSTRAINT `fk_packages_clients2` FOREIGN KEY (`ReceiverId`) REFERENCES `customer` (`CustId`),
  CONSTRAINT `fk_packages_employees1` FOREIGN KEY (`EmpId`) REFERENCES `employees` (`EmpId`),
  CONSTRAINT `fk_packages_statuses1` FOREIGN KEY (`StatusId`) REFERENCES `statuses` (`StatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;




