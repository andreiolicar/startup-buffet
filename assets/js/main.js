document.addEventListener('DOMContentLoaded', () => {

    // Header height (mantém os offsets consistentes)
    const getHeaderH = () => {
        const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
        const n = parseInt(String(v).replace('px', '').trim(), 10);
        return Number.isFinite(n) ? n : 112;
    };

    // Mobile menu toggle
    const btn = document.getElementById('mobileBtn');
    const menu = document.getElementById('mobileMenu');
    const iconMenu = document.getElementById('iconMenu');
    const iconClose = document.getElementById('iconClose');

    btn?.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        iconMenu.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Fecha menu mobile ao clicar em um link
    document.querySelectorAll('#mobileMenu a').forEach(a => {
        a.addEventListener('click', () => {
            menu.classList.add('hidden');
            iconMenu.classList.remove('hidden');
            iconClose.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    // Projetos (home): preenche cards com dataset compartilhado
    function renderHomeProjects() {
        const projects = window.STARTUP_PROJECTS || {};
        const cards = Array.from(document.querySelectorAll('#projetos a[href^="project.html?id="]'));
        if (!cards.length || !Object.keys(projects).length) return;

        cards.forEach(card => {
            const href = card.getAttribute('href') || '';
            const idMatch = href.match(/id=(\d{1,2})/);
            const id = (idMatch?.[1] || '').padStart(2, '0');
            const project = projects[id];
            if (!project) return;

            const img = card.querySelector('img');
            if (img) {
                img.src = project.heroImage;
                img.alt = project.heroAlt || project.title;
                img.loading = 'lazy';
            }

            const titleEl = card.querySelector('.imgText .text-sm.font-semibold');
            if (titleEl) titleEl.textContent = project.card?.titleShort || project.title;

            const cityEl = card.querySelector('.imgText .text-xs.opacity-85');
            if (cityEl) cityEl.textContent = project.card?.city || project.location;

            const badgeEl = card.querySelector('.absolute.top-4 .text-xs.font-semibold');
            if (badgeEl) {
                const dot = '<span class="h-2 w-2 rounded-full bg-black/60"></span>';
                const badge = project.card?.tag || project.type;
                badgeEl.innerHTML = `${dot} ${badge}`;
            }
        });
    }
    renderHomeProjects();

    // ESCOPO — grid compacto (clean, sem emojis)
    const scopeGroups = {
        conceito: {
            label: 'Conceito',
            subtitle: 'Decisões e premissas do negócio',
        },
        projetos: {
            label: 'Projetos & aprovações',
            subtitle: 'Documentação + legal para operar',
        },
        implantacao: {
            label: 'Implantação',
            subtitle: 'Obra, compra e montagem',
        }
    };

    const scopeItems = [
        { title: 'Conceitualização da empresa', group: 'conceito', desc: 'Direcionamento do negócio, tipologia, capacidade e premissas do espaço.' },
        { title: 'Planejamento completo', group: 'conceito', desc: 'Layout base, fluxos, infraestrutura e necessidades para operar.' },
        { title: 'Tipologia, capacidade e viabilidade', group: 'conceito', desc: 'Regras do formato e escolhas para investir com mais segurança.' },

        { title: 'Projeto de arquitetura', group: 'projetos', desc: 'Arquitetura e interiores como base para os complementares.' },
        { title: 'Aprovação legal e alvarás', group: 'projetos', desc: 'Documentação e suporte até as liberações necessárias.' },
        { title: 'Vigilância sanitária (quando aplicável)', group: 'projetos', desc: 'Acompanhamento do processo sanitário e adequações.' },

        { title: 'Gerenciamento de obra', group: 'implantacao', desc: 'Cronograma, acompanhamento e controle de execução.' },
        { title: 'Equipamentos e cozinha', group: 'implantacao', desc: 'Lista técnica e apoio para compra e instalação.' },
        { title: 'Montagem do layout e enxoval', group: 'implantacao', desc: 'Curadoria e suporte na montagem final da operação.' },
    ];

    const scopeGridEl = document.getElementById('scopeGrid');
    const scopeTabs = Array.from(document.querySelectorAll('.scopeTab'));

    const tabStyles = {
        active: 'bg-black text-white shadow-sm',
        idle: 'bg-white text-black/70 hover:bg-black/5'
    };

    function setActiveTab(value) {
        scopeTabs.forEach(btn => {
            const isActive = btn.dataset.scopeTab === value;
            btn.classList.remove(...tabStyles.active.split(' '), ...tabStyles.idle.split(' '));
            btn.classList.add(...(isActive ? tabStyles.active.split(' ') : tabStyles.idle.split(' ')));
            btn.setAttribute('aria-selected', String(isActive));
        });
    }

    function toShort(text, max = 86) {
        if (!text) return '';
        const t = String(text).trim();
        return t.length > max ? (t.slice(0, max - 1) + '…') : t;
    }

    function renderScope(value = 'all') {
        const visible = value === 'all' ? scopeItems : scopeItems.filter(i => i.group === value);

        scopeGridEl.innerHTML = visible.map(it => {
            const meta = scopeGroups[it.group];
            return `
<div class="scopeCard group relative rounded-2xl bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
     data-group="${it.group}">
    <div class="flex items-start justify-between gap-3">
        <div>
            <div class="text-xs font-semibold tracking-widest text-black/45 uppercase">${meta.label}</div>
            <div class="mt-1 text-sm font-extrabold tracking-tight text-black/90">${it.title}</div>
            <div class="mt-1 text-xs leading-relaxed text-black/60">
                ${toShort(it.desc)}
            </div>
        </div>
<div class="h-9 w-9 shrink-0 rounded-xl border border-black/10 bg-[#FAFAFA] flex items-center justify-center text-black/40 group-hover:text-black/70 transition">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="12" x2="20" y2="12"></line>
        <polyline points="14 6 20 12 14 18"></polyline>
    </svg>
</div>
    </div>
</div>`;
        }).join('');
    }

    // init tabs
    if (scopeGridEl && scopeTabs.length) {
        setActiveTab('all');
        renderScope('all');

        scopeTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.scopeTab;
                setActiveTab(value);
                renderScope(value);
            });
        });
    }

    // Logo: sempre volta ao topo real (mantém a faixa branca acima do header)
    document.querySelectorAll('.js-scrollTop').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    // Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Form: modal de sucesso
    const modal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm?.querySelector('button[type="submit"], button');
    const defaultSubmitLabel = submitBtn?.textContent || 'Enviar';
    let lastFocused = null;
    const previousBodyPaddingRight = document.body.style.paddingRight;

    function lockPageScroll() {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
    }

    function unlockPageScroll() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = previousBodyPaddingRight;
    }

    function openModal() {
        if (!modal) return;
        lastFocused = document.activeElement;
        modal.classList.remove('modalHidden');
        requestAnimationFrame(() => modal.classList.add('is-open'));
        lockPageScroll();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        // Restaura o scroll imediatamente para evitar atraso visual.
        unlockPageScroll();
        setTimeout(() => {
            modal.classList.add('modalHidden');
            if (lastFocused && typeof lastFocused.focus === 'function') {
                lastFocused.focus();
            }
        }, 220);
    }

    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('modalHidden')) closeModal();
    });

    function setSubmitState(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Enviando...' : defaultSubmitLabel;
        submitBtn.classList.toggle('opacity-80', isLoading);
        submitBtn.classList.toggle('cursor-not-allowed', isLoading);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        const payload = {
            nome: String(data.get('nome') || '').trim(),
            telefone: String(data.get('telefone') || '').trim(),
            email: String(data.get('email') || '').trim(),
            mensagem: String(data.get('mensagem') || '').trim(),
        };

        if (!payload.nome || !payload.telefone || !payload.email || !payload.mensagem) {
            alert('Preencha todos os campos obrigatórios antes de enviar.');
            return false;
        }

        try {
            setSubmitState(true);
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Falha ao enviar (${response.status})`);
            }

            form.reset();
            if (phoneEl) phoneEl.value = '';
            openModal();
        } catch (error) {
            console.error(error);
            alert('Não foi possível enviar agora. Tente novamente em instantes.');
        } finally {
            setSubmitState(false);
        }

        return false;
    }

    // Máscara BR para telefone/WhatsApp: (11) 99999-9999 / (11) 9999-9999
    const maskBRPhone = (value) => {
        const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 10) {
            // (11) 9999-9999
            return digits
                .replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (m, a, b, c) => {
                    const p1 = a ? `(${a}` + (a.length === 2 ? ') ' : '') : '';
                    const p2 = b || '';
                    const p3 = c ? `-${c}` : '';
                    return (p1 + p2 + p3).trim();
                })
                .replace(/\s-/, '-');
        }
        // (11) 99999-9999
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const phoneEl = document.getElementById('phoneInput');
    if (phoneEl) {
        // aplica mask em load (caso exista value)
        phoneEl.value = maskBRPhone(phoneEl.value);
        phoneEl.addEventListener('input', (e) => {
            const start = e.target.selectionStart;
            e.target.value = maskBRPhone(e.target.value);
            // tentativa de manter cursor no final (boa o suficiente aqui)
            e.target.setSelectionRange(e.target.value.length, e.target.value.length);
        });
    }

    // Expondo handleSubmit para o escopo global (usado no form onsubmit)
    window.handleSubmit = handleSubmit;
});
