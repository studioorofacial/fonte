const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../models/rolesModel');

// GET /api/roles → lista todos
async function listRoles(req, res) {
    try {
        const data = await getAllRoles();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar roles:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/roles/:id → busca um específico
async function showRole(req, res) {
    try {
        const { id } = req.params;
        const data = await getRoleById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar roles:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/roles → cria novo registro
async function storeRole(req, res) {
    try {
        const { name_role } = req.body;

        if (!name_role) {
            return res.status(400).json({ error: 'name_role é obrigatório' });
        }

        const newId = await createRole(name_role);
        res.status(201).json({ message: 'Criado com sucesso', id_role: newId });
    } catch (error) {
        console.error('Erro ao criar role:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/roles/:id → atualiza registro existente
async function editRole(req, res) {
    try {
        const { id } = req.params;
        const { name_role } = req.body;

        if (!name_role) {
            return res.status(400).json({ error: 'name_role é obrigatório' });
        }

        const affectedRows = await updateRole(id, name_role);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar role:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/roles/:id → remove registro
async function removeRole(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteRole(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir role:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listRoles,
    showRole,
    storeRole,
    editRole,
    removeRole
};