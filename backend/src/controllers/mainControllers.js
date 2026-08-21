const {
    getAllMain,
    getMainById,
    createMain,
    updateMain,
    deleteMain
} = require('../models/mainModel');

// GET /api/main → lista todos
async function listMain(req, res) {
    try {
        const data = await getAllMain();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar main:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/main/:id → busca um específico
async function showMain(req, res) {
    try {
        const { id } = req.params;
        const data = await getMainById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar main:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/main → cria novo registro
async function storeMain(req, res) {
    try {
        const { title, subtitle, id_user } = req.body;

        if (!title || !id_user) {
            return res.status(400).json({ error: 'title e id_user são obrigatórios' });
        }

        const newId = await createMain(title, subtitle, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_main: newId });
    } catch (error) {
        console.error('Erro ao criar main:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/main/:id → atualiza registro existente
async function editMain(req, res) {
    try {
        const { id } = req.params;
        const { title, subtitle } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'title é obrigatório' });
        }

        const affectedRows = await updateMain(id, title, subtitle);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar main:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/main/:id → remove registro
async function removeMain(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteMain(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir main:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listMain,
    showMain,
    storeMain,
    editMain,
    removeMain
};