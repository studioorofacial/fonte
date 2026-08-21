const {
    getAllLocation,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
} = require('../models/locationModel');

// GET /api/location → lista todos
async function listLocation(req, res) {
    try {
        const data = await getAllLocation();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar location:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/location/:id → busca um específico
async function showLocation(req, res) {
    try {
        const { id } = req.params;
        const data = await getLocationById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar location:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/location → cria novo registro
async function storeLocation(req, res) {
    try {
        const { maps_url, address, id_user } = req.body;

        if (!address || !id_user) {
            return res.status(400).json({ error: 'address e id_user são obrigatórios' });
        }

        const newId = await createLocation(maps_url, address, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_location: newId });
    } catch (error) {
        console.error('Erro ao criar location:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/location/:id → atualiza registro existente
async function editLocation(req, res) {
    try {
        const { id } = req.params;
        const { maps_url, address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'address é obrigatório' });
        }

        const affectedRows = await updateLocation(id, maps_url, address);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar location:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/location/:id → remove registro
async function removeLocation(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteLocation(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir location:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listLocation,
    showLocation,
    storeLocation,
    editLocation,
    removeLocation
};