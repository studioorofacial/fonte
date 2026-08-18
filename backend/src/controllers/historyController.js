const {
    getAllHistory,
    getHistoryById,
    createHistory,
    updateHistory,
    deleteHistory
} = require('../models/historyModel');

// GET /api/history → lista todos
async function listHistory(req, res) {
    try {
        const data = await getAllHistory();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar history:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/history/:id → busca um específico
async function showHistory(req, res) {
    try {
        const { id } = req.params;
        const data = await getHistoryById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar history:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/history → cria novo registro
async function storeHistory(req, res) {
    try {
        const { title, text, image, id_user } = req.body;

        if (!title || !text || !id_user) {
            return res.status(400).json({ error: 'title, text e id_user são obrigatórios' });
        }

        const newId = await createHistory(title, text, image, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_history: newId });
    } catch (error) {
        console.error('Erro ao criar history:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/history/:id → atualiza registro existente
async function editHistory(req, res) {
    try {
        const { id } = req.params;
        const { title, text, image } = req.body;

        if (!title || !text) {
            return res.status(400).json({ error: 'title e text são obrigatórios' });
        }

        const affectedRows = await updateHistory(id, title, text, image);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar history:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/history/:id → remove registro
async function removeHistory(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteHistory(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir history:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listHistory,
    showHistory,
    storeHistory,
    editHistory,
    removeHistory
};