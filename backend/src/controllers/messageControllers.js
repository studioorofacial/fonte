const {
    getAllMessage,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage
} = require('../models/messageModel');

// GET /api/message → lista todos
async function listMessage(req, res) {
    try {
        const data = await getAllMessage();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar message:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/message/:id → busca um específico
async function showMessage(req, res) {
    try {
        const { id } = req.params;
        const data = await getMessageById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar message:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/message → cria novo registro
async function storeMessage(req, res) {
    try {
        const { message, email, name, id_user } = req.body;

        if (!message || !email || !name) {
            return res.status(400).json({ error: 'message, email e name são obrigatórios' });
        }

        const newId = await createMessage(message, email, name, id_user || null);
        res.status(201).json({ message: 'Criado com sucesso', id_message: newId });
    } catch (error) {
        console.error('Erro ao criar message:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/message/:id → atualiza registro existente
async function editMessage(req, res) {
    try {
        const { id } = req.params;
        const { message, email, name } = req.body;

        if (!message || !email || !name) {
            return res.status(400).json({ error: 'message, email e name são obrigatórios' });
        }

        const affectedRows = await updateMessage(id, message, email, name);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar message:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/message/:id → remove registro
async function removeMessage(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteMessage(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir message:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listMessage,
    showMessage,
    storeMessage,
    editMessage,
    removeMessage
};