-- =========================================================
-- SCRIPT CORRIGIDO
-- Ajustes feitos:
--  - Vírgulas sobrando antes de ")" removidas
--  - VARCHAR agora com tamanho definido
--  - AUTO_INCREMENT em todas as PKs
--  - ENGINE=InnoDB (necessário para FKs funcionarem)
--  - phone/whatsapp como VARCHAR (não INT)
--  - password com tamanho compatível com hash (bcrypt/argon2)
--  - UNIQUE em users.email e tokens.token
--  - Relação users <-> tokens corrigida (removido idtokens de users)
--  - Relação users <-> roles corrigida (role_id em users referencia roles)
--  - ON DELETE / ON UPDATE definidos nas FKs
--  - created_at / updated_at agora preenchidos automaticamente
--    (DEFAULT CURRENT_TIMESTAMP e ON UPDATE CURRENT_TIMESTAMP)
-- =========================================================
CREATE DATABASE db_studioorofacial;

USE db_studioorofacial;

CREATE TABLE main
(
    id_main    INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title      VARCHAR(150) NOT NULL,
    subtitle   VARCHAR(255) NOT NULL,
    id_user    INT
) ENGINE=InnoDB;
 
CREATE TABLE home_carousel
(
    id_carousel       INT PRIMARY KEY AUTO_INCREMENT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title             VARCHAR(150) NOT NULL,
    description       VARCHAR(500),
    background_image  VARCHAR(255) NOT NULL,
    id_user           INT
) ENGINE=InnoDB;
 
CREATE TABLE home_info
(
    id_info    INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    text       VARCHAR(1000) NOT NULL,
    image      VARCHAR(255) NOT NULL,
    id_user    INT
) ENGINE=InnoDB;
 
CREATE TABLE about_principles
(
    id_principle INT PRIMARY KEY AUTO_INCREMENT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    icon         VARCHAR(255),
    text         VARCHAR(500) NOT NULL,
    title        VARCHAR(150) NOT NULL,
    id_user      INT
) ENGINE=InnoDB;
 
CREATE TABLE about_team
(
    id_team     INT PRIMARY KEY AUTO_INCREMENT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    specialist  VARCHAR(150) NOT NULL,
    university  VARCHAR(150) NOT NULL,
    education   VARCHAR(255) NOT NULL,
    image       VARCHAR(255) NOT NULL,
    id_user     INT
) ENGINE=InnoDB;
 
CREATE TABLE about_differentials
(
    id_differential INT PRIMARY KEY AUTO_INCREMENT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    description     VARCHAR(500) NOT NULL,
    id_user         INT
) ENGINE=InnoDB;
 
CREATE TABLE catalog_item
(
    id_item            INT PRIMARY KEY AUTO_INCREMENT,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title              VARCHAR(150),
    short_description  VARCHAR(500),
    modal_description  VARCHAR(2000),
    id_user            INT
) ENGINE=InnoDB;
 
CREATE TABLE contact_message
(
    id_message INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    message    VARCHAR(2000) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    name       VARCHAR(150) NOT NULL,
    id_user    INT
) ENGINE=InnoDB;
 
CREATE TABLE contact_location
(
    id_location INT PRIMARY KEY AUTO_INCREMENT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    maps_url    VARCHAR(500),
    address     VARCHAR(255) NOT NULL,
    id_user     INT
) ENGINE=InnoDB;
 
CREATE TABLE contact_info
(
    id_info      INT PRIMARY KEY AUTO_INCREMENT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    service_text VARCHAR(500) NOT NULL,
    whatsapp     VARCHAR(20) NOT NULL,
    phone        VARCHAR(20),
    id_user      INT
) ENGINE=InnoDB;
 
CREATE TABLE roles
(
    id_role   INT PRIMARY KEY AUTO_INCREMENT,
    name_role VARCHAR(50) NOT NULL
) ENGINE=InnoDB;
 
CREATE TABLE users
(
    id_user    INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status     TINYINT NOT NULL DEFAULT 1,
    role_id    INT NOT NULL,
    phone      VARCHAR(20) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    login      VARCHAR(100) NOT NULL UNIQUE,
    name       VARCHAR(150)
) ENGINE=InnoDB;
 
CREATE TABLE tokens
(
    id_token   INT PRIMARY KEY AUTO_INCREMENT,
    token      VARCHAR(255) UNIQUE,
    expires_at DATETIME,
    id_user    INT
) ENGINE=InnoDB;
 
CREATE TABLE about_history
(
    id_history INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title      VARCHAR(150) NOT NULL,
    text       VARCHAR(2000) NOT NULL,
    image      VARCHAR(255) NOT NULL,
    id_user    INT
) ENGINE=InnoDB;
 
-- =========================================================
-- FOREIGN KEYS
-- ON DELETE SET NULL: se o usuário for apagado, o conteúdo
-- criado por ele permanece no site, só perde o vínculo.
-- Ajuste para CASCADE se preferir apagar o conteúdo junto.
-- =========================================================
 
ALTER TABLE main
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE home_carousel
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE home_info
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE about_principles
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE about_team
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE about_differentials
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE catalog_item
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE contact_message
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE contact_location
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE contact_info
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
ALTER TABLE about_history
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE SET NULL ON UPDATE CASCADE;
 
-- Um usuário pode ter vários tokens (sessões/refresh tokens)
ALTER TABLE tokens
    ADD FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON DELETE CASCADE ON UPDATE CASCADE;
 
-- Um usuário tem um cargo (role); um cargo pode ter vários usuários
ALTER TABLE users
    ADD FOREIGN KEY (role_id) REFERENCES roles (id_role)
    ON DELETE RESTRICT ON UPDATE CASCADE;
