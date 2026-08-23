const bcrypt = require('bcrypt');
const {
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByLogin,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    getMasterUserId
} = require('../models/usersModel');

const SALT_ROUNDS = 10;

// GET /api/users → lista todos (sem senha)
async function listUsers(req, res) {
    try {
        const data = await getAllUsers();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/users/:id → busca um específico (sem senha)
async function showUser(req, res) {
    try {
        const { id } = req.params;
        const data = await getUserById(id);

        if (!data) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/users → cria novo usuário (a senha é criptografada aqui, nunca antes)
async function storeUser(req, res) {
    try {
        const { name, email, login, password, phone, role_id } = req.body;

        const emailExistente = await getUserByEmail(email);
        if (emailExistente) {
            return res.status(409).json({ error: 'Já existe um usuário com esse email.' });
        }

        const loginExistente = await getUserByLogin(login);
        if (loginExistente) {
            return res.status(409).json({ error: 'Esse nome de usuário (login) já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newId = await createUser(name, email, login, hashedPassword, phone, role_id);

        res.status(201).json({ message: 'Usuário criado com sucesso', id_user: newId });
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/users/:id → atualiza dados cadastrais (não altera senha)
async function editUser(req, res) {
    try {
        const { id } = req.params;
        // email e login são ignorados de propósito, mesmo se vierem no
        // corpo da requisição — são fixos após a criação da conta
        const { name, phone, role_id, status } = req.body;

        const alvo = await getUserById(id);

        // Só uma conta Root pode editar outra conta Root — Admin não
        // pode mexer em nada de uma conta Root (nem rebaixar o cargo dela)
        if (alvo && Number(alvo.role_id) === 1 && req.user?.role_id !== 1) {
            return res.status(403).json({ error: 'Só uma conta Root pode editar outra conta Root.' });
        }

        const masterId = await getMasterUserId();
        const alvoEhMaster = alvo && masterId && String(masterId) === String(id);
        const editandoASiMesmo = req.user && String(req.user.id_user) === String(id);

        // O master (primeiro registro da tabela) nunca tem o cargo
        // alterado — por ninguém, nem por ele mesmo. É intocável.
        if (alvoEhMaster && alvo && Number(role_id) !== Number(alvo.role_id)) {
            return res.status(403).json({ error: 'O cargo do usuário master nunca pode ser alterado.' });
        }

        // Uma conta Root comum (que não é o master) pode ser rebaixada
        // por OUTRA conta Root normalmente — só não pode rebaixar a si
        // mesma (evita se isolar do próprio cargo por acidente).
        if (alvo && Number(alvo.role_id) === 1 && !alvoEhMaster && editandoASiMesmo && Number(role_id) !== 1) {
            return res.status(403).json({ error: 'Você não pode alterar o próprio cargo.' });
        }

        // Promover alguém PRA Root é regra tão sensível quanto criar um
        // Root do zero — só quem já é Root pode fazer isso. Sem essa
        // checagem, um Admin poderia se auto-promover editando o próprio
        // role_id, contornando a regra de "só Root cria administrador".
        if (Number(role_id) === 1 && req.user?.role_id !== 1) {
            return res.status(403).json({ error: 'Só uma conta Root pode promover alguém para Root.' });
        }

        const affectedRows = await updateUser(id, name, phone, role_id, status);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// PUT /api/users/:id/senha → troca a senha do usuário
async function changePassword(req, res) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
        }

        // Só uma conta Root pode trocar a senha de outra conta Root —
        // senão um Admin conseguiria "sequestrar" a conta trocando a senha dela
        const alvo = await getUserById(id);
        if (alvo && Number(alvo.role_id) === 1 && req.user?.role_id !== 1) {
            return res.status(403).json({ error: 'Só uma conta Root pode trocar a senha de outra conta Root.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const affectedRows = await updateUserPassword(id, hashedPassword);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar senha:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar senha' });
    }
}

// DELETE /api/users/:id → remove usuário
async function removeUser(req, res) {
    try {
        const { id } = req.params;

        // O master (primeiro registro da tabela, o superadmin original)
        // nunca pode ser excluído — por ninguém, nem por ele mesmo.
        const masterId = await getMasterUserId();
        if (masterId && String(masterId) === String(id)) {
            return res.status(403).json({ error: 'O usuário master (superadmin) nunca pode ser excluído.' });
        }

        // Ninguém exclui a própria conta, mesmo sendo Root
        if (req.user && String(req.user.id_user) === String(id)) {
            return res.status(400).json({ error: 'Não é possível excluir a própria conta.' });
        }

        // Fora o master, contas Root podem excluir umas às outras
        // normalmente — só quem NÃO é Root é bloqueado de excluir uma
        // conta Root.
        const alvo = await getUserById(id);
        if (alvo && Number(alvo.role_id) === 1 && req.user?.role_id !== 1) {
            return res.status(403).json({ error: 'Só uma conta Root pode excluir outra conta Root.' });
        }

        const affectedRows = await deleteUser(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listUsers,
    showUser,
    storeUser,
    editUser,
    changePassword,
    removeUser
};
