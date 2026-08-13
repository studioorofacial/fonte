
-- CREATE DATABASE db_studioorofacial;
USE db_studioorofacial ;
-- =========================================================
-- SCHEMA CORRIGIDO - Boas práticas MySQL / MySQL Workbench
-- =========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- USERS / ROLES / TOKENS (base de autenticação)
-- ---------------------------------------------------------

CREATE TABLE roles (
  id_role     INT PRIMARY KEY AUTO_INCREMENT,
  name_role   VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
  id_user     INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  name        VARCHAR(150),
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  role_id     INT NOT NULL,
  status      TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (role_id) REFERENCES roles (id_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tokens (
  id_token    INT PRIMARY KEY AUTO_INCREMENT,
  token       VARCHAR(255) NOT NULL,
  expires_at  DATETIME NOT NULL,
  id_user     INT NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- HOME
-- ---------------------------------------------------------

CREATE TABLE home_main (
  id_main     INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title       VARCHAR(150) NOT NULL,
  subtitle    VARCHAR(255) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE home_carousel (
  id_carousel       INT PRIMARY KEY AUTO_INCREMENT,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title             VARCHAR(150) NOT NULL,
  description       VARCHAR(255),
  background_image  VARCHAR(255) NOT NULL,
  id_user           INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE home_info (
  id_info     INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  text        VARCHAR(500) NOT NULL,
  image       VARCHAR(255) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- ABOUT
-- ---------------------------------------------------------

CREATE TABLE about_main (
  id_main     INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title       VARCHAR(150),
  subtitle    VARCHAR(255) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE about_history (
  id_history  INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title       VARCHAR(150) NOT NULL,
  text        VARCHAR(1000) NOT NULL,
  image       VARCHAR(255) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE about_principles (
  id_principle  INT PRIMARY KEY AUTO_INCREMENT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  icon          VARCHAR(255),
  title         VARCHAR(150) NOT NULL,
  text          VARCHAR(500) NOT NULL,
  id_user       INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE about_team (
  id_team      INT PRIMARY KEY AUTO_INCREMENT,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  specialist   VARCHAR(150) NOT NULL,
  university   VARCHAR(150) NOT NULL,
  education    VARCHAR(150) NOT NULL,
  image        VARCHAR(255) NOT NULL,
  id_user      INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE about_differentials (
  id_differential  INT PRIMARY KEY AUTO_INCREMENT,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  description      VARCHAR(500) NOT NULL,
  id_user          INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- CATALOG
-- ---------------------------------------------------------

CREATE TABLE catalog_main (
  id_main     INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title       VARCHAR(150) NOT NULL,
  subtitle    VARCHAR(255) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE catalog_item (
  id_item            INT PRIMARY KEY AUTO_INCREMENT,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title              VARCHAR(150),
  short_description  VARCHAR(255),
  modal_description  VARCHAR(1000),
  id_user            INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- CONTACT
-- ---------------------------------------------------------

CREATE TABLE contact_main (
  id_main     INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title       VARCHAR(150) NOT NULL,
  subtitle    VARCHAR(255) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contact_location (
  id_location  INT PRIMARY KEY AUTO_INCREMENT,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  address      VARCHAR(255) NOT NULL,
  maps_url     VARCHAR(500),
  id_user      INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contact_info (
  id_info       INT PRIMARY KEY AUTO_INCREMENT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  service_text  VARCHAR(500) NOT NULL,
  whatsapp      VARCHAR(20) NOT NULL,
  phone         VARCHAR(20),
  id_user       INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contact_message (
  id_message  INT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  message     VARCHAR(1000) NOT NULL,
  id_user     INT,
  FOREIGN KEY (id_user) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- HISTÓRICO DE ALTERAÇÕES (auditoria via triggers)
-- Execute DEPOIS de criar o schema principal (schema_corrigido.sql)
-- =========================================================
-- Padrão: cada tabela de conteúdo X ganha uma tabela X_history.
-- Antes de um UPDATE ou DELETE, o estado ANTERIOR do registro
-- é copiado para a tabela de histórico automaticamente.
-- A tabela principal sempre reflete o estado ATIVO (usado no front-end).
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- HOME_MAIN
-- ---------------------------------------------------------

CREATE TABLE home_main_history (
  id_history  INT PRIMARY KEY AUTO_INCREMENT,
  id_main     INT NOT NULL,
  title       VARCHAR(150),
  subtitle    VARCHAR(255),
  action      ENUM('UPDATE','DELETE') NOT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by  INT,
  FOREIGN KEY (id_main) REFERENCES home_main (id_main) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_home_main_update
AFTER UPDATE ON home_main
FOR EACH ROW
BEGIN
  INSERT INTO home_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_home_main_delete
BEFORE DELETE ON home_main
FOR EACH ROW
BEGIN
  INSERT INTO home_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- HOME_CAROUSEL
-- ---------------------------------------------------------

CREATE TABLE home_carousel_history (
  id_history        INT PRIMARY KEY AUTO_INCREMENT,
  id_carousel       INT NOT NULL,
  title             VARCHAR(150),
  description       VARCHAR(255),
  background_image  VARCHAR(255),
  action            ENUM('UPDATE','DELETE') NOT NULL,
  changed_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by        INT,
  FOREIGN KEY (id_carousel) REFERENCES home_carousel (id_carousel) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_home_carousel_update
AFTER UPDATE ON home_carousel
FOR EACH ROW
BEGIN
  INSERT INTO home_carousel_history (id_carousel, title, description, background_image, action, changed_by)
  VALUES (OLD.id_carousel, OLD.title, OLD.description, OLD.background_image, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_home_carousel_delete
BEFORE DELETE ON home_carousel
FOR EACH ROW
BEGIN
  INSERT INTO home_carousel_history (id_carousel, title, description, background_image, action, changed_by)
  VALUES (OLD.id_carousel, OLD.title, OLD.description, OLD.background_image, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- HOME_INFO
-- ---------------------------------------------------------

CREATE TABLE home_info_history (
  id_history  INT PRIMARY KEY AUTO_INCREMENT,
  id_info     INT NOT NULL,
  text        VARCHAR(500),
  image       VARCHAR(255),
  action      ENUM('UPDATE','DELETE') NOT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by  INT,
  FOREIGN KEY (id_info) REFERENCES home_info (id_info) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_home_info_update
AFTER UPDATE ON home_info
FOR EACH ROW
BEGIN
  INSERT INTO home_info_history (id_info, text, image, action, changed_by)
  VALUES (OLD.id_info, OLD.text, OLD.image, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_home_info_delete
BEFORE DELETE ON home_info
FOR EACH ROW
BEGIN
  INSERT INTO home_info_history (id_info, text, image, action, changed_by)
  VALUES (OLD.id_info, OLD.text, OLD.image, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- ABOUT_MAIN
-- ---------------------------------------------------------

CREATE TABLE about_main_history (
  id_history  INT PRIMARY KEY AUTO_INCREMENT,
  id_main     INT NOT NULL,
  title       VARCHAR(150),
  subtitle    VARCHAR(255),
  action      ENUM('UPDATE','DELETE') NOT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by  INT,
  FOREIGN KEY (id_main) REFERENCES about_main (id_main) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_about_main_update
AFTER UPDATE ON about_main
FOR EACH ROW
BEGIN
  INSERT INTO about_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_about_main_delete
BEFORE DELETE ON about_main
FOR EACH ROW
BEGIN
  INSERT INTO about_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- ABOUT_HISTORY (conteúdo da página, não confundir com auditoria)
-- ---------------------------------------------------------

CREATE TABLE about_history_history (
  id_audit    INT PRIMARY KEY AUTO_INCREMENT,
  id_history  INT NOT NULL,
  title       VARCHAR(150),
  text        VARCHAR(1000),
  image       VARCHAR(255),
  action      ENUM('UPDATE','DELETE') NOT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by  INT,
  FOREIGN KEY (id_history) REFERENCES about_history (id_history) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_about_history_update
AFTER UPDATE ON about_history
FOR EACH ROW
BEGIN
  INSERT INTO about_history_history (id_history, title, text, image, action, changed_by)
  VALUES (OLD.id_history, OLD.title, OLD.text, OLD.image, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_about_history_delete
BEFORE DELETE ON about_history
FOR EACH ROW
BEGIN
  INSERT INTO about_history_history (id_history, title, text, image, action, changed_by)
  VALUES (OLD.id_history, OLD.title, OLD.text, OLD.image, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- ABOUT_PRINCIPLES
-- ---------------------------------------------------------

CREATE TABLE about_principles_history (
  id_audit      INT PRIMARY KEY AUTO_INCREMENT,
  id_principle  INT NOT NULL,
  icon          VARCHAR(255),
  title         VARCHAR(150),
  text          VARCHAR(500),
  action        ENUM('UPDATE','DELETE') NOT NULL,
  changed_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by    INT,
  FOREIGN KEY (id_principle) REFERENCES about_principles (id_principle) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_about_principles_update
AFTER UPDATE ON about_principles
FOR EACH ROW
BEGIN
  INSERT INTO about_principles_history (id_principle, icon, title, text, action, changed_by)
  VALUES (OLD.id_principle, OLD.icon, OLD.title, OLD.text, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_about_principles_delete
BEFORE DELETE ON about_principles
FOR EACH ROW
BEGIN
  INSERT INTO about_principles_history (id_principle, icon, title, text, action, changed_by)
  VALUES (OLD.id_principle, OLD.icon, OLD.title, OLD.text, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- ABOUT_TEAM
-- ---------------------------------------------------------

CREATE TABLE about_team_history (
  id_audit     INT PRIMARY KEY AUTO_INCREMENT,
  id_team      INT NOT NULL,
  specialist   VARCHAR(150),
  university   VARCHAR(150),
  education    VARCHAR(150),
  image        VARCHAR(255),
  action       ENUM('UPDATE','DELETE') NOT NULL,
  changed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by   INT,
  FOREIGN KEY (id_team) REFERENCES about_team (id_team) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_about_team_update
AFTER UPDATE ON about_team
FOR EACH ROW
BEGIN
  INSERT INTO about_team_history (id_team, specialist, university, education, image, action, changed_by)
  VALUES (OLD.id_team, OLD.specialist, OLD.university, OLD.education, OLD.image, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_about_team_delete
BEFORE DELETE ON about_team
FOR EACH ROW
BEGIN
  INSERT INTO about_team_history (id_team, specialist, university, education, image, action, changed_by)
  VALUES (OLD.id_team, OLD.specialist, OLD.university, OLD.education, OLD.image, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- ABOUT_DIFFERENTIALS
-- ---------------------------------------------------------

CREATE TABLE about_differentials_history (
  id_audit         INT PRIMARY KEY AUTO_INCREMENT,
  id_differential  INT NOT NULL,
  description      VARCHAR(500),
  action           ENUM('UPDATE','DELETE') NOT NULL,
  changed_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by       INT,
  FOREIGN KEY (id_differential) REFERENCES about_differentials (id_differential) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_about_differentials_update
AFTER UPDATE ON about_differentials
FOR EACH ROW
BEGIN
  INSERT INTO about_differentials_history (id_differential, description, action, changed_by)
  VALUES (OLD.id_differential, OLD.description, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_about_differentials_delete
BEFORE DELETE ON about_differentials
FOR EACH ROW
BEGIN
  INSERT INTO about_differentials_history (id_differential, description, action, changed_by)
  VALUES (OLD.id_differential, OLD.description, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- CATALOG_MAIN
-- ---------------------------------------------------------

CREATE TABLE catalog_main_history (
  id_audit    INT PRIMARY KEY AUTO_INCREMENT,
  id_main     INT NOT NULL,
  title       VARCHAR(150),
  subtitle    VARCHAR(255),
  action      ENUM('UPDATE','DELETE') NOT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by  INT,
  FOREIGN KEY (id_main) REFERENCES catalog_main (id_main) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_catalog_main_update
AFTER UPDATE ON catalog_main
FOR EACH ROW
BEGIN
  INSERT INTO catalog_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_catalog_main_delete
BEFORE DELETE ON catalog_main
FOR EACH ROW
BEGIN
  INSERT INTO catalog_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- CATALOG_ITEM
-- ---------------------------------------------------------

CREATE TABLE catalog_item_history (
  id_audit           INT PRIMARY KEY AUTO_INCREMENT,
  id_item            INT NOT NULL,
  title              VARCHAR(150),
  short_description  VARCHAR(255),
  modal_description  VARCHAR(1000),
  action             ENUM('UPDATE','DELETE') NOT NULL,
  changed_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by         INT,
  FOREIGN KEY (id_item) REFERENCES catalog_item (id_item) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_catalog_item_update
AFTER UPDATE ON catalog_item
FOR EACH ROW
BEGIN
  INSERT INTO catalog_item_history (id_item, title, short_description, modal_description, action, changed_by)
  VALUES (OLD.id_item, OLD.title, OLD.short_description, OLD.modal_description, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_catalog_item_delete
BEFORE DELETE ON catalog_item
FOR EACH ROW
BEGIN
  INSERT INTO catalog_item_history (id_item, title, short_description, modal_description, action, changed_by)
  VALUES (OLD.id_item, OLD.title, OLD.short_description, OLD.modal_description, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- CONTACT_MAIN
-- ---------------------------------------------------------

CREATE TABLE contact_main_history (
  id_audit    INT PRIMARY KEY AUTO_INCREMENT,
  id_main     INT NOT NULL,
  title       VARCHAR(150),
  subtitle    VARCHAR(255),
  action      ENUM('UPDATE','DELETE') NOT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by  INT,
  FOREIGN KEY (id_main) REFERENCES contact_main (id_main) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_contact_main_update
AFTER UPDATE ON contact_main
FOR EACH ROW
BEGIN
  INSERT INTO contact_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_contact_main_delete
BEFORE DELETE ON contact_main
FOR EACH ROW
BEGIN
  INSERT INTO contact_main_history (id_main, title, subtitle, action, changed_by)
  VALUES (OLD.id_main, OLD.title, OLD.subtitle, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- CONTACT_LOCATION
-- ---------------------------------------------------------

CREATE TABLE contact_location_history (
  id_audit     INT PRIMARY KEY AUTO_INCREMENT,
  id_location  INT NOT NULL,
  address      VARCHAR(255),
  maps_url     VARCHAR(500),
  action       ENUM('UPDATE','DELETE') NOT NULL,
  changed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by   INT,
  FOREIGN KEY (id_location) REFERENCES contact_location (id_location) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_contact_location_update
AFTER UPDATE ON contact_location
FOR EACH ROW
BEGIN
  INSERT INTO contact_location_history (id_location, address, maps_url, action, changed_by)
  VALUES (OLD.id_location, OLD.address, OLD.maps_url, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_contact_location_delete
BEFORE DELETE ON contact_location
FOR EACH ROW
BEGIN
  INSERT INTO contact_location_history (id_location, address, maps_url, action, changed_by)
  VALUES (OLD.id_location, OLD.address, OLD.maps_url, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- ---------------------------------------------------------
-- CONTACT_INFO
-- ---------------------------------------------------------

CREATE TABLE contact_info_history (
  id_audit      INT PRIMARY KEY AUTO_INCREMENT,
  id_info       INT NOT NULL,
  service_text  VARCHAR(500),
  whatsapp      VARCHAR(20),
  phone         VARCHAR(20),
  action        ENUM('UPDATE','DELETE') NOT NULL,
  changed_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by    INT,
  FOREIGN KEY (id_info) REFERENCES contact_info (id_info) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER trg_contact_info_update
AFTER UPDATE ON contact_info
FOR EACH ROW
BEGIN
  INSERT INTO contact_info_history (id_info, service_text, whatsapp, phone, action, changed_by)
  VALUES (OLD.id_info, OLD.service_text, OLD.whatsapp, OLD.phone, 'UPDATE', OLD.id_user);
END//

CREATE TRIGGER trg_contact_info_delete
BEFORE DELETE ON contact_info
FOR EACH ROW
BEGIN
  INSERT INTO contact_info_history (id_info, service_text, whatsapp, phone, action, changed_by)
  VALUES (OLD.id_info, OLD.service_text, OLD.whatsapp, OLD.phone, 'DELETE', OLD.id_user);
END//
DELIMITER ;

-- Nota: contact_message não precisa de histórico — mensagens de contato
-- não são "editadas" pelo admin, são registros únicos de entrada (leads).

SET FOREIGN_KEY_CHECKS = 1;

