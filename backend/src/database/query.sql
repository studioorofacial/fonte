
use db_studioorofacial;

Select * from home_info;

# -------------------------------------------- ADMIN --------------------------------------------

INSERT INTO
    roles (name_role)
VALUES ("root"),
    ("admin"),
    ("secretaria");

DESCRIBE users;

INSERT INTO
    users (
        name,
        email,
        login,
        password,
        phone,
        status,
        role_id
    )
VALUES (
        "Super Admin",
        "superadmin@email.com",
        "superadmin",
        "123456",
        "(11) 25143-6521",
        1,
        1
    ),
    (
        "Maria Silva",
        "maria_silva@email.com",
        "maria.silva",
        "123456",
        "(11) 25143-6521",
        1,
        2
    ),
    (
        "Carlos Pereira",
        "carlos_pereira@email.com",
        "carlos.pereira",
        "123456",
        "(11) 25143-6521",
        1,
        3
    );

INSERT INTO
    users (
        name,
        email,
        login,
        password,
        phone,
        status,
        role_id
    )
VALUES (
        "Super Admin",
        "superadmin@email.com",
        "superadmin",
        "123456",
        "(11) 25143-6521",
        1,
        1
    );

INSERT INTO
    users (
        name,
        email,
        login,
        password,
        phone,
        status,
        role_id
    )
VALUES 
    (
        "Carlos Pereira",
        "carlos_pereira@email.com",
        "carlos.pereira",
        "123456",
        "(11) 25143-6521",
        1,
        3
    );

# -------------------------------------------- Catalogo --------------------------------------------
use db_studioorofacial;
INSERT INTO
    main (
        title,
        subtitle,
        id_user
    )
VALUES (
        "Studio Orofacial",
        "Conheça mais sobre nosso ambiente",
        1
    );

INSERT INTO
    main (
        title,
        subtitle,
        id_user
    )
VALUES (
        "Studio Orofacial",
        "Conheça mais sobre nosso ambiente",
        1
    ),
    (
        "Catálogo de serviços",
        "Conheça mais nossos procedimentos",
        1
    ),
    (
        "Entre em Contato",
        "Responderemos o mais breve possível",
        1
    ),
    (
        "Sobre o Studio Orofacial",
        "Conheça nossa história, missão e equipe de especialistas",
        1
    );

INSERT INTO
    home_carousel (
        title,
        description,
        background_image,
        id_user
    )
VALUES (
        "Bem-vindo ao Studio Orofacial",
        "Sorriso e harmonia em primeiro lugar.",
        "img/1.jpg",
        1
    ),
    (
        "Verde, luz e acolhimento",
        "Conheça mais nossos procedimentos",
        "img/2.jpg",
        1
    ),
    (
        "Seu Espaço de Equilíbrio",
        "Ambiente confortável para realçar sua melhor versão.",
        "img/3.jpg",
        1
    );

INSERT INTO
    home_info (
        text,
        image,
        id_user
    )
VALUES (
	"Nosso propósito é transformar vidas, inspirando mulheres que, por diferentes motivos, sentem medo ou vergonha de sorrir ou de se olhar no espelho. Estamos aqui para resgatar autoestima, confiança e a alegria de se reconhecer.",
        "img/home/home2.jpg",
        1
    ),
    (
        "Cuidamos do seu sorriso desde os tratamentos de clínica geral, como restaurações, limpezas e extrações, até especialidades avançadas em ortodontia, implantes, canal, bucomaxilo, próteses, facetas e harmonização facial.",
        "img/home/home3.jpg",
        1
    );


DESCRIBE roles;

# -------------------------------------------- Catalogo --------------------------------------------

INSERT INTO
    catalog_item (
        title,
        short_description,
        modal_description,
        id_user
    )
