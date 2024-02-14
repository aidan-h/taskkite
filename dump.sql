-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: todo_app
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `label`
--

DROP TABLE IF EXISTS `label`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `label` (
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`project_id`,`task_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `label`
--

LOCK TABLES `label` WRITE;
/*!40000 ALTER TABLE `label` DISABLE KEYS */;
/*!40000 ALTER TABLE `label` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `project_id` int NOT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`project_id`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `owner` varchar(50) NOT NULL,
  `task_count` int NOT NULL DEFAULT '0',
  `history_count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (4,'Home','aidanhammond2003@gmail.com',5,23);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_history`
--

DROP TABLE IF EXISTS `project_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_history` (
  `project_id` int NOT NULL,
  `id` int NOT NULL,
  `event` varchar(50) NOT NULL,
  `data` json NOT NULL,
  PRIMARY KEY (`project_id`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_history`
--

LOCK TABLES `project_history` WRITE;
/*!40000 ALTER TABLE `project_history` DISABLE KEYS */;
INSERT INTO `project_history` VALUES (1,1,'createTask','{\"name\": \"Task name\", \"description\": \"\"}'),(1,2,'createTask','{\"name\": \"Task namess\", \"description\": \"\"}'),(1,3,'createTask','{\"name\": \"Task names\", \"description\": \"\"}'),(1,4,'createTask','{\"name\": \"Task names\", \"description\": \"\"}'),(1,5,'createTask','{\"name\": \"Task namex\", \"description\": \"\"}'),(1,6,'createTask','{\"name\": \"Task nameds\", \"description\": \"\"}'),(1,7,'deleteTask','{\"id\": 5}'),(1,8,'deleteTask','{\"id\": 4}'),(1,9,'deleteTask','{\"id\": 3}'),(1,10,'deleteTask','{\"id\": 2}'),(1,11,'deleteTask','{\"id\": 1}'),(1,12,'deleteTask','{\"id\": 6}'),(1,13,'createTask','{\"name\": \"New Task\"}'),(1,14,'editTask','{\"id\": 7, \"name\": \"New Taskds\", \"archived\": false, \"completed\": false, \"description\": \"\"}'),(1,15,'editTask','{\"id\": 7, \"name\": \"New Taskds\", \"archived\": true, \"completed\": false, \"description\": \"\"}'),(2,1,'createTask','{\"name\": \"New Taskds\"}'),(4,1,'createTask','{\"name\": \"Take out trash\", \"description\": \"Trash comes on Wednesdays.\"}'),(4,2,'createTask','{\"name\": \"Clean kitchen\"}'),(4,3,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": true, \"description\": \"Trash comes on Wednesdays.\"}'),(4,4,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": false, \"description\": \"Trash comes on Wednesdays.\"}'),(4,5,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": true, \"description\": \"Trash comes on Wednesdays.\"}'),(4,6,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": false, \"description\": \"Trash comes on Wednesdays.\"}'),(4,7,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": true, \"description\": \"Trash comes on Wednesdays.\"}'),(4,8,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": false, \"description\": \"Trash comes on Wednesdays.\"}'),(4,9,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": true, \"description\": \"Trash comes on Wednesdays.\"}'),(4,10,'editTask','{\"id\": 1, \"name\": \"Clean kitchen\", \"archived\": false, \"completed\": true}'),(4,11,'editTask','{\"id\": 1, \"name\": \"Clean kitchen\", \"archived\": false, \"completed\": false}'),(4,12,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": false, \"description\": \"Trash comes on Wednesdays.\"}'),(4,13,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": true, \"description\": \"Trash comes on Wednesdays.\"}'),(4,14,'editTask','{\"id\": 1, \"name\": \"Clean kitchen\", \"archived\": false, \"completed\": true}'),(4,15,'editTask','{\"id\": 1, \"name\": \"Clean kitchen\", \"archived\": false, \"completed\": false}'),(4,16,'editTask','{\"id\": 0, \"name\": \"Take out trash\", \"archived\": false, \"completed\": false, \"description\": \"Trash comes on Wednesdays.\"}'),(4,17,'editTask','{\"id\": 2, \"completed\": true}'),(4,18,'addLabel','{\"id\": 3, \"name\": \"Chore\"}'),(4,19,'createTask','{\"name\": \"New Task\"}'),(4,20,'addLabel','{\"id\": 3, \"name\": \"Nice\"}'),(4,21,'deleteLabel','{\"id\": 3, \"name\": \"Nice\"}'),(4,22,'deleteLabel','{\"id\": 3, \"name\": \"Chore\"}'),(4,23,'createTask','{\"name\": \"New Taskss\"}');
/*!40000 ALTER TABLE `project_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `project_id` int NOT NULL,
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text,
  `archived` tinyint(1) NOT NULL,
  `completed` tinyint(1) NOT NULL,
  `due_date` date DEFAULT NULL,
  `due_time` time DEFAULT NULL,
  PRIMARY KEY (`project_id`,`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (1,7,'New Taskds','',1,0,NULL,NULL),(2,1,'New Taskds','',0,0,NULL,NULL),(4,2,'Take out trash','Trash comes on Wednesdays.',1,0,NULL,NULL),(4,3,'Clean kitchen','',0,0,NULL,NULL),(4,4,'New Task','',0,0,NULL,NULL),(4,5,'New Taskss','',0,0,NULL,NULL);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_history`
--

DROP TABLE IF EXISTS `task_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_history` (
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`project_id`,`task_id`,`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_history`
--

LOCK TABLES `task_history` WRITE;
/*!40000 ALTER TABLE `task_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email` varchar(50) NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('aidanhammond2003@gmail.com','Aidan Hammond');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-31 11:00:14
