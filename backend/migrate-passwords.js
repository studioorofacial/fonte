// Rode este script UMA VEZ para transformar senhas em texto puro
// (ex: as que estão no seu outros/banco/query.sql: "123456") em
// hashes bcrypt seguros. Idempotente: pode rodar mais de uma vez
// sem quebrar senhas que já estiverem em hash.
//
// Como rodar (a partir da pasta backend/):
//   node migrate-passwords.js

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/database/connection');

async function migrarSenhas() {
    const [users] = await pool.query('SELECT id_user, password FROM users');

    for (const user of users) {
        // Hashes bcrypt sempre começam com $2 — se já for hash, pula
        if (user.password.startsWith('$2')) {
            console.log(`Usuário ${user.id_user} já está com senha em hash, pulando.`);
            continue;
        }

        const hash = await bcrypt.hash(user.password, 10);
        await pool.query('UPDATE users SET password = ? WHERE id_user = ?', [hash, user.id_user]);
        console.log(`Senha do usuário ${user.id_user} atualizada para hash.`);
    }

    console.log('Migração concluída.');
    process.exit(0);
}

migrarSenhas().catch(err => {
    console.error('Erro na migração:', err);
    process.exit(1);
});
