const {
    getAllHomeInfo,
    getHomeInfoById,
    createHomeInfo,
    updateHomeInfo,
    deleteHomeInfo
} = require('../models/homeInfoModel');

// GET /api/home-info → lista todos
async function listHomeInfo(req, res) {
    try {
        const data = await getAllHomeInfo();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar home_info:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/home-info/:id → busca um específico
async function showHomeInfo(req, res) {
    try {
        const { id } = req.params;
        const data = await getHomeInfoById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar home_info:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/home-info → cria novo registro
async function storeHomeInfo(req, res) {
    try {
        const { text, image, id_user } = req.body;

        if (!text || !id_user) {
            return res.status(400).json({ error: 'text e id_user são obrigatórios' });
        }

        const newId = await createHomeInfo(text, image, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_info: newId });
    } catch (error) {
        console.error('Erro ao criar home_info:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/home-info/:id → atualiza registro existente
async function editHomeInfo(req, res) {
    try {
        const { id } = req.params;
        const { text, image } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'text é obrigatório' });
        }

        const affectedRows = await updateHomeInfo(id, text, image);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar home_info:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/home-info/:id → remove registro
async function removeHomeInfo(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteHomeInfo(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir home_info:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listHomeInfo,
    showHomeInfo,
    storeHomeInfo,
    editHomeInfo,
    removeHomeInfo
};
