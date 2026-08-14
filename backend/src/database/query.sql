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
    roles (role_name)
VALUES ("root"),
    ("admin"),
    ("secretaria");

DESCRIBE users;

INSERT INTO
    users (
        name,
        email,
        password,
        phone,
        status,
        role_id
    )
VALUES (
        "superadmin",
        "superadmin@email.com",
        "123456",
        "(11) 25143-6521",
        1
    ),
    (
        "Maria Silva",
        "maria_silva@email.com",
        "123456",
        "(11) 25143-6521",
        2
    ),
    (
        "Carlos Pereira",
        "carlos_pereira@email.com",
        "123456",
        "(11) 25143-6521",
        3
    );