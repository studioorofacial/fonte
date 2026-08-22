require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../src/database/connection');

async function main() {
  const [email, password, name = 'Super Admin', role = 'root'] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Uso: node scripts/create-admin.js <email> <senha> [nome] [papel]');
    process.exitCode = 1;
    return;
  }
  if (password.length < 8) {
    console.error('A senha deve ter pelo menos 8 caracteres.');
    process.exitCode = 1;
    return;
  }

  const [roles] = await db.execute('SELECT id_role FROM roles WHERE LOWER(name_role) = LOWER(?) LIMIT 1', [role]);
  if (!roles[0]) {
    console.error(`Papel não encontrado: ${role}. Insira os papéis na tabela roles antes de continuar.`);
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await db.execute(
    'INSERT INTO users (name, email, password, phone, status, role_id) VALUES (?, ?, ?, ?, 1, ?)',
    [name.trim(), email.trim(), hash, 'Não informado', roles[0].id_role],
  );
  console.log(`Administrador criado: ${email} (${role})`);
}

main()
  .catch((error) => {
    console.error('Não foi possível criar o administrador:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try { await db.end(); } catch (_) { /* conexão pode não ter sido aberta */ }
  });
