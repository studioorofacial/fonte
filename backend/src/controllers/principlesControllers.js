const {
    getAllPrinciples,
    getPrincipleById,
    createPrinciple,
    updatePrinciple,
    deletePrinciple
} = require('../models/principlesModel');

// GET /api/principles → lista todos
async function listPrinciples(req, res) {
    try {
        const data = await getAllPrinciples();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar principles:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/principles/:id → busca um específico
async function showPrinciple(req, res) {
    try {
        const { id } = req.params;
        const data = await getPrincipleById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar principles:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/principles → cria novo registro
async function storePrinciple(req, res) {
    try {
        const { icon, text, title, id_user } = req.body;

        if (!text || !title || !id_user) {
            return res.status(400).json({ error: 'text, title e id_user são obrigatórios' });
        }

        const newId = await createPrinciple(icon, text, title, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_principle: newId });
    } catch (error) {
        console.error('Erro ao criar principle:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/principles/:id → atualiza registro existente
async function editPrinciple(req, res) {
    try {
        const { id } = req.params;
        const { icon, text, title } = req.body;

        if (!text || !title) {
            return res.status(400).json({ error: 'text e title são obrigatórios' });
        }

        const affectedRows = await updatePrinciple(id, icon, text, title);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar principle:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/principles/:id → remove registro
async function removePrinciple(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deletePrinciple(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir principle:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listPrinciples,
    showPrinciple,
    storePrinciple,
    editPrinciple,
    removePrinciple
};