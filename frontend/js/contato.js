// Conecta o formulário de contato (#contactForm) à API.
// API_URL já vem declarada globalmente pelo js/script.js (carregado antes deste arquivo).

// ============================================================
// INFO DE CONTATO (telefone, whatsapp, horário) — vem da API
// ============================================================
async function carregarInfoContatoPublico() {
    try {
        const response = await fetch(`${API_URL}/info`);
        if (!response.ok) return; // mantém o texto estático do HTML como fallback

        const lista = await response.json();
        if (lista.length === 0) return; // nenhum registro ainda — mantém o fallback

        const data = lista[0];

        const telefoneEl = document.getElementById('info-telefone');
        const whatsappEl = document.getElementById('info-whatsapp');
        const atendimentoEl = document.getElementById('info-atendimento');

        if (telefoneEl && data.phone) telefoneEl.textContent = data.phone;
        if (whatsappEl && data.whatsapp) whatsappEl.textContent = data.whatsapp;
        if (atendimentoEl && data.service_text) atendimentoEl.textContent = data.service_text;
    } catch (erro) {
        console.error('Erro ao carregar informações de contato:', erro);
    }
}

carregarInfoContatoPublico();

// ============================================================
// LOCALIZAÇÃO (mapa + endereço) — vem da API
// ============================================================
async function carregarLocalizacaoPublico() {
    try {
        const response = await fetch(`${API_URL}/location`);
        if (!response.ok) return; // mantém o mapa/endereço estático como fallback

        const lista = await response.json();
        if (lista.length === 0) return; // nenhum registro ainda — mantém o fallback

        const data = lista[0];

        const iframeEl = document.getElementById('map-frame-iframe');
        if (iframeEl && data.maps_url) {
            iframeEl.src = data.maps_url;
        }

        const linhas = String(data.address || '').split('\n');
        const linha1El = document.getElementById('endereco-linha1');
        const linha2El = document.getElementById('endereco-linha2');
        const linha3El = document.getElementById('endereco-linha3');

        if (linha1El && linhas[0]) linha1El.textContent = linhas[0];
        if (linha2El && linhas[1]) linha2El.textContent = linhas[1];
        if (linha3El && linhas[2]) linha3El.textContent = linhas[2];
    } catch (erro) {
        console.error('Erro ao carregar localização:', erro);
    }
}

carregarLocalizacaoPublico();

function limparFormulario() {
    document.getElementById('contactForm').reset();
}

function mostrarMensagemContato(texto, tipo) {
    let caixa = document.getElementById('contato-feedback');

    if (!caixa) {
        caixa = document.createElement('div');
        caixa.id = 'contato-feedback';
        caixa.style.marginTop = '15px';
        caixa.style.padding = '12px 16px';
        caixa.style.borderRadius = '8px';
        caixa.style.fontSize = '14px';
        document.getElementById('contactForm').insertAdjacentElement('afterend', caixa);
    }

    const cores = {
        sucesso: { bg: '#d1e7dd', texto: '#0f5132' },
        erro: { bg: '#f8d7da', texto: '#842029' }
    };

    caixa.style.backgroundColor = cores[tipo].bg;
    caixa.style.color = cores[tipo].texto;
    caixa.textContent = texto;
    caixa.style.display = 'block';
}

document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    const botaoEnviar = event.target.querySelector('.btn-submit');
    const textoOriginalBotao = botaoEnviar.innerHTML;
    botaoEnviar.disabled = true;
    botaoEnviar.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';

    try {
        const response = await fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nome, email: email, message: mensagem })
        });

        if (!response.ok) throw new Error('Falha ao enviar mensagem');

        mostrarMensagemContato('Mensagem enviada com sucesso! Em breve entraremos em contato.', 'sucesso');
        limparFormulario();
    } catch (erro) {
        console.error('Erro ao enviar mensagem de contato:', erro);
        mostrarMensagemContato('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.', 'erro');
    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = textoOriginalBotao;
    }
});
