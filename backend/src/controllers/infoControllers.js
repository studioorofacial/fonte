const {
    getAllInfo,
    getInfoById,
    createInfo,
    updateInfo,
    deleteInfo
} = require('../models/infoModel');

// GET /api/info → lista todos
async function listInfo(req, res) {
    try {
        const data = await getAllInfo();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar info:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/info/:id → busca um específico
async function showInfo(req, res) {
    try {
        const { id } = req.params;
        const data = await getInfoById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar info:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/info → cria novo registro
async function storeInfo(req, res) {
    try {
        const { service_text, whatsapp, phone, id_user } = req.body;

        if (!service_text || !id_user) {
            return res.status(400).json({ error: 'service_text e id_user são obrigatórios' });
        }

        const newId = await createInfo(service_text, whatsapp, phone, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_info: newId });
    } catch (error) {
        console.error('Erro ao criar info:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/info/:id → atualiza registro existente
async function editInfo(req, res) {
    try {
        const { id } = req.params;
        const { service_text, whatsapp, phone } = req.body;

        if (!service_text) {
            return res.status(400).json({ error: 'service_text é obrigatório' });
        }

        const affectedRows = await updateInfo(id, service_text, whatsapp, phone);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar info:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/info/:id → remove registro
async function removeInfo(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteInfo(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir info:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listInfo,
    showInfo,
    storeInfo,
    editInfo,
    removeInfo
};