// API_URL já vem declarada globalmente pelo js/script.js (carregado antes deste arquivo)

// Busca os itens da API
async function buscarItens() {
    try {
        const response = await fetch(`${API_URL}/item`);
        const itens = await response.json();

        renderizarItens(itens);
    } catch (erro) {
        console.error('Erro ao conectar com a API:', erro);
    }
}

// Gera o HTML de um único card + modal
function criarCardHTML(item) {
    return `
        <section class="homeleft">
            <div class="contact-form">
                <h2><i class="bi bi-envelope"></i>${item.title}</h2>
                <div class="form-group">
                    <p>${item.short_description}</p>
                </div>
            </div>
            <div class="form-buttons">
                <button type="button" class="btn-clear" data-bs-toggle="modal" data-bs-target="#modal-${item.id_item}">
                    <i class="bi bi-send"></i> Saiba Mais
                </button>

                <div class="modal fade" id="modal-${item.id_item}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2 class="modal-title fs-5">${item.title}</h2>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>${item.modal_description}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-clear" data-bs-dismiss="modal">Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Monta os cards em pares (2 por linha), igual ao layout original
function renderizarItens(itens) {
    const container = document.getElementById('catalogo-lista');
    let html = '';

    for (let i = 0; i < itens.length; i += 2) {
        const par = itens.slice(i, i + 2);
        html += `<div class="catalogo-container">
            ${par.map(criarCardHTML).join('')}
        </div>`;
    }

    container.innerHTML = html;
}

buscarItens();