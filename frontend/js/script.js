const API_URL = 'http://localhost:8080/api';

// Carrega dinamicamente o título/subtítulo do banner de topo de cada página,
// puxando da tabela "main" no banco. Funciona em qualquer página que tenha
// um elemento .page-title com o atributo data-id-main definido, por exemplo:
//
//   <div class="page-title" data-id-main="2">
//     <h1>Catálogo de serviços</h1>
//     <p>Conheça mais nossos procedimentos</p>
//   </div>
//
// id_main de cada página: 1 = Home, 2 = Catálogo, 3 = Contato, 4 = Sobre
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.page-title[data-id-main]');
    if (!banner) return;

    const idMain = banner.getAttribute('data-id-main');

    fetch(`${API_URL}/main/${idMain}`)
        .then(response => response.ok ? response.json() : null)
        .then(data => {
            if (!data) return; // registro ainda não existe no banco — mantém o texto padrão do HTML

            const titulo = banner.querySelector('h1');
            const subtitulo = banner.querySelector('p');

            if (titulo) titulo.textContent = data.title;
            if (subtitulo) subtitulo.textContent = data.subtitle || '';
        })
        .catch(erro => console.error('Erro ao carregar banner da página:', erro));
});

// ============================================================
// MENU HAMBÚRGUER (mobile)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('menu-toggle');
    const menu = document.getElementById('main-menu');
    if (!botao || !menu) return;

    function fecharMenu() {
        menu.classList.remove('open');
        botao.classList.remove('active');
        botao.setAttribute('aria-expanded', 'false');
    }

    function alternarMenu() {
        const abrindo = !menu.classList.contains('open');
        menu.classList.toggle('open', abrindo);
        botao.classList.toggle('active', abrindo);
        botao.setAttribute('aria-expanded', String(abrindo));
    }

    botao.addEventListener('click', alternarMenu);

    // Fecha se clicar fora do menu/botão
    document.addEventListener('click', (evento) => {
        if (!menu.classList.contains('open')) return;
        if (menu.contains(evento.target) || botao.contains(evento.target)) return;
        fecharMenu();
    });

    // Fecha se a tela for redimensionada de volta pro tamanho desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) fecharMenu();
    });
});
