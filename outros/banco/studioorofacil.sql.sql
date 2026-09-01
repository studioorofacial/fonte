-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: db_studioorofacial
-- ------------------------------------------------------
-- Server version	8.3.0

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
-- Table structure for table `about_differentials`
--

DROP TABLE IF EXISTS `about_differentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_differentials` (
  `id_differential` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(500) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_differential`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `about_differentials_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_differentials`
--

LOCK TABLES `about_differentials` WRITE;
/*!40000 ALTER TABLE `about_differentials` DISABLE KEYS */;
INSERT INTO `about_differentials` VALUES (1,'2026-08-25 21:19:35','2026-08-25 21:19:35','Equipe multidisciplinar especializada',1),(2,'2026-08-25 21:19:35','2026-08-25 21:19:35','Tecnologia de ponta em tratamentos',1),(3,'2026-08-25 21:19:35','2026-08-25 21:19:35','Atendimento personalizado e humanizado',1),(4,'2026-08-25 21:19:35','2026-08-25 21:19:35','Ambiente acolhedor e confortável',1),(5,'2026-08-25 21:19:35','2026-08-25 21:19:35','Planejamento individualizado para cada paciente',1);
/*!40000 ALTER TABLE `about_differentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_history`
--

DROP TABLE IF EXISTS `about_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_history` (
  `id_history` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(150) NOT NULL,
  `text` varchar(2000) NOT NULL,
  `image` varchar(255) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_history`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `about_history_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_history`
--

LOCK TABLES `about_history` WRITE;
/*!40000 ALTER TABLE `about_history` DISABLE KEYS */;
INSERT INTO `about_history` VALUES (1,'2026-08-25 21:19:35','2026-09-01 19:48:51','Nossa História','Nós estamos no mercado a 6 anos, iniciei sozinha e hoje nossa equipe é composta por 4 especialistas. Antes de virar Studio Orofacial, possuía outro nome JCOdontologia (uma homenagem ao meu pai). A ideia de virar um Studio foi pelo fato de eu ter iniciado a minha segunda pós-graduação (HOF) e eu queria trazer um novo conceito e uma nova visão para os meus pacientes com mais conforto e qualidade.\n\nEstamos no mercado há 6 anos. Comecei sozinha e, ao longo do tempo, construí uma equipe talentosa formada por quatro especialistas. Antes de nos transformarmos em Studio Orofacial, atuávamos como JCOdontologia — um nome escolhido em homenagem ao meu pai.\n\nA mudança para o formato de Studio surgiu quando iniciei minha segunda pós-graduação em Harmonização Orofacial (HOF). Esse novo ciclo despertou em mim o desejo de oferecer um conceito mais moderno, com uma visão ampliada do cuidado e um atendimento que proporcionasse ainda mais conforto, qualidade e bem-estar aos nossos pacientes.','img/1788302931749-2024-04-16.jpg',1);
/*!40000 ALTER TABLE `about_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_principles`
--

DROP TABLE IF EXISTS `about_principles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_principles` (
  `id_principle` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `icon` varchar(255) DEFAULT NULL,
  `text` varchar(500) NOT NULL,
  `title` varchar(150) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_principle`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `about_principles_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_principles`
--

LOCK TABLES `about_principles` WRITE;
/*!40000 ALTER TABLE `about_principles` DISABLE KEYS */;
INSERT INTO `about_principles` VALUES (1,'2026-08-25 21:19:35','2026-08-25 21:19:35','bi bi-bullseye','Proporcionar saúde, beleza e bem-estar através de um atendimento humanizado e personalizado, devolvendo autoestima e confiança a cada mulher que passa pelo Studio. Nosso compromisso é compreender profundamente suas dores e desejos para transformar sua experiência estética em cuidado, acolhimento e resultados reais.','Missão',1),(2,'2026-08-25 21:19:35','2026-08-25 21:19:35','bi bi-eye','Ser referência em saúde estética para mulheres 30+, reconhecido pela excelência no atendimento individualizado, pela inovação em tratamentos e pela capacidade de gerar resultados que elevem a autoestima e promovam uma relação positiva com a própria imagem.','Visão',1),(3,'2026-08-25 21:19:35','2026-08-25 21:19:35','bi bi-heart','Humanização: acolher cada paciente com empatia, respeito e sensibilidade. Personalização: oferecer tratamentos exclusivos, pensados de acordo com as necessidades e objetivos individuais. Resultados reais: focar em entregas que transformem, valorizem e empoderem cada mulher.','Valores',1);
/*!40000 ALTER TABLE `about_principles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_team`
--

DROP TABLE IF EXISTS `about_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_team` (
  `id_team` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `specialist` varchar(150) NOT NULL,
  `university` varchar(150) NOT NULL,
  `education` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_team`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `about_team_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_team`
--

LOCK TABLES `about_team` WRITE;
/*!40000 ALTER TABLE `about_team` DISABLE KEYS */;
INSERT INTO `about_team` VALUES (1,'2026-08-25 21:19:35','2026-09-01 20:04:59','Dra. Patricia Costa','Fundadora e Especialista em HOF','Pós-graduada em Harmonização Orofacial com mais de 10 anos de experiência.','img/1788303899050-cansstudio.jpg',1),(2,'2026-08-25 21:19:35','2026-09-01 20:05:08','Dra. Mariana Alves','Implantodontia e Estética Facial','Pós Graduação Ortodontia e Ortopedia com mais de 10 anos de experiência.','img/1788303908850-julianemonarifoto.jpg',1),(3,'2026-08-25 21:19:35','2026-09-01 19:57:41','Dr. Lucas Moreira','Especialista em Ortodontia e Ortopedia Facial','Pós-graduado em Harmonização Facial com 8 anos de experiência.','img/1788303461766-linkedin_resized.jpg',1);
/*!40000 ALTER TABLE `about_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog_item`
--

DROP TABLE IF EXISTS `catalog_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalog_item` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(150) DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `modal_description` varchar(2000) DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `catalog_item_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog_item`
--

LOCK TABLES `catalog_item` WRITE;
/*!40000 ALTER TABLE `catalog_item` DISABLE KEYS */;
INSERT INTO `catalog_item` VALUES (1,'2026-08-25 21:19:34','2026-08-25 21:19:34','Clínica Geral','A clínica geral cuida da saúde bucal como um todo, realizando diagnósticos, limpezas, restaurações e acompanhamentos periódicos. É o primeiro passo para manter dentes e gengivas saudáveis, prevenindo problemas futuros e garantindo bem-estar diário.','A clínica geral é a base da odontologia e o ponto de partida para qualquer tratamento. O dentista clínico geral realiza avaliações completas, orienta sobre hábitos de higiene, identifica problemas precocemente e realiza procedimentos fundamentais para preservar a saúde bucal. Entre eles estão profilaxias (limpezas), restaurações, aplicação de flúor, remoção de tártaro e manutenção periódica. Além disso, atua na prevenção de cáries, gengivites e outras condições que podem comprometer a saúde dos dentes e da gengiva. O clínico geral também encaminha o paciente para especialidades quando necessário, garantindo uma abordagem integrada. É um cuidado contínuo, ideal para quem deseja manter um sorriso saudável ao longo da vida.',1),(2,'2026-08-25 21:19:34','2026-08-25 21:19:34','Ortodontia','A ortodontia corrige a posição dos dentes e do maxilar, proporcionando melhora estética e funcional. Inclui aparelhos fixos, alinhadores transparentes e tratamentos que harmonizam o sorriso.','A ortodontia é a especialidade responsável por corrigir o alinhamento dos dentes e a relação entre as arcadas. Seu objetivo vai além da estética: um sorriso alinhado contribui para uma mastigação adequada, melhor higienização e prevenção de desgastes dentários. O tratamento pode ser feito com aparelhos fixos metálicos, estéticos, autoligados ou com alinhadores invisíveis, que oferecem maior conforto e discrição. Após uma avaliação completa, o ortodontista identifica o tipo de má oclusão e desenvolve um plano personalizado para movimentar os dentes de modo gradual e seguro. O acompanhamento periódico garante ajustes e a evolução contínua do tratamento. Ao final, o paciente conquista um sorriso harmônico, funcional e saudável.',1),(3,'2026-08-25 21:19:34','2026-08-25 21:19:34','Implantes Dentários','Os implantes dentários substituem dentes ausentes com segurança e naturalidade. São estruturas de titânio que devolvem função mastigatória, estética e confiança ao paciente.','Os implantes dentários são a opção mais moderna e eficaz para substituir dentes perdidos. São pequenas estruturas de titânio inseridas no osso para atuar como raízes artificiais, proporcionando estabilidade para coroas, próteses ou pontes. O procedimento é realizado com planejamento digital e técnicas avançadas que aumentam a segurança e o conforto do paciente. Após a instalação, ocorre a osseointegração, que é a união do implante ao osso, garantindo firmeza e durabilidade. Os implantes devolvem a capacidade de mastigar, falar e sorrir sem insegurança, com aparência natural e sensação de dente fixo. Além disso, ajudam a preservar o osso da região, evitando retrações faciais ao longo do tempo.',1),(4,'2026-08-25 21:19:34','2026-08-25 21:19:34','Tratamento de Canal (Endodontia)','O tratamento de canal remove a inflamação ou infecção da polpa dentária, aliviando dores e preservando o dente. É um procedimento seguro, preciso e realizado com tecnologia moderna.','O tratamento de canal, ou endodontia, é indicado quando a polpa do dente — região interna onde ficam vasos e nervos — sofre inflamação ou infecção causada por cáries profundas, fraturas ou traumas. O procedimento consiste em remover esse tecido comprometido, limpar e desinfectar o interior do dente e, em seguida, selá-lo com material especializado. Graças aos avanços tecnológicos, é possível realizar o tratamento de forma rápida, confortável e altamente previsível. Isso permite preservar o dente natural, evitando extrações e mantendo a estética e funcionalidade. Após o canal, o dente pode receber uma restauração ou coroa para reforçar sua estrutura. É uma solução eficaz para eliminar dor e preservar a saúde bucal.',1),(5,'2026-08-25 21:19:34','2026-08-25 21:19:34','Bucomaxilofacial','A cirurgia bucomaxilofacial trata problemas complexos envolvendo dentes, ossos da face, articulação da mandíbula e traumas faciais. Une precisão cirúrgica e cuidado funcional.','A especialidade de cirurgia e traumatologia bucomaxilofacial abrange tratamentos de alta complexidade relacionados às estruturas da boca, face e maxilares. O profissional atua em casos como extrações de dentes inclusos (como o siso), correções ósseas, tratamento de traumas faciais, cistos, tumores benignos, alterações da articulação temporomandibular (ATM) e deformidades que comprometem estética e função. Com exames de imagem e planejamento avançado, o cirurgião define a melhor abordagem para cada caso, sempre priorizando segurança, conforto e resultados previsíveis. O objetivo é restabelecer harmonia facial, equilíbrio funcional e qualidade de vida ao paciente.',1),(6,'2026-08-25 21:19:34','2026-08-25 21:19:34','Próteses Dentárias','As próteses dentárias substituem dentes ausentes, devolvendo função, conforto e estética ao sorriso. Podem ser fixas, removíveis ou sobre implantes.','A prótese dentária é indicada para repor um ou mais dentes perdidos, devolvendo estética, mastigação e fonética ao paciente. Existem diversos tipos: próteses fixas, pontes, próteses removíveis e próteses sobre implantes, cada uma indicada conforme a necessidade de cada caso. O processo envolve avaliação, moldagens, planejamento estético e prova de peças até atingir um resultado natural e confortável. Com materiais modernos como cerâmicas de alta resistência, é possível criar dentes extremamente semelhantes aos naturais. A prótese bem ajustada melhora a autoestima, a função oral e a harmonia facial.',1),(7,'2026-08-25 21:19:34','2026-08-25 21:19:34','Facetas Dentárias','As facetas são lâminas ultrafinas que transformam o sorriso, corrigindo forma, cor e alinhamento leve dos dentes. Proporcionam estética natural e resultados imediatos.','As facetas de porcelana, também conhecidas como lentes de contato dental, são lâminas finas que revestem a parte frontal dos dentes para corrigir imperfeições estéticas. Elas são indicadas para alterar cor, formato, tamanho, pequenas correções de alinhamento e fechamento de espaços. O tratamento começa com planejamento digital do sorriso, permitindo visualizar o resultado antes mesmo de iniciar o procedimento. Após a preparação mínima (quando necessária), as facetas são confeccionadas em laboratório e cimentadas com precisão. O resultado é um sorriso harmônico, natural e duradouro, com mínimo desgaste dentário. É um dos procedimentos mais procurados para transformação estética.',1),(8,'2026-08-25 21:19:34','2026-08-25 21:19:34','Harmonização Facial','A harmonização facial equilibra os traços do rosto por meio de procedimentos como toxina botulínica, preenchedores e bioestimuladores. Proporciona rejuvenescimento e naturalidade.','A harmonização facial é um conjunto de procedimentos realizados para equilibrar proporções, suavizar marcas de expressão e valorizar características naturais do rosto. Entre as técnicas mais utilizadas estão toxina botulínica (botox), preenchimento com ácido hialurônico, bioestimuladores de colágeno, fios de sustentação e tratamentos para contorno facial. Tudo é planejado de acordo com a anatomia e os objetivos estéticos do paciente, buscando resultados naturais e sem exageros. A harmonização pode melhorar áreas como mandíbula, queixo, lábios, olheiras, maçãs do rosto e testa. Além de estética, muitos procedimentos trazem benefícios funcionais, como redução de bruxismo e dores na ATM. O resultado é um rosto mais equilibrado, rejuvenescido e expressivo.',1);
/*!40000 ALTER TABLE `catalog_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_info`
--

DROP TABLE IF EXISTS `contact_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_info` (
  `id_info` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `service_text` varchar(500) NOT NULL,
  `whatsapp` varchar(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_info`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `contact_info_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_info`
--

LOCK TABLES `contact_info` WRITE;
/*!40000 ALTER TABLE `contact_info` DISABLE KEYS */;
INSERT INTO `contact_info` VALUES (1,'2026-08-25 21:19:35','2026-08-25 21:19:35','Horário de atendimento: 9h às 18h','(11) 97199-3704','(11) 4515-0556',1);
/*!40000 ALTER TABLE `contact_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_location`
--

DROP TABLE IF EXISTS `contact_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_location` (
  `id_location` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `maps_url` varchar(500) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_location`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `contact_location_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_location`
--

LOCK TABLES `contact_location` WRITE;
/*!40000 ALTER TABLE `contact_location` DISABLE KEYS */;
INSERT INTO `contact_location` VALUES (1,'2026-08-25 21:19:35','2026-08-25 21:37:46','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.18726362023!2d-46.45805368933215!3d-23.66926027863704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce695c580ed997%3A0x842bc9b00983116d!2sR.%20%C3%81lvares%20Machado%2C%20281%20-%20Vila%20Bocaina%2C%20Mau%C3%A1%20-%20SP%2C%2009310-020!5e0!3m2!1spt-BR!2sbr!4v1764684614849!5m2!1spt-BR!2sbr','Ed. Jurerê Internacional, 4º andar, sala 406,\nRua Álvares Machado, 281,\nVila Bocaina, Mauá - SP, 09310-020',1);
/*!40000 ALTER TABLE `contact_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_message`
--

DROP TABLE IF EXISTS `contact_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_message` (
  `id_message` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` varchar(2000) NOT NULL,
  `email` varchar(150) NOT NULL,
  `name` varchar(150) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_message`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `contact_message_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_message`
--

LOCK TABLES `contact_message` WRITE;
/*!40000 ALTER TABLE `contact_message` DISABLE KEYS */;
INSERT INTO `contact_message` VALUES (1,'2026-08-25 21:19:34','2026-08-25 21:19:34','Olá! Gostaria de saber mais sobre o tratamento de harmonização facial. Vocês têm horários disponíveis para essa semana?','carla.souza@email.com','Carla Souza',1),(2,'2026-08-25 21:19:34','2026-08-25 21:19:34','Bom dia, estou com uma dor no dente e gostaria de agendar uma avaliação o quanto antes. Qual a disponibilidade de vocês?','pedro.almeida@email.com','Pedro Almeida',1),(3,'2026-08-25 21:19:34','2026-08-25 21:19:34','Boa tarde! Vi o catálogo de serviços no site e fiquei interessada em fazer um orçamento para facetas dentárias. Podem me passar mais informações?','juliana.ferreira@email.com','Juliana Ferreira',1);
/*!40000 ALTER TABLE `contact_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_carousel`
--

DROP TABLE IF EXISTS `home_carousel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_carousel` (
  `id_carousel` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(150) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `background_image` varchar(255) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_carousel`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `home_carousel_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_carousel`
--

LOCK TABLES `home_carousel` WRITE;
/*!40000 ALTER TABLE `home_carousel` DISABLE KEYS */;
INSERT INTO `home_carousel` VALUES (1,'2026-08-25 21:19:34','2026-08-31 19:21:54','Bem-vindo ao Studio Orofacial','Sorriso e harmonia em primeiro lugar.','img/1788214914521-1.jpg',1),(2,'2026-08-25 21:19:34','2026-09-01 19:46:46','Verde, luz e acolhimento','Conheça mais nossos procedimentos','img/1788302806566-2.jpg',1),(3,'2026-08-25 21:19:34','2026-09-01 19:47:02','Seu Espaço de Equilíbrio','Ambiente confortável para realçar sua melhor versão.','img/1788302822222-3.jpg',1);
/*!40000 ALTER TABLE `home_carousel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_info`
--

DROP TABLE IF EXISTS `home_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_info` (
  `id_info` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `text` varchar(1000) NOT NULL,
  `image` varchar(255) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_info`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `home_info_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_info`
--

LOCK TABLES `home_info` WRITE;
/*!40000 ALTER TABLE `home_info` DISABLE KEYS */;
INSERT INTO `home_info` VALUES (1,'2026-08-25 21:19:34','2026-08-25 21:19:34','Nosso propósito é transformar vidas, inspirando mulheres que, por diferentes motivos, sentem medo ou vergonha de sorrir ou de se olhar no espelho. Estamos aqui para resgatar autoestima, confiança e a alegria de se reconhecer.','img/home/home2.jpg',1),(2,'2026-08-25 21:19:34','2026-08-25 21:19:34','Cuidamos do seu sorriso desde os tratamentos de clínica geral, como restaurações, limpezas e extrações, até especialidades avançadas em ortodontia, implantes, canal, bucomaxilo, próteses, facetas e harmonização facial.','img/home/home3.jpg',1);
/*!40000 ALTER TABLE `home_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main`
--

DROP TABLE IF EXISTS `main`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `main` (
  `id_main` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(150) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_main`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `main_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main`
--

LOCK TABLES `main` WRITE;
/*!40000 ALTER TABLE `main` DISABLE KEYS */;
INSERT INTO `main` VALUES (1,'2026-08-25 21:19:34','2026-08-25 21:19:34','Studio Orofacial','Conheça mais sobre nosso ambiente',1),(2,'2026-08-25 21:19:34','2026-08-25 21:19:34','Studio Orofacial','Conheça mais sobre nosso ambiente',1),(3,'2026-08-25 21:19:34','2026-08-25 21:19:34','Catálogo de serviços','Conheça mais nossos procedimentos',1),(4,'2026-08-25 21:19:34','2026-08-25 21:19:34','Entre em Contato','Responderemos o mais breve possível',1),(5,'2026-08-25 21:19:34','2026-08-25 21:19:34','Sobre o Studio Orofacial','Conheça nossa história, missão e equipe de especialistas',1);
/*!40000 ALTER TABLE `main` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name_role` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'root'),(2,'admin'),(3,'secretaria');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id_token` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_token`),
  UNIQUE KEY `token` (`token`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3MDQ0ODksImV4cCI6MTc4ODMwOTI4OX0.VZQ25FWGnaviei7uYUQdA1syBXd9zH_DxXSO8r0vNGc','2026-09-01 21:34:49',1),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3MDY2ODksImV4cCI6MTc4ODMxMTQ4OX0.1zrq_rR2Sxsbx8Rh5NtlsF1Pruyew-mchJT4AJc9tqQ','2026-09-01 22:11:30',1),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3ODI1ODUsImV4cCI6MTc4ODM4NzM4NX0.FkG6QvF23t4z_25NUaZbe-r07-8Al9m_TpPivuJzo38','2026-09-02 19:16:26',1),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3ODM4NTUsImV4cCI6MTc4ODM4ODY1NX0.sg-9PjYzoB8jTD7xyWIBdyHyFaNyKrrznYnQBGx_sss','2026-09-02 19:37:36',1),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3ODYxNTYsImV4cCI6MTc4ODM5MDk1Nn0.Qnp-bhdsaxG7dkIZQJY5wJ_CLC76ov_WD-uFgPx-Cw8','2026-09-02 20:15:56',1),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3OTA4NzYsImV4cCI6MTc4ODM5NTY3Nn0.5KP03eXa4m-FkK4PMuOIhDPacjW6exg7AEvqphsBABY','2026-09-02 21:34:37',1),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3OTE1MjcsImV4cCI6MTc4ODM5NjMyN30.rx9p3Ck_ZUJMPMTckdELu_dRiOaoGEhaEHPRCTxV0FA','2026-09-02 21:45:27',1),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3OTE2NjksImV4cCI6MTc4ODM5NjQ2OX0.5bJBAYYVUJzpY8cbH-88nxGJMlC4AD-w7P5tobnN61w','2026-09-02 21:47:49',1),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3OTI3NTQsImV4cCI6MTc4ODM5NzU1NH0.WAX2fMIBngzmnPxo8x_97_HOcdoB4yaFsG2ircjBlY4','2026-09-02 22:05:54',1),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc3OTI5NTIsImV4cCI6MTc4ODM5Nzc1Mn0.ZGKd8OHnwtGjosgp1kiDkqSZO5qVHJoJ1p1__c3bJL4','2026-09-02 22:09:12',1),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc5NTgyMTQsImV4cCI6MTc4ODU2MzAxNH0.mSEhcmNp3Bfek1BzMG2YYi-4aiKmPQyKZ2Y8wWF1a4I','2026-09-04 20:03:34',1),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc5NjAwNjUsImV4cCI6MTc4ODU2NDg2NX0.RcZw5uEnkB81F6iy42EGhBt1lUZRNeRphEbF8MsQKjg','2026-09-04 20:34:25',1),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODc5NjA2MjUsImV4cCI6MTc4ODU2NTQyNX0.Paqb4gbw79O4CYOf8PBrBht5gVBBEaYBCyqV5LnViRQ','2026-09-04 20:43:46',1),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgyMTQ4MDksImV4cCI6MTc4ODgxOTYwOX0.jwf7jicX4rUpes4jRpcu5Jm-kIdxlP23bTS_bBwxGGs','2026-09-07 19:20:10',1),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgyMTc4NTAsImV4cCI6MTc4ODgyMjY1MH0.VlZSfdtQTxl6M0Yypr7t-YmKQlqumjINtdf88v9EqI0','2026-09-07 20:10:51',1),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgyMTgzMjIsImV4cCI6MTc4ODgyMzEyMn0.r8UwF9FrRlmA2AM4oZJKMCNDV3mxRNma4M3SPRiC38o','2026-09-07 20:18:42',1),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgyMjI3OTEsImV4cCI6MTc4ODgyNzU5MX0.1oBWq62TQgdtb3-3xTe2iKTmgTF4lx2DHU30HgEf590','2026-09-07 21:33:11',1),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgyMjMzNjcsImV4cCI6MTc4ODgyODE2N30.7Ko2eClGypvKO7iAc-91n0HotBITmpSTBB1Nf8rLgBk','2026-09-07 21:42:48',1),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgyMjQwMzEsImV4cCI6MTc4ODgyODgzMX0.rXD5eYKd-5w5WZ1wfW-ToeKp2jneYQBmjYPDA4NB7PI','2026-09-07 21:53:51',1),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgzMDI3NzcsImV4cCI6MTc4ODkwNzU3N30.G4_wGxtvcytEwrcGnLntoNg5V0mRu1P5fMn_7EPmjos','2026-09-08 19:46:17',1),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJpYXQiOjE3ODgzMDM4NjIsImV4cCI6MTc4ODkwODY2Mn0.VY-trsbavZ4GSLONpJVc5Ewvp-8lqw699pGsA35vBcU','2026-09-08 20:04:23',1);
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL DEFAULT '1',
  `role_id` int NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `login` varchar(100) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `login` (`login`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-08-25 21:19:34','2026-08-25 21:57:54',1,1,'(11) 25143-6521','$2b$10$21obKaoJYrUKDDOJMFBTK.gj6lkVzdmwYaE.RmV7focmn4WQpPNwO','ad.enc@outlook.com','superadmin','Super Admin'),(2,'2026-08-25 21:19:34','2026-08-31 20:11:38',0,2,'(11) 25143-6521','$2b$10$7YdCWMzItuBy2HaGWxvOSOwPmgpAhlpvs1ex8fxgsd76x4bssOyKC','maria_silva@email.com','maria.silva','Maria Silva'),(3,'2026-08-25 21:19:34','2026-08-31 20:17:46',0,3,'(11) 25143-6521','$2b$10$M2rpVmIga.Qw3Rm1fDg.SOueiLVNEsXkGRxjMR05sVu20HUndYzci','carlos_pereira@email.com','carlos.pereira','Carlos Pereira');
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

-- Dump completed on 2026-09-01 20:17:13