VALUES (
	"Clínica Geral",
        "A clínica geral cuida da saúde bucal como um todo, realizando diagnósticos, limpezas, restaurações e acompanhamentos periódicos. É o primeiro passo para manter dentes e gengivas saudáveis, prevenindo problemas futuros e garantindo bem-estar diário.",
        "A clínica geral é a base da odontologia e o ponto de partida para qualquer tratamento. O dentista clínico geral realiza avaliações completas, orienta sobre hábitos de higiene, identifica problemas precocemente e realiza procedimentos fundamentais para preservar a saúde bucal. Entre eles estão profilaxias (limpezas), restaurações, aplicação de flúor, remoção de tártaro e manutenção periódica. Além disso, atua na prevenção de cáries, gengivites e outras condições que podem comprometer a saúde dos dentes e da gengiva. O clínico geral também encaminha o paciente para especialidades quando necessário, garantindo uma abordagem integrada. É um cuidado contínuo, ideal para quem deseja manter um sorriso saudável ao longo da vida.",
        1
    ),
    (
	"Ortodontia",
        "A ortodontia corrige a posição dos dentes e do maxilar, proporcionando melhora estética e funcional. Inclui aparelhos fixos, alinhadores transparentes e tratamentos que harmonizam o sorriso.",
        "A ortodontia é a especialidade responsável por corrigir o alinhamento dos dentes e a relação entre as arcadas. Seu objetivo vai além da estética: um sorriso alinhado contribui para uma mastigação adequada, melhor higienização e prevenção de desgastes dentários. O tratamento pode ser feito com aparelhos fixos metálicos, estéticos, autoligados ou com alinhadores invisíveis, que oferecem maior conforto e discrição. Após uma avaliação completa, o ortodontista identifica o tipo de má oclusão e desenvolve um plano personalizado para movimentar os dentes de modo gradual e seguro. O acompanhamento periódico garante ajustes e a evolução contínua do tratamento. Ao final, o paciente conquista um sorriso harmônico, funcional e saudável.",
        1
    ),
    (
	"Implantes Dentários",
        "Os implantes dentários substituem dentes ausentes com segurança e naturalidade. São estruturas de titânio que devolvem função mastigatória, estética e confiança ao paciente.",
        "Os implantes dentários são a opção mais moderna e eficaz para substituir dentes perdidos. São pequenas estruturas de titânio inseridas no osso para atuar como raízes artificiais, proporcionando estabilidade para coroas, próteses ou pontes. O procedimento é realizado com planejamento digital e técnicas avançadas que aumentam a segurança e o conforto do paciente. Após a instalação, ocorre a osseointegração, que é a união do implante ao osso, garantindo firmeza e durabilidade. Os implantes devolvem a capacidade de mastigar, falar e sorrir sem insegurança, com aparência natural e sensação de dente fixo. Além disso, ajudam a preservar o osso da região, evitando retrações faciais ao longo do tempo.",
        1
    ),
    (
	"Tratamento de Canal (Endodontia)",
        "O tratamento de canal remove a inflamação ou infecção da polpa dentária, aliviando dores e preservando o dente. É um procedimento seguro, preciso e realizado com tecnologia moderna.",
        "O tratamento de canal, ou endodontia, é indicado quando a polpa do dente — região interna onde ficam vasos e nervos — sofre inflamação ou infecção causada por cáries profundas, fraturas ou traumas. O procedimento consiste em remover esse tecido comprometido, limpar e desinfectar o interior do dente e, em seguida, selá-lo com material especializado. Graças aos avanços tecnológicos, é possível realizar o tratamento de forma rápida, confortável e altamente previsível. Isso permite preservar o dente natural, evitando extrações e mantendo a estética e funcionalidade. Após o canal, o dente pode receber uma restauração ou coroa para reforçar sua estrutura. É uma solução eficaz para eliminar dor e preservar a saúde bucal.",
        1
    ),
    (
	"Bucomaxilofacial",
        "A cirurgia bucomaxilofacial trata problemas complexos envolvendo dentes, ossos da face, articulação da mandíbula e traumas faciais. Une precisão cirúrgica e cuidado funcional.",
        "A especialidade de cirurgia e traumatologia bucomaxilofacial abrange tratamentos de alta complexidade relacionados às estruturas da boca, face e maxilares. O profissional atua em casos como extrações de dentes inclusos (como o siso), correções ósseas, tratamento de traumas faciais, cistos, tumores benignos, alterações da articulação temporomandibular (ATM) e deformidades que comprometem estética e função. Com exames de imagem e planejamento avançado, o cirurgião define a melhor abordagem para cada caso, sempre priorizando segurança, conforto e resultados previsíveis. O objetivo é restabelecer harmonia facial, equilíbrio funcional e qualidade de vida ao paciente.",
        1
    ),
    (
	"Próteses Dentárias",
        "As próteses dentárias substituem dentes ausentes, devolvendo função, conforto e estética ao sorriso. Podem ser fixas, removíveis ou sobre implantes.",
        "A prótese dentária é indicada para repor um ou mais dentes perdidos, devolvendo estética, mastigação e fonética ao paciente. Existem diversos tipos: próteses fixas, pontes, próteses removíveis e próteses sobre implantes, cada uma indicada conforme a necessidade de cada caso. O processo envolve avaliação, moldagens, planejamento estético e prova de peças até atingir um resultado natural e confortável. Com materiais modernos como cerâmicas de alta resistência, é possível criar dentes extremamente semelhantes aos naturais. A prótese bem ajustada melhora a autoestima, a função oral e a harmonia facial.",
        1
    ),
    (
	"Facetas Dentárias",
        "As facetas são lâminas ultrafinas que transformam o sorriso, corrigindo forma, cor e alinhamento leve dos dentes. Proporcionam estética natural e resultados imediatos.",
        "As facetas de porcelana, também conhecidas como lentes de contato dental, são lâminas finas que revestem a parte frontal dos dentes para corrigir imperfeições estéticas. Elas são indicadas para alterar cor, formato, tamanho, pequenas correções de alinhamento e fechamento de espaços. O tratamento começa com planejamento digital do sorriso, permitindo visualizar o resultado antes mesmo de iniciar o procedimento. Após a preparação mínima (quando necessária), as facetas são confeccionadas em laboratório e cimentadas com precisão. O resultado é um sorriso harmônico, natural e duradouro, com mínimo desgaste dentário. É um dos procedimentos mais procurados para transformação estética.",
        1
    ),
    (
	"Harmonização Facial",
        "A harmonização facial equilibra os traços do rosto por meio de procedimentos como toxina botulínica, preenchedores e bioestimuladores. Proporciona rejuvenescimento e naturalidade.",
        "A harmonização facial é um conjunto de procedimentos realizados para equilibrar proporções, suavizar marcas de expressão e valorizar características naturais do rosto. Entre as técnicas mais utilizadas estão toxina botulínica (botox), preenchimento com ácido hialurônico, bioestimuladores de colágeno, fios de sustentação e tratamentos para contorno facial. Tudo é planejado de acordo com a anatomia e os objetivos estéticos do paciente, buscando resultados naturais e sem exageros. A harmonização pode melhorar áreas como mandíbula, queixo, lábios, olheiras, maçãs do rosto e testa. Além de estética, muitos procedimentos trazem benefícios funcionais, como redução de bruxismo e dores na ATM. O resultado é um rosto mais equilibrado, rejuvenescido e expressivo.",
        1
    );

