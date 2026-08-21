const {
    getAllItem,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../models/itemModel');

// GET /api/item → lista todos
async function listItem(req, res) {
    try {
        const data = await getAllItem();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar item:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/item/:id → busca um específico
async function showItem(req, res) {
    try {
        const { id } = req.params;
        const data = await getItemById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar item:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/item → cria novo registro
async function storeItem(req, res) {
    try {
        const { title, short_description, modal_description, id_user } = req.body;

        if (!title || !short_description || !id_user) {
            return res.status(400).json({ error: 'title, short_description e id_user são obrigatórios' });
        }

        const newId = await createItem(title, short_description, modal_description, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_item: newId });
    } catch (error) {
        console.error('Erro ao criar item:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/item/:id → atualiza registro existente
async function editItem(req, res) {
    try {
        const { id } = req.params;
        const { title, short_description, modal_description } = req.body;

        if (!title || !short_description) {
            return res.status(400).json({ error: 'title e short_description são obrigatórios' });
        }

        const affectedRows = await updateItem(id, title, short_description, modal_description);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar item:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/item/:id → remove registro
async function removeItem(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteItem(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir item:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listItem,
    showItem,
    storeItem,
    editItem,
    removeItem
};