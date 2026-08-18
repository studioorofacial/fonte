const {
    getAllDifferentials,
    getDifferentialById,
    createDifferential,
    updateDifferential,
    deleteDifferential,
} = require("../models/differentialsModel");


// GET /api/differentials → retorna a lista completa
async function listDifferentials(req, res) {
    try {
        const data = await getAllDifferentials();
        res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar differentials:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados do banco" });
    }
}


// GET /api/differentials/:id → retorna um registro específico
async function showDifferential(req, res) {
    try {
        const { id } = req.params;
        const data = await getDifferentialById(id);

        if (!data) {
            return res.status(404).json({ error: "Registro não encontrado" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar differential:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados do banco" });
    }
}


// POST /api/differentials → cria um novo registro
async function storeDifferential(req, res) {
    try {
        const { description, id_user } = req.body;

        if (!description || !id_user) {
            return res
                .status(400)
                .json({ error: "description e id_user são obrigatórios" });
        }

        const newId = await createDifferential(description, id_user);
        res
            .status(201)
            .json({ message: "Criado com sucesso", id_differential: newId });
    } catch (error) {
        console.error("Erro ao criar differential:", error.message);
        res.status(500).json({ error: "Erro ao criar registro" });
    }
}


// PUT /api/differentials/:id → atualiza um registro existente
async function editDifferential(req, res) {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ error: "description é obrigatório" });
        }

        const affectedRows = await updateDifferential(id, description);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Registro não encontrado" });
        }

        res.status(200).json({ message: "Atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar differential:", error.message);
        res.status(500).json({ error: "Erro ao atualizar registro" });
    }
}


// DELETE /api/differentials/:id → remove um registro
async function removeDifferential(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteDifferential(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Registro não encontrado" });
        }

        res.status(200).json({ message: "Excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir differential:", error.message);
        res.status(500).json({ error: "Erro ao excluir registro" });
    }
}

module.exports = {
    listDifferentials,
    showDifferential,
    storeDifferential,
    editDifferential,
    removeDifferential,
};