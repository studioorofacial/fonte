const bcrypt = require('bcrypt');
const {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser
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
        const { name, email, password, phone, role_id } = req.body;

        const usuarioExistente = await getUserByEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ error: 'Já existe um usuário com esse email.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newId = await createUser(name, email, hashedPassword, phone, role_id);

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
        const { name, email, phone, role_id, status } = req.body;

        const affectedRows = await updateUser(id, name, email, phone, role_id, status);

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
