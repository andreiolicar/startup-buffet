# Startup Buffet — Documentação do Projeto Web

*Documento contextual do site estático da Startup Buffet, consultoria especializada em criação e implantação de buffets.*

---

## Visão Geral do Projeto

A Startup Buffet é uma consultoria que atende empreendedores que desejam abrir ou estruturar um buffet. O site, hospedado em `buffetstarup.com.br`, é um site estático de página única (one-page) com uma segunda página para apresentação de projetos individuais. Toda a identidade visual é editorial e minimalista — preto, branco e cinza, tipografia sem serifa, fotos em preto e branco — transmitindo credibilidade e profissionalismo ao público-alvo.

O site foi construído sem frameworks JavaScript pesados. A estilização usa Tailwind CSS via CDN, complementado por um arquivo CSS customizado. A interatividade (menu mobile, filtros, animações e formulário) é tratada por um único arquivo JavaScript vanilla.

---

## Estrutura de Seções (index.html)

A página principal é organizada pelas seguintes seções, cada uma com âncora própria para navegação e indexação no sitemap:

- **`#servicos`** — Apresenta o posicionamento da consultoria e os serviços oferecidos.
- **`#como-funciona`** — Explica o método de trabalho em etapas: Conceito, Projetos & Aprovações, Implantação. Possui abas interativas com cards filtráveis por categoria (renderizados via JS).
- **`#tipologias`** — Descreve os tipos de buffet atendidos (infantil, social, corporativo, etc.).
- **`#projetos`** — Galeria de projetos realizados, com link para a página `project.html`.
- **`#time`** — Apresentação da equipe.
- **`#contato`** — Formulário de contato com máscara para telefone brasileiro e modal de confirmação de envio.

---

## Descrição dos Arquivos

### index.html

Página principal e ponto de entrada do site. Contém todo o markup da one-page: header com navegação responsiva (desktop e mobile), hero com imagem editorial em P&B, todas as seções de conteúdo e footer. Inclui metatags completas de SEO (title, description, Open Graph, Twitter Card), dados estruturados em JSON-LD (schema.org/LocalBusiness) e link para o sitemap. As imagens do hero são carregadas como atributo no HTML e estilizadas via CSS com filtro grayscale.

### project.html

Página de detalhe de projeto. Mantém o mesmo header e footer da index, com uma área de conteúdo dedicada para apresentar um projeto específico de forma expandida (galeria, descrição, dados técnicos). Funciona como modelo reutilizável para cada projeto do portfólio.

### styles.css

Complementa o Tailwind com estilos que não podem ser expressos por classes utilitárias. Define: variável CSS `--header-h` (altura do header fixo, usada para offset de scroll e `padding-top` do body); estilos do hero (posicionamento absoluto da imagem, filtro grayscale, overlay com gradiente, efeito grain via SVG inline); animações (reveal on scroll com opacity/translateY, floaty de levitação suave); estilos dos cards de escopo com borda gradiente via pseudo-elemento `::before`; e o modal de sucesso (overlay com backdrop-filter, transições de entrada/saída).

### main.js

Único arquivo JavaScript do projeto, executado após `DOMContentLoaded`. Responsável por: toggle do menu mobile com controle de `aria-expanded`; renderização dinâmica dos cards de escopo via template string e filtragem por abas (conceito, projetos, implantação); scroll suave ao topo ao clicar no logo; `IntersectionObserver` para animações de reveal; máscara de telefone no formato brasileiro `(XX) XXXXX-XXXX`; e controle do modal de confirmação do formulário (abertura, fechamento por clique fora, tecla Escape e botão). A função `handleSubmit` é exposta globalmente para uso no atributo `onsubmit` do form.

### .htaccess

Configuração do servidor Apache. Ativa compressão GZIP para HTML, CSS, JS e JSON. Define cache de longa duração para assets estáticos (imagens: 1 ano; CSS/JS: 1 mês). Traz blocos comentados prontos para ativar: redirecionamento HTTPS e padronização de URL com ou sem www. Adiciona headers de segurança: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` e `Referrer-Policy`. Bloqueia acesso a arquivos ocultos (iniciados com ponto).

### robots.txt

Instrui todos os crawlers a indexar o site completo (`Allow: /`). Declara a URL do sitemap e define `Crawl-delay: 1` para evitar sobrecarga do servidor em varreduras intensas.

### sitemap.xml

Sitemap no padrão sitemaps.org com 7 URLs: a raiz (prioridade `1.0`, `changefreq: weekly`) e as seis âncoras principais da one-page com prioridades entre `0.6` e `0.9`. A seção `#projetos` e `#contato` recebem prioridade `0.9`, refletindo a importância estratégica dessas páginas para conversão. As datas de `lastmod` indicam quando o conteúdo foi atualizado pela última vez.

### logo-startup-buffet.png

Logotipo da marca em PNG, utilizado no header (desktop e mobile) e no footer. Arquivo leve (~1.5 KB), compatível com fundo escuro e claro dada a paleta monocromática do site.

---

## Estratégia de SEO Aplicada

O projeto demonstra cuidado consistente com SEO técnico e on-page. As principais práticas adotadas são:

- **Metatags completas:** title e description otimizados, Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) e Twitter Card para compartilhamento em redes sociais.
- **Dados estruturados JSON-LD** com schema `LocalBusiness`, incluindo nome, URL, descrição e área de atuação — sinalizando relevância local para o Google.
- **Sitemap XML** declarado tanto no `robots.txt` quanto nas metatags, facilitando a descoberta e priorização de rastreamento.
- **URLs canônicas e semântica de âncoras:** cada seção tem ID descritivo, melhorando a rastreabilidade de subpáginas.
- **Performance:** compressão GZIP e cache agressivo via `.htaccess` reduzem tempo de carregamento, fator de ranqueamento direto no Core Web Vitals.
- **Imagens com atributos `alt` descritivos** e tamanhos definidos para evitar layout shift (CLS).
- **Estrutura HTML semântica** com uso correto de heading hierarchy (h1 único por página, h2/h3 para subtítulos).
- **Site responsivo e mobile-first**, requisito essencial para indexação Mobile-First do Google.

---

*buffetstarup.com.br — Documento gerado em fevereiro de 2026*