const API_URL = 'http://localhost:3001/api';

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
            await fetch(`${API_URL}/item/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            showToast('Item atualizado!', 'success');
        } else {
            // MODO CRIAÇÃO → POST
            // ATENÇÃO: id_user é obrigatório no backend — ainda não temos login real conectado.
            // Por enquanto, fixamos id_user = 1 (ajustamos isso quando plugarmos o login de verdade).
            dados.id_user = 1;

            await fetch(`${API_URL}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
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

    const confirmar = confirm('Tem certeza que deseja excluir este item?');
    if (!confirmar) return;

    try {
        await fetch(`${API_URL}/item/${id}`, { method: 'DELETE' });
        showToast('Item excluído!', 'danger');
        limparFormularioItem();
        carregarItens();
    } catch (erro) {
        console.error('Erro ao excluir item:', erro);
        showToast('Erro ao excluir item.', 'danger');
    }
}