// ============================================================
// ADMIN.JS
// Toda a lógica JS da página admin.html em um único arquivo:
//  1) CRUD via API (catálogo, home, equipe, princípios, etc.)
//  2) Autenticação, sessão e modais de edição/exclusão
// ============================================================

const API_URL = 'http://localhost:8080/api';

let itensCache = []; // guarda os itens carregados, pra reaproveitar na edição sem nova requisição

// Busca todos os itens do catálogo na API
async function carregarItens() {
    try {
        const response = await fetch(`${API_URL}/item`);
        itensCache = await response.json();
        renderizarTabelaItens(itensCache);
    } catch (erro) {
        console.error('Erro ao carregar itens:', erro);
    }
}

// Preenche a tabela #tb-item_catalogo com os dados reais
function renderizarTabelaItens(itens) {
    const tbody = document.getElementById('tb-item_catalogo');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${item.short_description}</td>
            <td>${item.modal_description}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarItem(${item.id_item})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

// Carrega os dados de um item no formulário para edição
function editarItem(id) {
    const item = itensCache.find(i => i.id_item === id);
    if (!item) return;

    document.getElementById('item-id').value = item.id_item;
    document.getElementById('item-titulo').value = item.title;
    document.getElementById('item-desc-curta').value = item.short_description;
    document.getElementById('item-desc-modal').value = item.modal_description || '';

    document.getElementById('item-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';

    // Rola a tela até o formulário, pra facilitar em telas menores
    document.getElementById('form-item-catalogo').scrollIntoView({ behavior: 'smooth' });
}

// Limpa o formulário e volta ao modo "criar novo"
function limparFormularioItem() {
    document.getElementById('item-id').value = '';
    document.getElementById('item-titulo').value = '';
    document.getElementById('item-desc-curta').value = '';
    document.getElementById('item-desc-modal').value = '';
    document.getElementById('item-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

// Decide entre criar (POST) ou atualizar (PUT) o item
async function handleItemSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('item-id').value;
    const dados = {
        title: document.getElementById('item-titulo').value,
        short_description: document.getElementById('item-desc-curta').value,
        modal_description: document.getElementById('item-desc-modal').value
    };

    try {
        if (id) {
            // MODO EDIÇÃO → PUT
            const response = await authFetch(`${API_URL}/item/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Item atualizado!', 'success');
        } else {
            // MODO CRIAÇÃO → POST
            // id_user vem do usuário logado (salvo no login), não é mais fixo
            dados.id_user = currentUser?.id_user;

            const response = await authFetch(`${API_URL}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Item criado!', 'success');
        }

        limparFormularioItem();
        carregarItens();
    } catch (erro) {
        console.error('Erro ao salvar item:', erro);
        showToast('Erro ao salvar item.', 'danger');
    }
}

// Deleta o item atualmente carregado no formulário
async function deletarItemAtual() {
    const id = document.getElementById('item-id').value;

    if (!id) {
        showToast('Selecione um item (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    const confirmar = await confirmarExclusao('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.');
    if (!confirmar) return;

    try {
        const response = await authFetch(`${API_URL}/item/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Item excluído!', 'danger');
        limparFormularioItem();
        carregarItens();
    } catch (erro) {
        console.error('Erro ao excluir item:', erro);
        showToast('Erro ao excluir item.', 'danger');
    }
}

// ============================================================
// CRUD — HOME CAROUSEL
// ============================================================
let carouselCache = [];

async function carregarCarousel() {
    try {
        const response = await fetch(`${API_URL}/carousel`);
        carouselCache = await response.json();
        renderizarTabelaCarousel(carouselCache);
    } catch (erro) {
        console.error('Erro ao carregar carousel:', erro);
    }
}

function renderizarTabelaCarousel(itens) {
    const tbody = document.getElementById('tb-home_carousel');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${item.description || ''}</td>
            <td>${item.background_image || ''}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarCarousel(${item.id_carousel})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarCarousel(id) {
    const item = carouselCache.find(i => i.id_carousel === id);
    if (!item) return;

    document.getElementById('carousel-id').value = item.id_carousel;
    document.getElementById('carousel-titulo').value = item.title;
    document.getElementById('carousel-background').value = item.background_image || '';
    document.getElementById('carousel-descricao').value = item.description || '';

    // Limpa qualquer arquivo que estivesse selecionado de antes (ex: de
    // uma tentativa de criação cancelada), pra não subir por engano
    // junto com a edição deste registro
    const fileInput = document.getElementById('carousel-file');
    if (fileInput) fileInput.value = '';

    // Mostra a imagem que já está salva, pra você ver o que tem hoje
    // antes de decidir trocar
    const preview = document.getElementById('carousel-preview');
    if (preview) {
        if (item.background_image) {
            preview.src = item.background_image;
            preview.style.display = 'block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }

    document.getElementById('carousel-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-home-carousel').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioCarousel() {
    document.getElementById('carousel-id').value = '';
    document.getElementById('carousel-titulo').value = '';
    document.getElementById('carousel-background').value = '';
    document.getElementById('carousel-descricao').value = '';

    // O <input type="file"> e a prévia não são limpos pelos .value=''
    // acima — precisam ser resetados à parte, senão o nome do arquivo
    // (ex: "3.jpg") continua aparecendo mesmo depois de salvar
    const fileInput = document.getElementById('carousel-file');
    if (fileInput) fileInput.value = '';

    const preview = document.getElementById('carousel-preview');
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }

    document.getElementById('carousel-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handleCarouselSubmit(event) {
    event.preventDefault();

    const arquivo = document.getElementById('carousel-file').files[0];

    // Upload do arquivo (se houver) — agora protegido por try/catch
    if (arquivo) {
        try {
            const formData = new FormData();
            formData.append('imagem', arquivo);

            const uploadResponse = await authFetch(`${API_URL}/upload-carousel`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                const erroBody = await uploadResponse.json().catch(() => ({}));
                throw new Error(erroBody.error || 'Falha ao enviar a imagem.');
            }

            const uploadData = await uploadResponse.json();
            document.getElementById('carousel-background').value = uploadData.path;
        } catch (erro) {
            console.error('Erro ao enviar imagem do carousel:', erro);
            showToast(erro.message || 'Erro ao enviar a imagem.', 'danger');
            return; // interrompe aqui — não tenta salvar o slide sem a imagem
        }
    }

    const id = document.getElementById('carousel-id').value;
    const dados = {
        title: document.getElementById('carousel-titulo').value,
        background_image: document.getElementById('carousel-background').value,
        description: document.getElementById('carousel-descricao').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/carousel/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Slide atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/carousel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Slide criado!', 'success');
        }

        limparFormularioCarousel();
        carregarCarousel();
    } catch (erro) {
        console.error('Erro ao salvar slide:', erro);
        showToast('Erro ao salvar slide.', 'danger');
    }
}

async function deletarCarouselAtual() {
    const id = document.getElementById('carousel-id').value;

    if (!id) {
        showToast('Selecione um slide (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este slide? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/carousel/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Slide excluído!', 'danger');
        limparFormularioCarousel();
        carregarCarousel();
    } catch (erro) {
        console.error('Erro ao excluir slide:', erro);
        showToast('Erro ao excluir slide.', 'danger');
    }
}

// ============================================================
// CRUD — HOME INFO
// ============================================================
let homeInfoCache = [];

async function carregarHomeInfo() {
    try {
        const response = await fetch(`${API_URL}/home-info`);
        homeInfoCache = await response.json();
        renderizarTabelaHomeInfo(homeInfoCache);
    } catch (erro) {
        console.error('Erro ao carregar home info:', erro);
    }
}

function renderizarTabelaHomeInfo(itens) {
    const tbody = document.getElementById('tb-home_info');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.text}</td>
            <td>${item.image || ''}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarHomeInfo(${item.id_info})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarHomeInfo(id) {
    const item = homeInfoCache.find(i => i.id_info === id);
    if (!item) return;

    document.getElementById('home-info-id').value = item.id_info;
    document.getElementById('home-info-imagem').value = item.image || '';
    document.getElementById('home-info-texto').value = item.text;

    // Limpa qualquer arquivo selecionado de antes, pra não subir por
    // engano junto com a edição deste registro
    const fileInput = document.getElementById('home-info-file');
    if (fileInput) fileInput.value = '';

    // Mostra a imagem que já está salva, pra você ver o que tem hoje
    // antes de decidir trocar
    const preview = document.getElementById('home-info-preview');
    if (preview) {
        if (item.image) {
            preview.src = item.image;
            preview.style.display = 'block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }

    document.getElementById('home-info-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-home-info').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioHomeInfo() {
    document.getElementById('home-info-id').value = '';
    document.getElementById('home-info-imagem').value = '';
    document.getElementById('home-info-texto').value = '';

    // O <input type="file"> e a prévia não são limpos pelos .value=''
    // acima — precisam ser resetados à parte
    const fileInput = document.getElementById('home-info-file');
    if (fileInput) fileInput.value = '';

    const preview = document.getElementById('home-info-preview');
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }

    document.getElementById('home-info-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handleHomeInfoSubmit(event) {
    event.preventDefault();

    const arquivo = document.getElementById('home-info-file').files[0];

    // Upload do arquivo (se houver), igual ao Carousel
    if (arquivo) {
        try {
            const formData = new FormData();
            formData.append('imagem', arquivo);

            const uploadResponse = await authFetch(`${API_URL}/upload-home-info`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                const erroBody = await uploadResponse.json().catch(() => ({}));
                throw new Error(erroBody.error || 'Falha ao enviar a imagem.');
            }

            const uploadData = await uploadResponse.json();
            document.getElementById('home-info-imagem').value = uploadData.path;
        } catch (erro) {
            console.error('Erro ao enviar imagem do home info:', erro);
            showToast(erro.message || 'Erro ao enviar a imagem.', 'danger');
            return; // interrompe aqui — não tenta salvar sem a imagem
        }
    }

    const id = document.getElementById('home-info-id').value;
    const dados = {
        image: document.getElementById('home-info-imagem').value,
        text: document.getElementById('home-info-texto').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/home-info/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Registro atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/home-info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Registro criado!', 'success');
        }

        limparFormularioHomeInfo();
        carregarHomeInfo();
    } catch (erro) {
        console.error('Erro ao salvar home info:', erro);
        showToast('Erro ao salvar registro.', 'danger');
    }
}

async function deletarHomeInfoAtual() {
    const id = document.getElementById('home-info-id').value;

    if (!id) {
        showToast('Selecione um registro (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/home-info/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Registro excluído!', 'danger');
        limparFormularioHomeInfo();
        carregarHomeInfo();
    } catch (erro) {
        console.error('Erro ao excluir home info:', erro);
        showToast('Erro ao excluir registro.', 'danger');
    }
}

// ============================================================
// CRUD — CONTATO INFO (tabela contact_info)
// ============================================================


function renderizarTabelaContatoInfo(itens) {
    const tbody = document.getElementById('tb-contato_info');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.phone || ''}</td>
            <td>${item.whatsapp || ''}</td>
            <td>${item.service_text || ''}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarContatoInfo(${item.id_info})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarContatoInfo(id) {
    const item = contatoInfoCache.find(i => i.id_info === id);
    if (!item) return;

    document.getElementById('contato-info-id').value = item.id_info;
    document.getElementById('contato-info-telefone').value = item.phone || '';
    document.getElementById('contato-info-whatsapp').value = item.whatsapp || '';
    document.getElementById('contato-info-atendimento').value = item.service_text || '';

    document.getElementById('contato-info-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-contato-info').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioContatoInfo() {
    document.getElementById('contato-info-id').value = '';
    document.getElementById('contato-info-telefone').value = '';
    document.getElementById('contato-info-whatsapp').value = '';
    document.getElementById('contato-info-atendimento').value = '';
    document.getElementById('contato-info-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handleContatoInfoSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('contato-info-id').value;
    const dados = {
        phone: document.getElementById('contato-info-telefone').value,
        whatsapp: document.getElementById('contato-info-whatsapp').value,
        service_text: document.getElementById('contato-info-atendimento').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/info/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Registro atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Registro criado!', 'success');
        }

        limparFormularioContatoInfo();
        carregarContatoInfo();
    } catch (erro) {
        console.error('Erro ao salvar info de contato:', erro);
        showToast('Erro ao salvar registro.', 'danger');
    }
}

async function deletarContatoInfoAtual() {
    const id = document.getElementById('contato-info-id').value;

    if (!id) {
        showToast('Selecione um registro (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/info/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Registro excluído!', 'danger');
        limparFormularioContatoInfo();
        carregarContatoInfo();
    } catch (erro) {
        console.error('Erro ao excluir info de contato:', erro);
        showToast('Erro ao excluir registro.', 'danger');
    }
}

// ============================================================
// EDITOR DE REGISTRO ÚNICO (tabela "main")
// ============================================================
// Algumas tabelas (main, home_info, contato_info, etc.) guardam só
// UM registro fixo por página, não uma lista. Essas duas funções são
// genéricas: servem pra Catálogo Main hoje, e reaproveitamos depois
// pra Home, Contato e Sobre, só trocando o idMain e o prefixo dos ids.
//
// idMain  → id_main fixo daquela página (1=home, 2=catálogo, 3=contato, 4=sobre)
// prefixo → prefixo usado nos ids dos campos no HTML (ex: "catalogo-main")

// Busca o registro na API e preenche o formulário
async function carregarMainUnico(idMain, prefixo) {
    try {
        const response = await fetch(`${API_URL}/main/${idMain}`);

        if (response.status === 404) {
            // Ainda não existe registro pra essa página (banco novo/sem seed)
            document.getElementById(`${prefixo}-titulo`).value = '';
            document.getElementById(`${prefixo}-subtitulo`).value = '';
            return;
        }

        const data = await response.json();
        document.getElementById(`${prefixo}-titulo`).value = data.title || '';
        document.getElementById(`${prefixo}-subtitulo`).value = data.subtitle || '';
    } catch (erro) {
        console.error('Erro ao carregar registro main:', erro);
        showToast('Erro ao carregar dados.', 'danger');
    }
}

// Salva o formulário — tenta atualizar (PUT); se o registro ainda não
// existir (404, banco novo sem seed), cria (POST) na primeira vez.
async function salvarMainUnico(event, idMain, prefixo) {
    event.preventDefault();

    const dados = {
        title: document.getElementById(`${prefixo}-titulo`).value,
        subtitle: document.getElementById(`${prefixo}-subtitulo`).value
    };

    try {
        let response = await authFetch(`${API_URL}/main/${idMain}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.status === 404) {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/main`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        if (!response.ok) throw new Error('Falha ao salvar');
        showToast('Salvo com sucesso!', 'success');
    } catch (erro) {
        console.error('Erro ao salvar main:', erro);
        showToast('Erro ao salvar.', 'danger');
    }
}
// ============================================================
// CRUD — HISTÓRIA (Sobre)
// ============================================================
let historiaCache = [];

async function carregarHistoria() {
    try {
        const response = await fetch(`${API_URL}/history`);
        historiaCache = await response.json();
        renderizarTabelaHistoria(historiaCache);
    } catch (erro) {
        console.error('Erro ao carregar história:', erro);
    }
}

function renderizarTabelaHistoria(itens) {
    const tbody = document.getElementById('tb-historia');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${trunc(item.text, 80)}</td>
            <td>${item.image || ''}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarHistoria(${item.id_history})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarHistoria(id) {
    const item = historiaCache.find(i => i.id_history === id);
    if (!item) return;

    document.getElementById('historia-id').value = item.id_history;
    document.getElementById('historia-titulo').value = item.title;
    document.getElementById('historia-imagem').value = item.image || '';
    document.getElementById('historia-texto').value = item.text;

    const fileInput = document.getElementById('historia-file');
    if (fileInput) fileInput.value = '';

    const preview = document.getElementById('historia-preview');
    if (preview) {
        if (item.image) {
            preview.src = item.image;
            preview.style.display = 'block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }

    document.getElementById('historia-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-historia').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioHistoria() {
    document.getElementById('historia-id').value = '';
    document.getElementById('historia-titulo').value = '';
    document.getElementById('historia-imagem').value = '';
    document.getElementById('historia-texto').value = '';

    const fileInput = document.getElementById('historia-file');
    if (fileInput) fileInput.value = '';

    const preview = document.getElementById('historia-preview');
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }

    document.getElementById('historia-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handleHistoriaSubmit(event) {
    event.preventDefault();

    const arquivo = document.getElementById('historia-file').files[0];

    if (arquivo) {
        try {
            const formData = new FormData();
            formData.append('imagem', arquivo);

            const uploadResponse = await authFetch(`${API_URL}/upload-history`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                const erroBody = await uploadResponse.json().catch(() => ({}));
                throw new Error(erroBody.error || 'Falha ao enviar a imagem.');
            }

            const uploadData = await uploadResponse.json();
            document.getElementById('historia-imagem').value = uploadData.path;
        } catch (erro) {
            console.error('Erro ao enviar imagem da história:', erro);
            showToast(erro.message || 'Erro ao enviar a imagem.', 'danger');
            return;
        }
    }

    const id = document.getElementById('historia-id').value;
    const dados = {
        title: document.getElementById('historia-titulo').value,
        image: document.getElementById('historia-imagem').value,
        text: document.getElementById('historia-texto').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/history/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Registro atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Registro criado!', 'success');
        }

        limparFormularioHistoria();
        carregarHistoria();
    } catch (erro) {
        console.error('Erro ao salvar história:', erro);
        showToast('Erro ao salvar registro.', 'danger');
    }
}

async function deletarHistoriaAtual() {
    const id = document.getElementById('historia-id').value;

    if (!id) {
        showToast('Selecione um registro (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/history/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Registro excluído!', 'danger');
        limparFormularioHistoria();
        carregarHistoria();
    } catch (erro) {
        console.error('Erro ao excluir história:', erro);
        showToast('Erro ao excluir registro.', 'danger');
    }
}

// ============================================================
// CRUD — PRINCÍPIOS (Sobre)
// ============================================================
let principiosCache = [];

async function carregarPrincipios() {
    try {
        const response = await fetch(`${API_URL}/principles`);
        principiosCache = await response.json();
        renderizarTabelaPrincipios(principiosCache);
    } catch (erro) {
        console.error('Erro ao carregar princípios:', erro);
    }
}

function renderizarTabelaPrincipios(itens) {
    const tbody = document.getElementById('tb-principios');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${trunc(item.text, 80)}</td>
            <td>${item.icon || ''}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarPrincipio(${item.id_principle})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarPrincipio(id) {
    const item = principiosCache.find(i => i.id_principle === id);
    if (!item) return;

    document.getElementById('principio-id').value = item.id_principle;
    document.getElementById('principio-titulo').value = item.title;
    document.getElementById('principio-icone').value = item.icon || '';
    document.getElementById('principio-texto').value = item.text;

    document.getElementById('principio-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-principios').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioPrincipio() {
    document.getElementById('principio-id').value = '';
    document.getElementById('principio-titulo').value = '';
    document.getElementById('principio-icone').value = '';
    document.getElementById('principio-texto').value = '';
    document.getElementById('principio-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handlePrincipioSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('principio-id').value;
    const dados = {
        title: document.getElementById('principio-titulo').value,
        icon: document.getElementById('principio-icone').value,
        text: document.getElementById('principio-texto').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/principles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Registro atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/principles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Registro criado!', 'success');
        }

        limparFormularioPrincipio();
        carregarPrincipios();
    } catch (erro) {
        console.error('Erro ao salvar princípio:', erro);
        showToast('Erro ao salvar registro.', 'danger');
    }
}

async function deletarPrincipioAtual() {
    const id = document.getElementById('principio-id').value;

    if (!id) {
        showToast('Selecione um registro (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/principles/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Registro excluído!', 'danger');
        limparFormularioPrincipio();
        carregarPrincipios();
    } catch (erro) {
        console.error('Erro ao excluir princípio:', erro);
        showToast('Erro ao excluir registro.', 'danger');
    }
}

// ============================================================
// CRUD — EQUIPE (Sobre)
// ============================================================
let equipeCache = [];

async function carregarEquipe() {
    try {
        const response = await fetch(`${API_URL}/team`);
        equipeCache = await response.json();
        renderizarTabelaEquipe(equipeCache);
    } catch (erro) {
        console.error('Erro ao carregar equipe:', erro);
    }
}

function renderizarTabelaEquipe(itens) {
    const tbody = document.getElementById('tb-equipe');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.specialist}</td>
            <td>${item.university || ''}</td>
            <td>${item.education || ''}</td>
            <td>${item.image || ''}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarEquipe(${item.id_team})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

// Um valor é considerado "imagem de verdade" (mostra prévia) se começar
// com "img/" — se for uma classe de ícone Bootstrap (ex: "bi bi-person-circle"),
// não faz sentido tentar carregar como <img src="...">
function pareceCaminhoDeImagem(valor) {
    return typeof valor === 'string' && valor.trim().startsWith('img/');
}

function editarEquipe(id) {
    const item = equipeCache.find(i => i.id_team === id);
    if (!item) return;

    document.getElementById('equipe-id').value = item.id_team;
    document.getElementById('equipe-especialista').value = item.specialist;
    document.getElementById('equipe-universidade').value = item.university || '';
    document.getElementById('equipe-formacao').value = item.education || '';
    document.getElementById('equipe-imagem').value = item.image || '';

    const fileInput = document.getElementById('equipe-file');
    if (fileInput) fileInput.value = '';

    const preview = document.getElementById('equipe-preview');
    if (preview) {
        if (pareceCaminhoDeImagem(item.image)) {
            preview.src = item.image;
            preview.style.display = 'block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }

    document.getElementById('equipe-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-equipe').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioEquipe() {
    document.getElementById('equipe-id').value = '';
    document.getElementById('equipe-especialista').value = '';
    document.getElementById('equipe-universidade').value = '';
    document.getElementById('equipe-formacao').value = '';
    document.getElementById('equipe-imagem').value = '';

    const fileInput = document.getElementById('equipe-file');
    if (fileInput) fileInput.value = '';

    const preview = document.getElementById('equipe-preview');
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }

    document.getElementById('equipe-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handleEquipeSubmit(event) {
    event.preventDefault();

    const arquivo = document.getElementById('equipe-file').files[0];

    // Upload é opcional aqui — só sobrescreve o campo se um arquivo
    // for escolhido; senão, mantém o que estiver digitado (ícone ou
    // caminho manual)
    if (arquivo) {
        try {
            const formData = new FormData();
            formData.append('imagem', arquivo);

            const uploadResponse = await authFetch(`${API_URL}/upload-team`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                const erroBody = await uploadResponse.json().catch(() => ({}));
                throw new Error(erroBody.error || 'Falha ao enviar a foto.');
            }

            const uploadData = await uploadResponse.json();
            document.getElementById('equipe-imagem').value = uploadData.path;
        } catch (erro) {
            console.error('Erro ao enviar foto da equipe:', erro);
            showToast(erro.message || 'Erro ao enviar a foto.', 'danger');
            return;
        }
    }

    const id = document.getElementById('equipe-id').value;
    const dados = {
        specialist: document.getElementById('equipe-especialista').value,
        university: document.getElementById('equipe-universidade').value,
        education: document.getElementById('equipe-formacao').value,
        image: document.getElementById('equipe-imagem').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/team/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Registro atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/team`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Registro criado!', 'success');
        }

        limparFormularioEquipe();
        carregarEquipe();
    } catch (erro) {
        console.error('Erro ao salvar membro da equipe:', erro);
        showToast('Erro ao salvar registro.', 'danger');
    }
}

async function deletarEquipeAtual() {
    const id = document.getElementById('equipe-id').value;

    if (!id) {
        showToast('Selecione um registro (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/team/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Registro excluído!', 'danger');
        limparFormularioEquipe();
        carregarEquipe();
    } catch (erro) {
        console.error('Erro ao excluir membro da equipe:', erro);
        showToast('Erro ao excluir registro.', 'danger');
    }
}

// ============================================================
// CRUD — DIFERENCIAIS (Sobre)
// ============================================================
let diferenciaisCache = [];

async function carregarDiferenciais() {
    try {
        const response = await fetch(`${API_URL}/differentials`);
        diferenciaisCache = await response.json();
        renderizarTabelaDiferenciais(diferenciaisCache);
    } catch (erro) {
        console.error('Erro ao carregar diferenciais:', erro);
    }
}

function renderizarTabelaDiferenciais(itens) {
    const tbody = document.getElementById('tb-diferenciais');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
        return;
    }

    tbody.innerHTML = itens.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.description}</td>
            <td>
                <button class="btn-sm-roxo me-1" onclick="editarDiferencial(${item.id_differential})">
                    <i class="bi bi-pencil-fill"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function editarDiferencial(id) {
    const item = diferenciaisCache.find(i => i.id_differential === id);
    if (!item) return;

    document.getElementById('diferencial-id').value = item.id_differential;
    document.getElementById('diferencial-descricao').value = item.description;

    document.getElementById('diferencial-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar';
    document.getElementById('form-diferenciais').scrollIntoView({ behavior: 'smooth' });
}

function limparFormularioDiferencial() {
    document.getElementById('diferencial-id').value = '';
    document.getElementById('diferencial-descricao').value = '';
    document.getElementById('diferencial-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir';
}

async function handleDiferencialSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('diferencial-id').value;
    const dados = {
        description: document.getElementById('diferencial-descricao').value
    };

    try {
        let response;
        if (id) {
            response = await authFetch(`${API_URL}/differentials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            showToast('Registro atualizado!', 'success');
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/differentials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Falha ao criar');
            showToast('Registro criado!', 'success');
        }

        limparFormularioDiferencial();
        carregarDiferenciais();
    } catch (erro) {
        console.error('Erro ao salvar diferencial:', erro);
        showToast('Erro ao salvar registro.', 'danger');
    }
}

async function deletarDiferencialAtual() {
    const id = document.getElementById('diferencial-id').value;

    if (!id) {
        showToast('Selecione um registro (clique em Editar) antes de deletar.', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/differentials/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Registro excluído!', 'danger');
        limparFormularioDiferencial();
        carregarDiferenciais();
    } catch (erro) {
        console.error('Erro ao excluir diferencial:', erro);
        showToast('Erro ao excluir registro.', 'danger');
    }
}

// ============================================================
// MENSAGENS DE CONTATO (só leitura + exclusão, sem formulário —
// os registros vêm do formulário público de contato)
// ============================================================
async function carregarMensagens() {
    try {
        const response = await authFetch(`${API_URL}/message`);
        if (!response.ok) throw new Error('Falha ao carregar mensagens');
        const itens = await response.json();
        renderizarTabelaMensagens(itens);
    } catch (erro) {
        console.error('Erro ao carregar mensagens:', erro);
    }
}

function renderizarTabelaMensagens(itens) {
    const tbody = document.getElementById('tb-mensagem');

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Nenhuma mensagem recebida ainda</td></tr>`;
        return;
    }

    // Já vem ordenado do backend (mais recente primeiro)
    tbody.innerHTML = itens.map(item => `
        <tr>
            <td>${new Date(item.created_at).toLocaleString('pt-BR')}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${trunc(item.message, 100)}</td>
            <td>
                <button class="btn-sm-danger" onclick="deletarMensagemPorId(${item.id_message})">
                    <i class="bi bi-trash-fill"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

async function deletarMensagemPorId(id) {
    if (!(await confirmarExclusao('Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/message/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        showToast('Mensagem excluída!', 'danger');
        carregarMensagens();
    } catch (erro) {
        console.error('Erro ao excluir mensagem:', erro);
        showToast('Erro ao excluir mensagem.', 'danger');
    }
}

// ============================================================
// VALIDAÇÃO E MÁSCARA DE TELEFONE (usado no Info Contato)
// ============================================================

// Formata o valor enquanto o usuário digita: (11) 4515-0556 ou (11) 97199-3704
function mascararTelefone(input) {
    let digitos = input.value.replace(/\D/g, '').slice(0, 11);

    if (digitos.length > 10) {
        // Celular/WhatsApp: (11) 97199-3704
        input.value = digitos.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (digitos.length > 6) {
        // Fixo: (11) 4515-0556
        input.value = digitos.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (digitos.length > 2) {
        input.value = digitos.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (digitos.length > 0) {
        input.value = `(${digitos}`;
    } else {
        input.value = '';
    }
}

// Aceita telefone fixo (11) 4515-0556 ou celular (11) 97199-3704.
// DDD entre 11 e 99, número com 8 ou 9 dígitos.
const REGEX_TELEFONE = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

function validarTelefone(valor) {
    return REGEX_TELEFONE.test(valor.trim());
}

// Mostra/some a mensagem de erro embaixo do campo e marca a borda vermelha.
// Retorna true se o campo é válido.
function validarCampoTelefone(inputId, erroId, obrigatorio) {
    const input = document.getElementById(inputId);
    const erroEl = document.getElementById(erroId);
    const valor = input.value.trim();

    if (!valor && !obrigatorio) {
        input.classList.remove('is-invalid-custom');
        erroEl.style.display = 'none';
        return true;
    }

    if (!valor && obrigatorio) {
        input.classList.add('is-invalid-custom');
        erroEl.textContent = 'Esse campo é obrigatório.';
        erroEl.style.display = 'block';
        return false;
    }

    if (!validarTelefone(valor)) {
        input.classList.add('is-invalid-custom');
        erroEl.textContent = 'Formato inválido. Use (11) 4515-0556 ou (11) 97199-3704.';
        erroEl.style.display = 'block';
        return false;
    }

    input.classList.remove('is-invalid-custom');
    erroEl.style.display = 'none';
    return true;
}

// ============================================================
// CONTATO INFO — registro único (telefone, whatsapp, atendimento)
// ============================================================
// Não fixamos o id_info: o AUTO_INCREMENT do MySQL não reaproveita
// ids de registros excluídos, então o id real pode não ser 1. Por
// isso buscamos a lista e usamos o primeiro (e único) registro que
// existir, guardando o id de verdade pra usar no PUT.
let contatoInfoId = null;

async function carregarContatoInfo() {
    try {
        const response = await fetch(`${API_URL}/info`);
        const lista = await response.json();

        if (lista.length === 0) {
            contatoInfoId = null;
            document.getElementById('contato-info-telefone').value = '';
            document.getElementById('contato-info-whatsapp').value = '';
            document.getElementById('contato-info-atendimento').value = '';
            return;
        }

        const data = lista[0];
        contatoInfoId = data.id_info;
        document.getElementById('contato-info-telefone').value = data.phone || '';
        document.getElementById('contato-info-whatsapp').value = data.whatsapp || '';
        document.getElementById('contato-info-atendimento').value = data.service_text || '';
    } catch (erro) {
        console.error('Erro ao carregar info de contato:', erro);
        showToast('Erro ao carregar dados.', 'danger');
    }
}

async function salvarContatoInfo(event) {
    event.preventDefault();

    // Telefone é opcional (mas se preenchido, precisa ter formato válido);
    // WhatsApp é obrigatório
    const telefoneOk = validarCampoTelefone('contato-info-telefone', 'contato-info-telefone-erro', false);
    const whatsappOk = validarCampoTelefone('contato-info-whatsapp', 'contato-info-whatsapp-erro', true);

    if (!telefoneOk || !whatsappOk) {
        showToast('Corrija os campos destacados antes de salvar.', 'danger');
        return;
    }

    const dados = {
        phone: document.getElementById('contato-info-telefone').value,
        whatsapp: document.getElementById('contato-info-whatsapp').value,
        service_text: document.getElementById('contato-info-atendimento').value
    };

    try {
        let response;

        if (contatoInfoId) {
            response = await authFetch(`${API_URL}/info/${contatoInfoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        if (!response.ok) throw new Error('Falha ao salvar');
        showToast('Salvo com sucesso!', 'success');
        await carregarContatoInfo(); // garante que capturamos o id real após criar
    } catch (erro) {
        console.error('Erro ao salvar info de contato:', erro);
        showToast('Erro ao salvar.', 'danger');
    }
}

// ============================================================
// LOCALIZAÇÃO — registro único (mapa embed + endereço em 3 linhas)
// ============================================================
// Igual ao Info Contato: não fixamos o id, buscamos o primeiro
// registro que existir e guardamos o id real pra usar no PUT.
let localizacaoId = null;

// Aceita tanto o <iframe ...src="URL"...> inteiro (o que o Google Maps
// dá em "Copiar HTML") quanto só a URL direta, e sempre devolve só a URL.
function extrairSrcDoIframe(valor) {
    const texto = String(valor || '').trim();

    if (!texto) return '';

    const match = texto.match(/src=["']([^"']+)["']/i);
    if (match) return match[1];

    return texto; // já era só a URL
}

function validarUrlMaps(url) {
    if (!url) return true; // mapa é opcional
    return /^https:\/\/www\.google\.com\/maps\/embed/.test(url);
}

async function carregarLocalizacao() {
    try {
        const response = await fetch(`${API_URL}/location`);
        const lista = await response.json();

        const preview = document.getElementById('localizacao-preview');

        if (lista.length === 0) {
            localizacaoId = null;
            document.getElementById('localizacao-maps').value = '';
            document.getElementById('localizacao-linha1').value = '';
            document.getElementById('localizacao-linha2').value = '';
            document.getElementById('localizacao-linha3').value = '';
            preview.innerHTML = 'Nenhum mapa configurado ainda.';
            return;
        }

        const data = lista[0];
        localizacaoId = data.id_location;

        document.getElementById('localizacao-maps').value = data.maps_url || '';

        const linhas = String(data.address || '').split('\n');
        document.getElementById('localizacao-linha1').value = linhas[0] || '';
        document.getElementById('localizacao-linha2').value = linhas[1] || '';
        document.getElementById('localizacao-linha3').value = linhas[2] || '';

        atualizarPreviewMapa(data.maps_url);
    } catch (erro) {
        console.error('Erro ao carregar localização:', erro);
        showToast('Erro ao carregar dados.', 'danger');
    }
}

function atualizarPreviewMapa(url) {
    const preview = document.getElementById('localizacao-preview');

    if (!url) {
        preview.innerHTML = 'Nenhum mapa configurado ainda.';
        return;
    }

    preview.innerHTML = `<iframe src="${url}" width="100%" height="300" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}

async function salvarLocalizacao(event) {
    event.preventDefault();

    const mapsInput = document.getElementById('localizacao-maps');
    const mapsErro = document.getElementById('localizacao-maps-erro');
    const urlExtraida = extrairSrcDoIframe(mapsInput.value);

    if (!validarUrlMaps(urlExtraida)) {
        mapsInput.classList.add('is-invalid-custom');
        mapsErro.textContent = 'Isso não parece uma URL de embed válida do Google Maps. Use "Compartilhar → Incorporar um mapa → Copiar HTML" e cole o código aqui.';
        mapsErro.style.display = 'block';
        return;
    }
    mapsInput.classList.remove('is-invalid-custom');
    mapsErro.style.display = 'none';

    // Deixa o campo já mostrando só a URL limpa, mesmo que o usuário
    // tenha colado o <iframe> inteiro
    mapsInput.value = urlExtraida;

    const linha1 = document.getElementById('localizacao-linha1').value.trim();
    const linha2 = document.getElementById('localizacao-linha2').value.trim();
    const linha3 = document.getElementById('localizacao-linha3').value.trim();
    const enderecoCompleto = [linha1, linha2, linha3].filter(Boolean).join('\n');

    const dados = {
        maps_url: urlExtraida,
        address: enderecoCompleto
    };

    try {
        let response;

        if (localizacaoId) {
            response = await authFetch(`${API_URL}/location/${localizacaoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            dados.id_user = currentUser?.id_user;
            response = await authFetch(`${API_URL}/location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        if (!response.ok) throw new Error('Falha ao salvar');
        showToast('Salvo com sucesso!', 'success');
        atualizarPreviewMapa(urlExtraida);
        await carregarLocalizacao();
    } catch (erro) {
        console.error('Erro ao salvar localização:', erro);
        showToast('Erro ao salvar.', 'danger');
    }
}

// ============================================================
// ADMINISTRADORES — CRUD real (tabela users)
// ============================================================
let adminsCache = [];

async function carregarAdmins() {
    try {
        const response = await authFetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Falha ao carregar administradores');
        adminsCache = await response.json();
        renderAdmins();
        renderAdminStats();
    } catch (erro) {
        console.error('Erro ao carregar administradores:', erro);
        showToast('Erro ao carregar administradores.', 'danger');
    }
}

function renderAdmins() {
    const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
    const perfil = document.getElementById('admin-filter-perfil')?.value || '';
    const status = document.getElementById('admin-filter-status')?.value || '';

    let lista = adminsCache;
    if (search) lista = lista.filter(a => `${a.name} ${a.email} ${a.login}`.toLowerCase().includes(search));
    if (perfil) lista = lista.filter(a => String(a.role_id) === perfil);
    if (status) lista = lista.filter(a => String(a.status) === status);

    const tbody = document.getElementById('tb-admins');

    if (lista.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Nenhum registro</td></tr>';
        return;
    }

    if (tbody) {
        tbody.innerHTML = lista.map((a, i) => {
            const r = roleLabels[a.role_id] || { label: 'Desconhecido', cls: 'role-viewer' };
            const isMe = currentUser && a.id_user === currentUser.id_user;
            const ativo = Number(a.status) === 1;

            return `<tr>
                <td>${i + 1}</td>
                <td>${a.name}${isMe ? ' <span class="badge" style="background:var(--roxo);font-size:9px">você</span>' : ''}</td>
                <td><code style="background:var(--roxo-pale);padding:2px 7px;border-radius:4px;font-size:12px;color:var(--roxo)">@${a.login}</code></td>
                <td>${a.email}</td>
                <td><span class="role-badge ${r.cls}">${r.label}</span></td>
                <td><span class="status-dot ${ativo ? 'active' : 'inactive'}"></span>${ativo ? 'Ativo' : 'Inativo'}</td>
                <td style="font-size:12px;color:#999">${a.created_at ? new Date(a.created_at).toLocaleDateString('pt-BR') : '—'}</td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn-sm-roxo" onclick="editarAdmin(${a.id_user})"><i class="bi bi-pencil-fill"></i> Editar</button>
                        <button class="btn-sm-danger" onclick="deletarAdmin(${a.id_user})" ${isMe ? 'disabled' : ''}><i class="bi bi-trash-fill"></i></button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }
}

function renderAdminStats() {
    const el = document.getElementById('admin-stats');
    if (!el) return;

    const mk = (icon, label, val, color) => `<div class="col-6 col-md-3">
        <div class="stat-card">
            <div class="stat-icon">${icon}</div>
            <div class="stat-value" style="color:${color}">${val}</div>
            <div class="stat-label">${label}</div>
        </div>
    </div>`;

    el.innerHTML =
        mk('<i class="bi bi-people-fill" style="color:var(--roxo)"></i>', 'Total', adminsCache.length, 'var(--roxo)') +
        mk('<i class="bi bi-check-circle-fill" style="color:#198754"></i>', 'Ativos', adminsCache.filter(a => Number(a.status) === 1).length, '#198754') +
        mk('<i class="bi bi-shield-fill" style="color:var(--dourado)"></i>', 'Root / Super Admin', adminsCache.filter(a => Number(a.role_id) === 1).length, 'var(--dourado)') +
        mk('<i class="bi bi-person-badge-fill" style="color:#5a7fcc"></i>', 'Secretárias', adminsCache.filter(a => Number(a.role_id) === 3).length, '#5a7fcc');
}

function editarAdmin(id) {
    const a = adminsCache.find(x => x.id_user === id);
    if (!a) return;

    document.getElementById('admin-form-id').value = a.id_user;
    document.getElementById('af-nome').value = a.name;
    document.getElementById('af-email').value = a.email;
    document.getElementById('af-usuario').value = a.login;
    document.getElementById('af-telefone').value = a.phone || '';
    document.getElementById('af-perfil').value = a.role_id;
    document.getElementById('af-status').value = a.status;
    document.getElementById('af-senha').value = '';
    document.getElementById('af-senha2').value = '';

    // E-mail e login são fixos após a criação — só dá pra ver, não editar
    document.getElementById('af-email').readOnly = true;
    document.getElementById('af-usuario').readOnly = true;
    document.getElementById('af-email-hint').style.display = 'block';
    document.getElementById('af-usuario-hint').style.display = 'block';

    document.getElementById('admin-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Salvar Alterações';
    document.getElementById('pw-hint').textContent = 'Deixe em branco para manter a senha atual.';
    document.querySelector('#page-admins .admin-card').scrollIntoView({ behavior: 'smooth' });
}

function resetAdminForm() {
    document.getElementById('admin-form-id').value = '';
    ['af-nome', 'af-email', 'af-usuario', 'af-telefone', 'af-senha', 'af-senha2'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('af-perfil').value = '2';
    document.getElementById('af-status').value = '1';

    // Volta a liberar e-mail/login pra edição (só ficam travados no modo "editar")
    document.getElementById('af-email').readOnly = false;
    document.getElementById('af-usuario').readOnly = false;
    document.getElementById('af-email-hint').style.display = 'none';
    document.getElementById('af-usuario-hint').style.display = 'none';

    document.getElementById('admin-form-btn').innerHTML = '<i class="bi bi-person-plus-fill me-1"></i>Cadastrar Administrador';
    document.getElementById('pw-bar').className = 'pw-bar';
    document.getElementById('pw-hint').textContent = '';
}

async function handleAdminSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('admin-form-id').value;
    const nome = document.getElementById('af-nome').value.trim();
    const email = document.getElementById('af-email').value.trim();
    const login = document.getElementById('af-usuario').value.trim();
    const telefone = document.getElementById('af-telefone').value.trim();
    const perfil = document.getElementById('af-perfil').value;
    const status = document.getElementById('af-status').value;
    const senha = document.getElementById('af-senha').value;
    const senha2 = document.getElementById('af-senha2').value;

    if (!nome || !email || !login || !telefone) {
        showToast('Preencha nome, e-mail, usuário e telefone.', 'danger');
        return;
    }

    if (!validarTelefone(telefone)) {
        showToast('Telefone em formato inválido. Use (11) 98888-7777.', 'danger');
        return;
    }

    if (senha && senha !== senha2) {
        showToast('As senhas não conferem!', 'danger');
        return;
    }
    if (senha && senha.length < 6) {
        showToast('A senha deve ter no mínimo 6 caracteres.', 'danger');
        return;
    }

    try {
        if (id) {
            // MODO EDIÇÃO
            const response = await authFetch(`${API_URL}/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nome, phone: telefone,
                    role_id: Number(perfil), status: Number(status)
                    // email e login não são enviados: são fixos após a criação
                })
            });

            if (!response.ok) {
                const erroBody = await response.json().catch(() => ({}));
                throw new Error(erroBody.error || 'Falha ao atualizar');
            }

            if (senha) {
                const respSenha = await authFetch(`${API_URL}/users/${id}/senha`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: senha })
                });
                if (!respSenha.ok) throw new Error('Dados atualizados, mas falhou ao trocar a senha.');
            }

            showToast('Administrador atualizado!', 'success');
        } else {
            // MODO CRIAÇÃO
            if (!senha) {
                showToast('Informe uma senha.', 'danger');
                return;
            }

            const response = await authFetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nome, email, login, password: senha,
                    phone: telefone, role_id: Number(perfil)
                })
            });

            if (!response.ok) {
                const erroBody = await response.json().catch(() => ({}));
                throw new Error(erroBody.error || 'Falha ao criar');
            }

            showToast('Administrador cadastrado!', 'success');
        }

        resetAdminForm();
        carregarAdmins();
    } catch (erro) {
        console.error('Erro ao salvar administrador:', erro);
        showToast(erro.message || 'Erro ao salvar administrador.', 'danger');
    }
}

async function deletarAdmin(id) {
    if (currentUser && id === currentUser.id_user) {
        showToast('Não é possível excluir a própria conta!', 'danger');
        return;
    }

    if (!(await confirmarExclusao('Tem certeza que deseja excluir este administrador? Esta ação não pode ser desfeita.'))) return;

    try {
        const response = await authFetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const erroBody = await response.json().catch(() => ({}));
            throw new Error(erroBody.error || 'Falha ao excluir');
        }
        showToast('Administrador excluído!', 'danger');
        carregarAdmins();
    } catch (erro) {
        console.error('Erro ao excluir administrador:', erro);
        showToast(erro.message || 'Erro ao excluir administrador.', 'danger');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    configurarPreviewImagem('carousel-file', 'carousel-preview');
    configurarPreviewImagem('home-info-file', 'home-info-preview');
    configurarPreviewImagem('historia-file', 'historia-preview');
    configurarPreviewImagem('equipe-file', 'equipe-preview');
});

// Mostra uma prévia local (antes mesmo do upload acontecer) assim que
// o usuário escolhe um arquivo em qualquer campo type="file" de imagem
function configurarPreviewImagem(idInput, idPreview) {
    const fileInput = document.getElementById(idInput);
    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const preview = document.getElementById(idPreview);
        if (!preview) return;

        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
    });
}

// ============================================================
// AUTENTICAÇÃO, SESSÃO E MODAIS
// ============================================================

const DB = {};
let currentUser = null;
let deleteCtx   = null;
let editCtx     = null;

const bsDeleteModal = null; // inicializado depois do DOM
let _bsDelete, _bsEdit;

window.addEventListener('DOMContentLoaded', () => {
  _bsDelete = new bootstrap.Modal(document.getElementById('modal-delete'));
  _bsEdit   = new bootstrap.Modal(document.getElementById('modal-edit'));

  // Se o modal for fechado sem confirmar (Cancelar, X ou Esc),
  // resolve a promise como "false".
  document.getElementById('modal-delete')
    .addEventListener('hidden.bs.modal', () => resolverConfirmacaoExclusao(false));

  restaurarSessao();
});

// ============================================================
// CONFIRMAÇÃO DE EXCLUSÃO — substitui o confirm() nativo do
// navegador pelo modal padrão do site (#modal-delete).
//
// Uso: if (!(await confirmarExclusao('mensagem'))) return;
// ============================================================
let _resolveConfirmacaoExclusao = null;

function confirmarExclusao(mensagem) {
  const msgEl = document.getElementById('modal-delete-msg');
  if (msgEl) {
    msgEl.textContent = mensagem || 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.';
  }
  _bsDelete.show();
  return new Promise((resolve) => {
    _resolveConfirmacaoExclusao = resolve;
  });
}

function resolverConfirmacaoExclusao(confirmado) {
  if (_resolveConfirmacaoExclusao) {
    _resolveConfirmacaoExclusao(confirmado);
    _resolveConfirmacaoExclusao = null;
  }
}

function dbGet(t)        { return DB[t] || []; }
function dbInsert(t, r)  { if (!DB[t]) DB[t] = []; r._id = Date.now(); DB[t].push(r); }
function dbUpdate(t,id,d){ DB[t] = (DB[t]||[]).map(r => r._id==id ? {...r,...d} : r); }
function dbDelete(t, id) { DB[t] = (DB[t]||[]).filter(r => r._id!=id); }

// role_id conforme a tabela "roles" do banco: 1=root, 2=admin, 3=secretaria
const roleLabels = {
  1: { label:'Root / Super Admin', cls:'role-super' },
  2: { label:'Admin',              cls:'role-admin' },
  3: { label:'Secretária',         cls:'role-editor' },
};

// ============================================================
// AUTH — integrado com a API real (JWT access token + refresh cookie)
// ============================================================

// accessToken fica em sessionStorage: sobrevive a um F5 na mesma aba,
// mas some ao fechar a aba. O refreshToken (mais sensível) NUNCA fica
// aqui — ele vive só em cookie httpOnly, o JS nem consegue lê-lo.
function getAccessToken() {
  return sessionStorage.getItem('accessToken');
}

function setSession(accessToken, user) {
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('user', JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
}

// Wrapper de fetch que já manda o token e tenta renovautomaticamente
// se o access token tiver expirado (erro 403 do middleware de auth).
async function authFetch(url, options = {}) {
  const doFetch = (token) => fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    }
  });

  let response = await doFetch(getAccessToken());

  if (response.status === 403) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      sessionStorage.setItem('accessToken', accessToken);
      response = await doFetch(accessToken);
    } else {
      doLogout();
    }
  }

  return response;
}

function showPanel(user) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('panel-screen').style.display  = 'flex';
  document.getElementById('topbar-name').textContent   = user.name;
  document.getElementById('topbar-role').textContent   = roleLabels[user.role_id]?.label || 'Usuário';
  document.getElementById('topbar-avatar').textContent = user.name.charAt(0).toUpperCase();

  // Administradores: Root e Admin acessam (Admin não vê o form de criar,
  // isso é tratado à parte). Secretária nunca vê esse link.
  document.getElementById('nav-admins').style.display = (user.role_id === 1 || user.role_id === 2) ? 'flex' : 'none';

  // Só Root pode CRIAR novos administradores — o card do formulário some pros demais
  const cardNovoAdmin = document.getElementById('card-novo-admin');
  if (cardNovoAdmin) cardNovoAdmin.style.display = (user.role_id === 1) ? '' : 'none';

  // Secretária (role_id 3): modo somente-leitura em todo o painel —
  // some com botões de salvar/editar/excluir/novo registro
  document.body.classList.toggle('somente-leitura', user.role_id === 3);

  currentUser = user;

  // Restaura a página/aba que o usuário estava vendo antes (sobrevive
  // a um F5 ou a um reload do Live Server). Na primeira vez que loga
  // (sem nada salvo ainda), cai em Home > Main por padrão.
  restaurarUltimaPaginaEAba();
}

async function doLogin() {
  const email = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const errorBox = document.getElementById('login-error');

  errorBox.style.display = 'none';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // necessário para o navegador salvar o cookie do refresh token
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorBox.style.display = 'block';
      return;
    }

    setSession(data.accessToken, data.user);
    showPanel(data.user);
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    errorBox.style.display = 'block';
  }
}

async function doLogout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (erro) {
    console.error('Erro ao fazer logout:', erro);
  }

  clearSession();
  currentUser = null;
  document.getElementById('panel-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('nav-admins').style.display = 'none';
  document.body.classList.remove('somente-leitura');
}

// Ao carregar a página, se já tiver uma sessão salva (ex: F5), pula o login
function restaurarSessao() {
  const token = getAccessToken();
  const userRaw = sessionStorage.getItem('user');
  if (token && userRaw) {
    showPanel(JSON.parse(userRaw));
  }
}

// ============================================================
// NAVIGATION
// ============================================================
function showPage(page, link) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  if (!link) link = document.querySelector(`.sidebar a[data-page="${page}"]`);
  if (link) link.classList.add('active');
  if (page === 'admins') { renderAdmins(); renderAdminStats(); }
  sessionStorage.setItem('painelUltimaPagina', page);
}

// ============================================================
// TABS
// ============================================================
function switchTab(link, page, tab) {
  if (!link) link = document.querySelector(`#page-${page} .nav-link[data-tab="${tab}"]`);
  const parent = link ? link.closest('.page') : document.getElementById('page-'+page);
  parent.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  if (link) link.classList.add('active');
  document.getElementById(page+'-tab-'+tab).classList.add('active');
  sessionStorage.setItem('painelUltimaAba_' + page, tab);
}

// Mapeia cada página+aba pra função que carrega os dados dela — usado
// só na restauração após um reload, pra repor os dados da aba certa
// (o clique normal do usuário já dispara isso pelo próprio onclick)
const carregadoresPorAba = {
  'home:main':          () => carregarMainUnico(1, 'home-main'),
  'home:carousel':      carregarCarousel,
  'home:info':          carregarHomeInfo,
  'sobre:main':         () => carregarMainUnico(4, 'sobre-main'),
  'sobre:historia':     carregarHistoria,
  'sobre:principios':   carregarPrincipios,
  'sobre:equipe':       carregarEquipe,
  'sobre:diferenciais': carregarDiferenciais,
  'catalogo:main':      () => carregarMainUnico(2, 'catalogo-main'),
  'catalogo:item':      carregarItens,
  'contato:main':       () => carregarMainUnico(3, 'contato-main'),
  'contato:mensagem':   carregarMensagens,
  'contato:localizacao': carregarLocalizacao,
  'contato:info':       carregarContatoInfo
};

// Restaura a página/aba que o usuário estava vendo antes de um reload
// (F5, ou o auto-reload do Live Server ao detectar um arquivo novo em
// frontend/img/ depois de um upload). Sem isso, o painel sempre volta
// pra Home > Main depois de qualquer reload.
function restaurarUltimaPaginaEAba() {
  const pagina = sessionStorage.getItem('painelUltimaPagina') || 'home';
  const aba = sessionStorage.getItem('painelUltimaAba_' + pagina);

  showPage(pagina, null);

  if (aba) {
    switchTab(null, pagina, aba);
  }

  const chave = pagina + ':' + (aba || 'main');
  const carregador = carregadoresPorAba[chave];
  if (carregador) carregador();
}

// ============================================================
// FORM SUBMIT
// ============================================================
const schemas = {
  home_main:     ['home_Titulo','home_subtitulo'],
  home_carousel: ['Image_Titulo','Image_Descricao','Image_Backgroud'],
  home_info:     ['info_texto','info_image'],
  sobre_main:    ['sobre_Titulo','sobre_subtitulo'],
  historia:      ['Historia_titulo','Historia_texto','Historia_Image'],
  principios:    ['principios_titulo','principios_texto','principios_icone'],
  equipe:        ['equipe_especialista','equipe_universidade','equipe_formacao','equipe_image'],
  diferenciais:  ['Diferenciais_descricao'],
  catalogo_main: ['catalogo_Titulo','contato_subtitulo'],
  item_catalogo: ['item_catalogo_titulo','item_catalogo_descricao_curta','item_catalogo_descricao_modal'],
  contato_main:  ['contato_titulo','contato_subtitulo'],
  mensagem:      ['mensagem_nome','mensagem_email','mensagem_texto'],
  localizacao:   ['localizacao_maps','localizacao_endereco'],
  contato_info:  ['localizacao_maps','contato_info_telefone','contato_info_whatsapp','contato_info_texto_atendimento'],
};

function handleSubmit(e, table) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const id = data.id; delete data.id;
  if (id) { dbUpdate(table, id, data); showToast('Registro atualizado!','success'); }
  else    { dbInsert(table, data);     showToast('Registro inserido!','success'); }
  form.reset();
  renderTable(table);
}

function renderTable(table) {
  const tbody  = document.getElementById('tb-'+table);
  if (!tbody) return;
  const rows   = dbGet(table);
  const fields = schemas[table] || [];
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${fields.length+2}" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map((r,i) => `
    <tr>
      <td>${i+1}</td>
      ${fields.map(f=>`<td title="${r[f]||''}">${trunc(r[f]||'—',35)}</td>`).join('')}
      <td>
        <button class="btn-sm-roxo me-1" onclick="openEdit('${table}',${r._id})"><i class="bi bi-pencil-fill"></i> Editar</button>
        <button class="btn-sm-danger"    onclick="confirmDelete('${table}',${r._id})"><i class="bi bi-trash-fill"></i></button>
      </td>
    </tr>`).join('');
}

function trunc(s,n){ s=String(s); return s.length>n ? s.slice(0,n)+'…' : s; }

// ============================================================
// EDIT MODAL
// ============================================================
function openEdit(table, id) {
  const row = dbGet(table).find(r=>r._id==id);
  if (!row) return;
  editCtx = { table, id };
  const fields = schemas[table] || [];
  document.getElementById('modal-edit-title').innerHTML = `<i class="bi bi-pencil-fill me-2"></i>Editar — ${table}`;
  document.getElementById('modal-edit-body').innerHTML = `<div class="row g-3">${
    fields.map(f=>`<div class="col-12">
      <label class="form-label">${f}</label>
      ${f.toLowerCase().includes('texto')||f.toLowerCase().includes('descricao')
        ? `<textarea class="form-control" id="edit-${f}" rows="3">${row[f]||''}</textarea>`
        : `<input type="text" class="form-control" id="edit-${f}" value="${row[f]||''}">`}
    </div>`).join('')
  }</div>`;
  _bsEdit.show();
}

function saveEdit() {
  if (!editCtx) return;
  const fields = schemas[editCtx.table] || [];
  const data = {};
  fields.forEach(f => { const el=document.getElementById('edit-'+f); if(el) data[f]=el.value; });
  dbUpdate(editCtx.table, editCtx.id, data);
  renderTable(editCtx.table);
  _bsEdit.hide();
  showToast('Registro atualizado!','success');
}

// ============================================================
// DELETE
// ============================================================
function confirmDelete(table, id) {
  deleteCtx = { table, id };
  _bsDelete.show();
}

function doDelete() {
  if (!deleteCtx) return;
  if (deleteCtx.id) {
    dbDelete(deleteCtx.table, deleteCtx.id);
    renderTable(deleteCtx.table);
    showToast('Registro excluído!','danger');
  }
  _bsDelete.hide();
}

// ============================================================
// PW UTILS
// ============================================================
function checkStrength(input){
  const v=input.value,bar=document.getElementById('pw-bar'),hint=document.getElementById('pw-hint');
  let s=0;
  if(v.length>=8)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;
  bar.className='pw-bar'+(s?' s'+s:'');
  hint.textContent=v.length?['','Fraca','Razoável','Boa','Forte ✓'][s]:'';
}

function togglePw(id,btn){
  const el=document.getElementById(id);
  if(!el)return;
  el.type=el.type==='password'?'text':'password';
  btn.innerHTML=el.type==='password'?'<i class="bi bi-eye"></i>':'<i class="bi bi-eye-slash"></i>';
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type='success'){
  const el=document.getElementById('main-toast');
  el.className=`toast align-items-center text-white border-0 bg-${type==='success'?'success':type==='danger'?'danger':'secondary'}`;
  document.getElementById('toast-msg').textContent=msg;
  new bootstrap.Toast(el,{delay:2800}).show();
}
