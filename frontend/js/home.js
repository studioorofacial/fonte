// Carrega o carousel e os blocos de texto/imagem da Home a partir da API.
// API_URL já vem declarada globalmente pelo js/script.js (carregado antes deste arquivo).
// Se a API não retornar nada (ou falhar), o HTML estático que já está na
// página continua sendo mostrado — não fica em branco.

async function carregarCarouselHome() {
    try {
        const response = await fetch(`${API_URL}/carousel`);
        const slides = await response.json();
        renderizarCarouselHome(slides);
    } catch (erro) {
        console.error('Erro ao carregar carousel da home:', erro);
    }
}

function renderizarCarouselHome(slides) {
    const indicadores = document.getElementById('carousel-indicators');
    const slidesContainer = document.getElementById('carousel-inner');

    if (!indicadores || !slidesContainer || slides.length === 0) return;

    indicadores.innerHTML = slides.map((slide, i) => `
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${i}"
            ${i === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${i + 1}"></button>
    `).join('');

    slidesContainer.innerHTML = slides.map((slide, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <img src="${slide.background_image}" class="d-block w-100" alt="${slide.title}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${slide.title}</h5>
                <p>${slide.description || ''}</p>
            </div>
        </div>
    `).join('');
}

async function carregarHomeInfoPublico() {
    try {
        const response = await fetch(`${API_URL}/home-info`);
        const itens = await response.json();
        renderizarHomeInfoPublico(itens);
    } catch (erro) {
        console.error('Erro ao carregar informações da home:', erro);
    }
}

function renderizarHomeInfoPublico(itens) {
    const container = document.getElementById('home-info-lista');
    if (!container || itens.length === 0) return;

    // Alterna o lado do texto/imagem a cada registro, igual ao layout original
    container.innerHTML = itens.map((item, i) => {
        const textoHtml = `<div class="homebox-text"><p>${item.text}</p></div>`;
        const imagemHtml = `<div class="homebox-img"><img src="${item.image}" alt="Imagem ilustrativa do Studio Orofacial" width="400px"></div>`;
        const conteudo = (i % 2 === 0) ? (textoHtml + imagemHtml) : (imagemHtml + textoHtml);

        return `<div class="home-container"><section class="homebox">${conteudo}</section></div>`;
    }).join('');
}

carregarCarouselHome();
carregarHomeInfoPublico();
