-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 11. Okt 2014 um 20:50
-- Server Version: 5.6.16
-- PHP-Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `feedme`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `concepts`
--

CREATE TABLE IF NOT EXISTS `concepts` (
  `CONCEPT_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CONCEPT_NAME` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CONCEPT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `favourite_recipe`
--

CREATE TABLE IF NOT EXISTS `favourite_recipe` (
  `ID` bigint(20) NOT NULL,
  `RECIPE_ID` bigint(20) NOT NULL,
  `USER_ID` bigint(20) NOT NULL,
  `TITLE` varchar(500) DEFAULT NULL,
  `INSTRUCTIONS` varchar(5000) DEFAULT NULL,
  `TIME_TO_WORK` int(11) DEFAULT NULL,
  `VEGAN` tinyint(1) DEFAULT NULL,
  `VEGETARIAN` tinyint(1) DEFAULT NULL,
  `ANTIALC` tinyint(1) DEFAULT NULL,
  `IMG_SRC` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`RECIPE_ID`,`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `favourite_recipe`
--

INSERT INTO `favourite_recipe` (`ID`, `RECIPE_ID`, `USER_ID`, `TITLE`, `INSTRUCTIONS`, `TIME_TO_WORK`, `VEGAN`, `VEGETARIAN`, `ANTIALC`, `IMG_SRC`) VALUES
(28326, 1333351238245401, 1, 'Luftiger Mandarinenquark', 'Als Erstes die Mandarinen abtropfen lassen und den Saft in einem Topf auffangen. Honig, Orangensaft, Vanillezucker hinzugeben und einkÃ¶cheln lassen.<br />\r\n<br />\r\nWÃ¤hrenddessen die Sahne in einer SchÃ¼ssel steif schlagen und danach den Quark unterheben. Nun auch die Mandarinen unterrÃ¼hren.<br />\r\n<br />\r\nWenn die Saftmasse zur HÃ¤lfte eingekocht ist, abkÃ¼hlen lassen und langsam hineinrÃ¼hren. Bei Bedarf mit Honig nachsÃ¼ÃŸen. Das Ganze 1 - 2 Stunden im KÃ¼hlschrank ziehen lassen.', -1, 0, 0, 1, './res/images/ajax-loader.gif'),
(28325, 1739191282903950, 1, 'LammrÃ¼cken mit Senf - Thymian - Kruste', 'Zwiebeln und Kartoffeln schÃ¤len. Spargel, MÃ¶hren und Zuckerschoten putzen und  das Fleisch trocken tupfen. <br />\r\n<br />\r\n1 EL Ã–l erhitzen und das Fleisch darin anbraten. Salzen und pfeffern. Kartoffeln, MÃ¶hren, Zwiebeln, BrÃ¼he und Wein dazugeben und alles ca. 35 Minuten schmoren. <br />\r\n<br />\r\n1 EL Ã–l erhitzen und den Spargel darin unter gelegentlichem Wenden ca. 15 Minuten braten. Die Zuckerschoten noch 5 Minuten mitbraten.<br />\r\n<br />\r\nSenf, Paniermehl und Thymian miteinander verrÃ¼hren. Das Fleisch aus dem Fond nehmen, mit der Mischung bestreichen und ca. 3 Minuten Ã¼bergrillen. <br />\r\n<br />\r\nSpargel und Zuckerschoten zum GemÃ¼se im Fond geben, alles noch ca. 3 Minuten kÃ¶cheln lassen und abschmecken. <br />\r\n<br />\r\nDas Fleisch aufschneiden und mit dem GemÃ¼se und dem Fond anrichten.', -1, 0, 0, 0, './res/images/ajax-loader.gif');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ingerdients_dislikes`
--

CREATE TABLE IF NOT EXISTS `ingerdients_dislikes` (
  `USER_ID` int(11) NOT NULL,
  `INGREDIENT_NAME` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ingredients_likes`
--

CREATE TABLE IF NOT EXISTS `ingredients_likes` (
  `USER_ID` bigint(20) NOT NULL,
  `INGREDIENT_NAME` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `USER_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `Password` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_concepts`
--

CREATE TABLE IF NOT EXISTS `user_concepts` (
  `USER_ID` int(11) NOT NULL,
  `CONCEPT_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
