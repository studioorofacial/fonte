// Carrega História, Princípios, Equipe e Diferenciais da página Sobre a
// partir da API. API_URL já vem declarada globalmente pelo js/script.js
// (carregado antes deste arquivo). Se a API não retornar nada (ou falhar),
// o HTML estático que já está na página continua sendo mostrado.

// ============================================================
// HISTÓRIA
// ============================================================
async function carregarHistoriaPublico() {
    try {
        const response = await fetch(`${API_URL}/history`);
        const itens = await response.json();
        renderizarHistoriaPublico(itens);
    } catch (erro) {
        console.error('Erro ao carregar história:', erro);
    }
}

function renderizarHistoriaPublico(itens) {
    const container = document.getElementById('sobre-historia-conteudo');
    if (!container || itens.length === 0) return;

    container.innerHTML = itens.map(item => {
        // O texto é salvo com quebras de linha separando parágrafos
        const paragrafos = String(item.text || '')
            .split(/\n+/)
            .map(p => p.trim())
            .filter(Boolean)
            .map(p => `<p>${p}</p>`)
            .join('');

        const imagemHtml = item.image
            ? `<div class="sobre-img-container"><img src="${item.image}" alt="${item.title || 'Imagem da história'}" class="sobre-imagem"></div>`
            : '';

        return paragrafos + imagemHtml;
    }).join('<hr style="margin:24px 0;opacity:.2">');
}

// ============================================================
// PRINCÍPIOS (Missão / Visão / Valores)
// ============================================================
async function carregarPrincipiosPublico() {
    try {
        const response = await fetch(`${API_URL}/principles`);
        const itens = await response.json();
        renderizarPrincipiosPublico(itens);
    } catch (erro) {
        console.error('Erro ao carregar princípios:', erro);
    }
}

function renderizarPrincipiosPublico(itens) {
    const container = document.getElementById('mvv-grid');
    if (!container || itens.length === 0) return;

    container.innerHTML = itens.map(item => `
        <div class="mvv-item">
            <div class="mvv-icon">
                <i class="${item.icon || 'bi bi-star'}"></i>
            </div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        </div>
    `).join('');
}

// ============================================================
// EQUIPE
// ============================================================
async function carregarEquipePublico() {
    try {
        const response = await fetch(`${API_URL}/team`);
        const itens = await response.json();
        renderizarEquipePublico(itens);
    } catch (erro) {
        console.error('Erro ao carregar equipe:', erro);
    }
}

function renderizarEquipePublico(itens) {
    const container = document.getElementById('equipe-grid');
    if (!container || itens.length === 0) return;

    container.innerHTML = itens.map(item => {
        const img = (item.image || '').trim();
        // O campo "image" pode guardar uma classe de ícone Bootstrap
        // (ex: "bi bi-person-circle") ou um caminho/URL de foto de verdade
        const ehIcone = img.startsWith('bi ') || img.startsWith('bi-');
        const imagemHtml = ehIcone
            ? `<i class="${img || 'bi bi-person-circle'}"></i>`
            : (img ? `<img src="${img}" alt="${item.specialist}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : `<i class="bi bi-person-circle"></i>`);

        return `
            <div class="equipe-item">
                <div class="equipe-img">${imagemHtml}</div>
                <h3>${item.specialist}</h3>
                <p class="equipe-cargo">${item.university || ''}</p>
                <p class="equipe-desc">${item.education || ''}</p>
            </div>
        `;
    }).join('');
}

// ============================================================
// DIFERENCIAIS
// ============================================================
async function carregarDiferenciaisPublico() {
    try {
        const response = await fetch(`${API_URL}/differentials`);
        const itens = await response.json();
        renderizarDiferenciaisPublico(itens);
    } catch (erro) {
        console.error('Erro ao carregar diferenciais:', erro);
    }
}

function renderizarDiferenciaisPublico(itens) {
    const container = document.getElementById('diferenciais-list');
    if (!container || itens.length === 0) return;

    container.innerHTML = itens.map(item => `
        <div class="diferencial-item">
            <i class="bi bi-check-circle"></i>
            <span>${item.description}</span>
        </div>
    `).join('');
}

carregarHistoriaPublico();
carregarPrincipiosPublico();
carregarEquipePublico();
carregarDiferenciaisPublico();