# -------------------------------------------- Contato --------------------------------------------

use db_studioorofacial;

INSERT INTO
    contact_message (
        message,
        email,
        name,
        id_user
    )
VALUES
    (
        "Olá! Gostaria de saber mais sobre o tratamento de harmonização facial. Vocês têm horários disponíveis para essa semana?",
        "carla.souza@email.com",
        "Carla Souza",
        1
    ),
    (
        "Bom dia, estou com uma dor no dente e gostaria de agendar uma avaliação o quanto antes. Qual a disponibilidade de vocês?",
        "pedro.almeida@email.com",
        "Pedro Almeida",
        1
    ),
    (
        "Boa tarde! Vi o catálogo de serviços no site e fiquei interessada em fazer um orçamento para facetas dentárias. Podem me passar mais informações?",
        "juliana.ferreira@email.com",
        "Juliana Ferreira",
        1
    );

-- =========================================================
-- contact_location
-- =========================================================
INSERT INTO
    contact_location (
        maps_url,
        address,
        id_user
    )
VALUES (
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.18726362023!2d-46.45805368933215!3d-23.66926027863704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce695c580ed997%3A0x842bc9b00983116d!2sR.%20%C3%81lvares%20Machado%2C%20281%20-%20Vila%20Bocaina%2C%20Mau%C3%A1%20-%20SP%2C%2009310-020!5e0!3m2!1spt-BR!2sbr!4v1764684614849!5m2!1spt-BR!2sbr",
        "Ed. Jurerê Internacional, 4º andar, sala 406, Rua Álvares Machado, 281, Vila Bocaina, Mauá - SP, 09310-020",
        1
    );

