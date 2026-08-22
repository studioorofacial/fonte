USE db_studioorofacial;

-- Garante que o papel usado pelo Super Admin existe.
INSERT INTO roles (name_role)
SELECT 'root'
WHERE NOT EXISTS (
  SELECT 1 FROM roles WHERE LOWER(name_role) = 'root'
);

-- Insere ou atualiza o utilizador de id 1.
-- A senha Admin@123 está armazenada como hash bcrypt.
INSERT INTO users (id_user, name, email, password, phone, status, role_id)
SELECT
  1,
  'superadmin',
  'superadmin@email.com',
  '$2b$12$Rek7fHi.kLUDJiZuCqbsvexFNQZvrja7sgqBRi7ecuCmwBiskU0dW',
  'Não informado',
  1,
  r.id_role
FROM roles r
WHERE LOWER(r.name_role) = 'root'
ORDER BY r.id_role
LIMIT 1
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  password = VALUES(password),
  phone = VALUES(phone),
  status = VALUES(status),
  role_id = VALUES(role_id);

SELECT id_user, name, email, status, role_id
FROM users
WHERE id_user = 1;
