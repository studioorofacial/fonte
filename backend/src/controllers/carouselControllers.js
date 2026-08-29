const {
    getAllCarousel,
    getCarouselById,
    createCarousel,
    updateCarousel,
    deleteCarousel
} = require('../models/carouselModel');
const { apagarArquivoDeUpload } = require('../utils/uploadHelper');

// GET /api/carousel → lista todos
async function listCarousel(req, res) {
    try {
        const data = await getAllCarousel();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar carousel:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// GET /api/carousel/:id → busca um específico
async function showCarousel(req, res) {
    try {
        const { id } = req.params;
        const data = await getCarouselById(id);

        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar carousel:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados do banco' });
    }
}

// POST /api/carousel → cria novo registro
async function storeCarousel(req, res) {
    try {
        const { title, description, background_image, id_user } = req.body;

        if (!title || !description || !id_user) {
            return res.status(400).json({ error: 'title, description e id_user são obrigatórios' });
        }

        const newId = await createCarousel(title, description, background_image, id_user);
        res.status(201).json({ message: 'Criado com sucesso', id_carousel: newId });
    } catch (error) {
        console.error('Erro ao criar carousel:', error.message);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
}

// PUT /api/carousel/:id → atualiza registro existente
async function editCarousel(req, res) {
    try {
        const { id } = req.params;
        const { title, description, background_image } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'title e description são obrigatórios' });
        }

        // Se a imagem está sendo trocada por outra, guarda a antiga pra
        // apagar depois que a atualização for confirmada com sucesso
        const registroAtual = await getCarouselById(id);
        const imagemAntiga = registroAtual?.background_image;

        const affectedRows = await updateCarousel(id, title, description, background_image);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        if (imagemAntiga && imagemAntiga !== background_image) {
            apagarArquivoDeUpload(imagemAntiga);
        }

        res.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar carousel:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
}

// DELETE /api/carousel/:id → remove registro
async function removeCarousel(req, res) {
    try {
        const { id } = req.params;

        // Busca o registro ANTES de excluir, pra saber qual imagem apagar
        const registro = await getCarouselById(id);

        const affectedRows = await deleteCarousel(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }

        if (registro?.background_image) {
            apagarArquivoDeUpload(registro.background_image);
        }

        res.status(200).json({ message: 'Excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir carousel:', error.message);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
}

module.exports = {
    listCarousel,
    showCarousel,
    storeCarousel,
    editCarousel,
    removeCarousel
};