-- =========================================================
-- contact_info
-- =========================================================
INSERT INTO
    contact_info (
        service_text,
        whatsapp,
        phone,
        id_user
    )
VALUES (
        "Horário de atendimento: 9h às 18h",
        "(11) 97199-3704",
        "(11) 4515-0556",
        1
    );

# -------------------------------------------- Sobre --------------------------------------------
use db_studioorofacial;

INSERT INTO
    about_history (
        title,
        text,
        image,
        id_user
    )
VALUES (
        "Nossa História",
        "Nós estamos no mercado a 6 anos, iniciei sozinha e hoje nossa equipe é composta por 4 especialistas. Antes de virar Studio Orofacial, possuía outro nome JCOdontologia (uma homenagem ao meu pai). A ideia de virar um Studio foi pelo fato de eu ter iniciado a minha segunda pós-graduação (HOF) e eu queria trazer um novo conceito e uma nova visão para os meus pacientes com mais conforto e qualidade.

Estamos no mercado há 6 anos. Comecei sozinha e, ao longo do tempo, construí uma equipe talentosa formada por quatro especialistas. Antes de nos transformarmos em Studio Orofacial, atuávamos como JCOdontologia — um nome escolhido em homenagem ao meu pai.

A mudança para o formato de Studio surgiu quando iniciei minha segunda pós-graduação em Harmonização Orofacial (HOF). Esse novo ciclo despertou em mim o desejo de oferecer um conceito mais moderno, com uma visão ampliada do cuidado e um atendimento que proporcionasse ainda mais conforto, qualidade e bem-estar aos nossos pacientes.",
        "img/2024-04-16.jpg",
        1
    );

INSERT INTO
    about_principles (
        icon,
        title,
        text,
        id_user
    )
VALUES (
        "bi bi-bullseye",
        "Missão",
        "Proporcionar saúde, beleza e bem-estar através de um atendimento humanizado e personalizado, devolvendo autoestima e confiança a cada mulher que passa pelo Studio. Nosso compromisso é compreender profundamente suas dores e desejos para transformar sua experiência estética em cuidado, acolhimento e resultados reais.",
        1
    ),
    (
        "bi bi-eye",
        "Visão",
        "Ser referência em saúde estética para mulheres 30+, reconhecido pela excelência no atendimento individualizado, pela inovação em tratamentos e pela capacidade de gerar resultados que elevem a autoestima e promovam uma relação positiva com a própria imagem.",
        1
    ),
    (
        "bi bi-heart",
        "Valores",
        "Humanização: acolher cada paciente com empatia, respeito e sensibilidade. Personalização: oferecer tratamentos exclusivos, pensados de acordo com as necessidades e objetivos individuais. Resultados reais: focar em entregas que transformem, valorizem e empoderem cada mulher.",
        1
    );

INSERT INTO
    about_team (
        specialist,
        university,
        education,
        image,
        id_user
    )
VALUES (
        "Dra. Nátali Menezes",
        "Fundadora e Especialista em HOF",
        "Pós-graduada em Harmonização Orofacial com mais de 10 anos de experiência.",
        "bi bi-person-circle",
        1
    ),
    (
        "Dra. Mariana Alves",
        "Implantodontia e Estética Facial",
        "Pós Graduação Ortodontia e Ortopedia com mais de 10 anos de experiência.",
        "bi bi-person-circle",
        1
    ),
    (
        "Dr. Lucas Moreira",
        "Especialista em Ortodontia e Ortopedia Facial",
        "Pós-graduado em Harmonização Facial com 8 anos de experiência.",
        "bi bi-person-circle",
        1
    );

INSERT INTO
    about_differentials (
        description,
        id_user
    )
VALUES
    ("Equipe multidisciplinar especializada", 1),
    ("Tecnologia de ponta em tratamentos", 1),
    ("Atendimento personalizado e humanizado", 1),
    ("Ambiente acolhedor e confortável", 1),
    ("Planejamento individualizado para cada paciente", 1);

