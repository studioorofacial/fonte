const {
    getAllTeam,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
} = require('../models/teamModel');
const { apagarArquivoDeUpload } = require('../utils/uploadHelper');

// GET /api/team → lista todos
async function listTeam(req, res) {
    try {
        const data = await getAllTeam();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar team:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/team/:id → busca um específico
async function showTeam(req, res) {
    try {
        const { id } = req.params;
        const data = await getTeamById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar team:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/team → cria novo registro
async function storeTeam(req, res) {
    try {
        const { specialist, university, education, image, id_user } = req.body;

        if (!specialist || !id_user) {
            return res.status(400).json({ error: 'specialist e id_user são obrigatórios' });
        }

        const newId = await createTeam(specialist, university, education, image, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_team: newId });
    } catch (error) {
        console.error('Erro ao criar team:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/team/:id → atualiza registro existente
async function editTeam(req, res) {
    try {
        const { id } = req.params;
        const { specialist, university, education, image } = req.body;

        if (!specialist) {
            return res.status(400).json({ error: 'specialist é obrigatório' });
        }

        const registroAtual = await getTeamById(id);
        const imagemAntiga = registroAtual?.image;

        const affectedRows = await updateTeam(id, specialist, university, education, image);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        if (imagemAntiga && imagemAntiga !== image) {
            apagarArquivoDeUpload(imagemAntiga);
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar team:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/team/:id → remove registro
async function removeTeam(req, res) {
    try {
        const { id } = req.params;

        const registro = await getTeamById(id);

        const affectedRows = await deleteTeam(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        if (registro?.image) {
            apagarArquivoDeUpload(registro.image);
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir team:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listTeam,
    showTeam,
    storeTeam,
    editTeam,
    removeTeam
};