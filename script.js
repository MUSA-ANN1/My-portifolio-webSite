/* ============================================
   Musa Annagulyýew — Portfolio Scripts
   Fire particles · Dynamic projects · Modal
   Carousel · Scroll reveal · Auto-calc
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'en';
    let projectsData = [];
    let certsData = [];

    // ============================================
    // AUTO-CALCULATE AGE & EXPERIENCE
    // ============================================
    const BIRTHDAY = new Date(2010, 9, 5); // Oct 5, 2010
    const CODING_START = new Date(2022, 8, 1); // Sep 2022

    function calcYears(from) {
        const now = new Date();
        let years = now.getFullYear() - from.getFullYear();
        const m = now.getMonth() - from.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < from.getDate())) years--;
        return years;
    }

    const age = calcYears(BIRTHDAY);
    const exp = calcYears(CODING_START);

    // Initial setup for the IDs used elsewhere (if any)
    const setTextById = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setTextById('auto-age', age);
    setTextById('auto-exp', exp);
    // Hardcoded years removed here - now handled by updateLanguage i18n

    // ============================================
    // FIRE PARTICLE CANVAS (bright → dark)
    // ============================================
    const canvas = document.getElementById('fire-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        const hero = document.getElementById('hero');
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bright to dark flame colors
    const brightColors = [
        [255, 221, 51],   // #ffdd33
        [255, 170, 0],    // #ffaa00
        [255, 136, 0],    // #ff8800
        [255, 69, 0],     // #ff4500
    ];
    const darkColors = [
        [196, 30, 58],    // #c41e3a
        [139, 0, 0],      // #8b0000
        [80, 10, 10],     // #500a0a
    ];

    function lerpColor(bright, dark, t) {
        const bi = Math.floor(Math.random() * bright.length);
        const di = Math.floor(Math.random() * dark.length);
        const r = Math.round(bright[bi][0] + (dark[di][0] - bright[bi][0]) * t);
        const g = Math.round(bright[bi][1] + (dark[di][1] - bright[bi][1]) * t);
        const b = Math.round(bright[bi][2] + (dark[di][2] - bright[bi][2]) * t);
        return [r, g, b];
    }

    class FireParticle {
        constructor(stagger) {
            this.reset(stagger);
            // Store initial color indices for consistent interpolation
            this.brightIdx = Math.floor(Math.random() * brightColors.length);
            this.darkIdx = Math.floor(Math.random() * darkColors.length);
        }

        reset(stagger) {
            this.x = Math.random() * canvas.width;
            this.y = stagger ? Math.random() * canvas.height : canvas.height + Math.random() * 20;
            this.radius = Math.random() * 2 + 1;
            this.speed = Math.random() * 1.2 + 0.4;
            this.drift = (Math.random() - 0.5) * 1;
            this.opacity = 0.8;
            this.startY = canvas.height;
            this.brightIdx = Math.floor(Math.random() * brightColors.length);
            this.darkIdx = Math.floor(Math.random() * darkColors.length);
        }

        update() {
            this.y -= this.speed;
            this.x += this.drift * 0.5;
            const traveled = Math.max(0, (this.startY - this.y) / canvas.height);
            this.opacity = Math.max(0, 0.8 - traveled * 0.9);

            // Interpolate bright → dark
            const b = brightColors[this.brightIdx];
            const d = darkColors[this.darkIdx];
            const t = Math.min(1, traveled * 1.5);
            this.r = Math.round(b[0] + (d[0] - b[0]) * t);
            this.g = Math.round(b[1] + (d[1] - b[1]) * t);
            this.b = Math.round(b[2] + (d[2] - b[2]) * t);

            if (this.opacity <= 0 || this.y < 0) this.reset(false);
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new FireParticle(true));

    function animFire() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animFire);
    }
    animFire();

    // ============================================
    // HAMBURGER MENU
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const hamburger2 = document.getElementById('hamburger-2');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMenu(e) {
        if (e) e.stopPropagation();
        const isActive = mobileMenu.classList.toggle('active');
        if (hamburger) hamburger.classList.toggle('active', isActive);
        if (hamburger2) hamburger2.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (hamburger2) hamburger2.addEventListener('click', toggleMenu);

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            if (hamburger2) hamburger2.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // SCROLL REVEAL (enter + exit)
    // ============================================
    const revealTargets = document.querySelectorAll(
        '.section-label, .section-title, .about-text, .stats-card, ' +
        '.exp-card, .skill-category, .timeline-item, .contact-btn, ' +
        '.contact-desc, .edu-card, .hero-left, .hero-right'
    );
    revealTargets.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));

    // Stagger groups
    const staggerGroups = [
        document.querySelectorAll('.exp-card'),
        document.querySelectorAll('.skill-category'),
        document.querySelectorAll('.timeline-item'),
        document.querySelectorAll('.contact-btn'),
        document.querySelectorAll('.edu-card'),
    ];
    staggerGroups.forEach(group => {
        group.forEach((el, i) => { el.style.transitionDelay = (i * 100) + 'ms'; });
    });

    // ============================================
    // SMOOTH SCROLL (Links & Fixed 0.5s Duration)
    // ============================================

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);
            autoScrollTarget = run; // sync wheel scroll target

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                window.scrollTo(0, targetPosition);
                autoScrollTarget = targetPosition;
            }
        }
        requestAnimationFrame(animation);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                // If hamburger menu is open, close it before scrolling
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    if (hamburger2) hamburger2.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // -60px to account for the sticky navbar height
                const targetY = target.getBoundingClientRect().top + window.scrollY - 60;
                smoothScrollTo(targetY, 500); // exactly 500ms
            }
        });
    });

    // Custom Momentum Scrolling for Mousewheel
    let isScrolling = false;
    let autoScrollTarget = window.scrollY;

    window.addEventListener('wheel', (e) => {
        // Only apply if modal isn't open
        if (document.body.style.overflow === 'hidden') return;

        e.preventDefault();
        // Speed multiplier for the scroll impulse
        const currentY = window.scrollY;

        if (!isScrolling) {
            autoScrollTarget = currentY;
        }

        // Add delta to our target scroll position
        autoScrollTarget += e.deltaY * 0.8;
        // Clamp it to the document bounds
        autoScrollTarget = Math.max(0, Math.min(autoScrollTarget, document.body.scrollHeight - window.innerHeight));

        if (!isScrolling) {
            isScrolling = true;
            smoothWheelScroll();
        }
    }, { passive: false });

    function smoothWheelScroll() {
        // Linear interpolation step
        const currentY = window.scrollY;
        const diff = autoScrollTarget - currentY;

        // If we are close enough, snap and stop animation
        if (Math.abs(diff) < 1) {
            window.scrollTo(0, autoScrollTarget);
            isScrolling = false;
            return;
        }

        // Move 10% toward the target each frame (easing factor)
        window.scrollBy(0, diff * 0.07);
        requestAnimationFrame(smoothWheelScroll);
    }

    // ============================================
    // ACTIVE NAV LINK on SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
        });
    });

    // ============================================
    // DYNAMIC PROJECT LOADING FROM FOLDERS
    // ============================================
    const projectsGrid = document.getElementById('projects-grid');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    // SVG icons
    const githubSVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
    const playSVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.176 12l2.522-2.492zM5.864 2.658L16.8 9.49l-2.302 2.302L5.864 2.658z"/></svg>';
    const downloadSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    async function fetchText(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            return (await res.text()).trim();
        } catch { return null; }
    }

    async function checkImage(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async function getScreenshots(folder) {
        const shots = [];
        for (let i = 1; i <= 20; i++) {
            const url = `./${folder}/screen_shot${i}.jpg`;
            const url_png = `./${folder}/screen_shot${i}.png`;
            if (await checkImage(url) || await checkImage(url_png)) {
                if (await checkImage(url)) shots.push(url);
                else shots.push(url_png);
            }
            else break;
        }
        return shots;
    }

    function parseLinks(raw) {
        const result = { isDev: false, github: null, playMarket: null, googleDrive: null };
        if (!raw) return result;
        const lines = raw.split('\n').map(l => l.trim().replace(/,$/, ''));
        for (const line of lines) {
            if (line === 'dev') result.isDev = true;
            else if (line.startsWith('github:')) result.github = line.replace('github:', '').trim();
            else if (line.startsWith('play market:')) result.playMarket = line.replace('play market:', '').trim();
            else if (line.startsWith('google drive:')) result.googleDrive = line.replace('google drive:', '').trim();
        }
        return result;
    }

    const SVG_LEFT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
    const SVG_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;

    function createCarousel(images, containerId) {
        if (!images.length) return '';
        if (images.length === 1) {
            return `<div class="card-carousel"><img src="${images[0]}" alt="screenshot" style="width:100%;height:100%;object-fit:cover;border-radius:12px 12px 0 0;"></div>`;
        }
        const dots = images.map((_, i) => `<div class="carousel-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></div>`).join('');
        const imgs = images.map(src => `<img src="${src}" alt="screenshot" draggable="false">`).join('');
        return `<div class="card-carousel" data-carousel="${containerId}">
            <div class="carousel-track">${imgs}</div>
            <button class="carousel-btn prev" aria-label="Previous">${SVG_LEFT}</button>
            <button class="carousel-btn next" aria-label="Next">${SVG_RIGHT}</button>
            <div class="carousel-dots">${dots}</div>
        </div>`;
    }

    // Interactivity for carousels (Swipe/Drag/Buttons)
    function setupInteractiveCarousel(container, imagesCount) {
        if (imagesCount <= 1) return;

        const track = container.querySelector('.carousel-track');
        const dots = container.querySelectorAll('.carousel-dot');
        const prevBtn = container.querySelector('.carousel-btn.prev');
        const nextBtn = container.querySelector('.carousel-btn.next');

        let idx = 0;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let autoplayInterval = null;

        function goTo(newIdx) {
            if (newIdx < 0) newIdx = imagesCount - 1;
            if (newIdx >= imagesCount) newIdx = 0;
            idx = newIdx;
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
            resetAutoplay();
        }

        function playNext() { goTo(idx + 1); }
        function playPrev() { goTo(idx - 1); }

        function startAutoplay() {
            autoplayInterval = setInterval(playNext, 4000);
            if (container.id === 'modal-carousel') window._modalInterval = autoplayInterval;
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); playPrev(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); playNext(); });

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            stopAutoplay();
            track.style.transition = 'none';
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            track.style.transform = `translateX(calc(-${idx * 100}% - ${diff}px))`;
        }, { passive: true });

        container.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - currentX;
            if (Math.abs(diff) > 40) diff > 0 ? playNext() : playPrev();
            else goTo(idx);
        });

        container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            currentX = startX;
            isDragging = true;
            stopAutoplay();
            track.style.transition = 'none';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            const diff = startX - currentX;
            track.style.transform = `translateX(calc(-${idx * 100}% - ${diff}px))`;
        });

        container.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - currentX;
            if (Math.abs(diff) > 40) diff > 0 ? playNext() : playPrev();
            else goTo(idx);
        });

        container.addEventListener('mouseleave', () => {
            if (!isDragging) return;
            isDragging = false;
            goTo(idx);
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(i);
            });
        });

        startAutoplay();
    }

    function setupAllCarousels() {
        document.querySelectorAll('.card-carousel[data-carousel]').forEach(carousel => {
            const dots = carousel.querySelectorAll('.carousel-dot');
            setupInteractiveCarousel(carousel, dots.length);
        });
    }

    function renderProjects() {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        projectsData.forEach((p, idx) => {
            const langData = p.translations[currentLang] || {};
            const name = langData.name || p.name;
            const shortDesc = langData.short || p.shortDesc;

            const card = document.createElement('div');
            card.className = 'project-card fade-up visible';
            card.style.transitionDelay = (idx * 100) + 'ms';

            let screenshotHTML;
            if (p.screenshots.length) {
                screenshotHTML = createCarousel(p.screenshots, 'proj-' + idx);
            } else {
                const logoInner = p.logoUrl
                    ? `<img src="${p.logoUrl}" alt="${name}" style="width:64px;height:64px;border-radius:12px;object-fit:contain;">`
                    : `<div class="card-logo-fallback">${(name[0] || '?')}</div>`;
                screenshotHTML = `<div class="card-placeholder">${logoInner}</div>`;
            }

            let badgeHTML = '';
            if (p.links.isDev) badgeHTML = `<span class="project-badge badge-orange">${translations[currentLang].pro_in_dev}</span>`;
            else if (p.downloads) badgeHTML = `<span class="project-badge badge-crimson">${p.downloads} ${translations[currentLang].pro_users}</span>`;

            let linksHTML = '';
            if (p.links.github) linksHTML += `<a href="${p.links.github}" target="_blank" onclick="event.stopPropagation()" aria-label="GitHub">${githubSVG}</a>`;
            if (p.links.playMarket) linksHTML += `<a href="${p.links.playMarket}" target="_blank" onclick="event.stopPropagation()" aria-label="Play Store">${playSVG}</a>`;
            if (p.links.googleDrive) linksHTML += `<a href="${p.links.googleDrive}" target="_blank" onclick="event.stopPropagation()" aria-label="Download">${downloadSVG}</a>`;

            const logoBody = p.logoUrl
                ? `<img class="card-logo" src="${p.logoUrl}" alt="${name}">`
                : `<div class="card-logo-fallback">${name[0] || '?'}</div>`;

            card.innerHTML = `
                ${screenshotHTML}
                <div class="card-body">
                    <div class="card-top-row">
                        ${logoBody}
                        <div class="card-links">${badgeHTML}${linksHTML}</div>
                    </div>
                    <h3 class="card-name">${name}</h3>
                    <p class="card-desc">${shortDesc}</p>
                    <div class="card-tags">${p.techs.map(t => `<span>${t}</span>`).join('')}</div>
                </div>
            `;
            card.addEventListener('click', (e) => {
                if (e.target.closest('.card-carousel') || e.target.closest('.card-placeholder')) return;
                openModal(p);
            });
            projectsGrid.appendChild(card);
        });
        setupAllCarousels();
    }

    async function loadProjects() {
        const listText = await fetchText('./projects.txt');
        if (!listText) {
            if (projectsGrid) projectsGrid.innerHTML = '<p style="color:#a0a0a0; grid-column: 1/-1;">Projects could not load.</p>';
            return;
        }

        const folders = listText.split('\n').map(f => f.trim()).filter(Boolean);
        projectsData = [];

        for (const folder of folders) {
            const [name, shortDesc, fullDesc, techs, linksRaw, downloads] = await Promise.all([
                fetchText(`./${folder}/name.txt`),
                fetchText(`./${folder}/short%20descryption.txt`),
                fetchText(`./${folder}/full%20descyption.txt`),
                fetchText(`./${folder}/used%20techs.txt`),
                fetchText(`./${folder}/links.txt`),
                fetchText(`./${folder}/downloads.txt`),
            ]);

            const folderTranslations = {};
            for (const l of ['tk', 'ru', 'ja']) {
                const [lName, lShort, lFull] = await Promise.all([
                    fetchText(`./${folder}/name_${l}.txt`),
                    fetchText(`./${folder}/short%20descryption_${l}.txt`),
                    fetchText(`./${folder}/full%20descyption_${l}.txt`),
                ]);
                if (lName || lShort || lFull) folderTranslations[l] = { name: lName, short: lShort, full: lFull };
            }

            const logoExists = await checkImage(`./${folder}/logo.jpg`);
            const screenshots = await getScreenshots(folder);
            const links = parseLinks(linksRaw);

            projectsData.push({
                folder, name: name || folder,
                shortDesc: shortDesc || '',
                fullDesc: fullDesc || shortDesc || '',
                techs: techs ? techs.split(',').map(t => t.trim()) : [],
                links, downloads, screenshots,
                logoUrl: logoExists ? `./${folder}/logo.jpg` : null,
                translations: folderTranslations
            });
        }

        projectsData.sort((a, b) => (b.links.isDev ? 1 : 0) - (a.links.isDev ? 1 : 0));
        renderProjects();
    }

    // ============================================
    // PROJECT MODAL
    // ============================================
    function openModal(project) {
        const langData = project.translations[currentLang] || {};
        const name = langData.name || project.name;
        const fullDesc = langData.full || project.fullDesc;
        const { techs, links, downloads, screenshots, logoUrl } = project;

        // Title
        document.getElementById('modal-title').textContent = name;

        // Carousel
        const mc = document.getElementById('modal-carousel');
        mc.style.height = ''; // Reset height to CSS default (250px)
        mc.style.background = ''; // Reset background to CSS default (#0d0d0d)

        if (screenshots.length) {
            const imgs = screenshots.map(s => `<img src="${s}" alt="screenshot" draggable="false">`).join('');
            const dots = screenshots.map((_, i) => `<div class="carousel-dot${i === 0 ? ' active' : ''}" data-midx="${i}"></div>`).join('');

            let btns = '';
            if (screenshots.length > 1) {
                btns = `<button class="carousel-btn prev" aria-label="Previous">${SVG_LEFT}</button><button class="carousel-btn next" aria-label="Next">${SVG_RIGHT}</button>`;
            }

            // Set elements
            mc.innerHTML = `<div class="carousel-track">${imgs}</div>${btns}<div class="carousel-dots">${dots}</div>`;
            mc.style.display = '';

            if (screenshots.length > 1) {
                setupInteractiveCarousel(mc, screenshots.length);
            }
        } else {
            mc.style.display = 'none';
        }

        // Badges
        const badgesEl = document.getElementById('modal-badges');
        let badges = '';
        if (links.isDev) badges += `<span class="project-badge badge-orange">${translations[currentLang].pro_in_dev}</span>`;
        if (downloads) badges += `<span class="project-badge badge-crimson">${downloads} ${translations[currentLang].pro_users}</span>`;
        badgesEl.innerHTML = badges;

        // Description
        document.getElementById('modal-desc').textContent = fullDesc;

        // Techs
        document.getElementById('modal-techs').innerHTML = techs.map(t => `<span>${t}</span>`).join('');

        // Actions
        let actionsHTML = '';
        if (links.github) actionsHTML += `<a href="${links.github}" target="_blank" class="ma-outline">${githubSVG} GitHub</a>`;
        if (links.playMarket) actionsHTML += `<a href="${links.playMarket}" target="_blank" class="ma-primary">${playSVG} Play Store</a>`;
        if (links.googleDrive) actionsHTML += `<a href="${links.googleDrive}" target="_blank" class="ma-download">${downloadSVG} Download APK</a>`;
        document.getElementById('modal-actions').innerHTML = actionsHTML;

        // Prevent Scrollbar Jump
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;

        // Show
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ============================================
    // CERTIFICATES MODAL
    // ============================================
    function openCertModal(cert) {
        const langData = cert.translations[currentLang] || {};
        const name = langData.name || cert.name;
        const desc = langData.desc || cert.desc;

        document.getElementById('modal-title').textContent = name;
        document.getElementById('modal-desc').textContent = desc;

        // Hide unused project fields
        document.getElementById('modal-badges').innerHTML = '';
        document.getElementById('modal-techs').innerHTML = '';
        document.getElementById('modal-actions').innerHTML = '';

        // Carousel just for one photo tightly wrapped
        const mc = document.getElementById('modal-carousel');
        if (cert.photoUrl) {
            mc.innerHTML = `<img src="${cert.photoUrl}" alt="${cert.name}" style="width:100%;height:auto;max-height:60vh;object-fit:contain;border-radius:12px;display:block;">`;
            mc.style.display = '';
            mc.style.height = 'auto'; // Let the image dictate the exact size
            mc.style.background = 'transparent'; // Remove letterbox background
        } else {
            mc.style.display = 'none';
        }

        // Prevent Scrollbar Jump
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.style.paddingRight = '';

        if (window._modalInterval) { clearInterval(window._modalInterval); window._modalInterval = null; }
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ============================================
    // LOAD PROJECTS
    // ============================================
    loadProjects();

    // ============================================
    // LOAD CERTIFICATES
    // ============================================
    function renderCertificates() {
        const certsGrid = document.getElementById('certificates-grid');
        if (!certsGrid) return;
        certsGrid.innerHTML = '';

        const isMobile = window.innerWidth <= 768;
        const visibleLimit = isMobile ? 5 : 10;

        certsData.forEach((c, idx) => {
            const langData = c.translations[currentLang] || {};
            const name = langData.name || c.name;

            const card = document.createElement('div');
            card.className = 'cert-card fade-up visible';
            if (idx >= visibleLimit) card.classList.add('hidden', 'overflow-cert');

            const imgHtml = c.photoUrl
                ? `<img src="${c.photoUrl}" alt="${name}" class="cert-img">`
                : `<div class="cert-img" style="display:flex;align-items:center;justify-content:center;color:#555;">No Photo</div>`;

            card.innerHTML = `
                ${imgHtml}
                <div class="cert-info">
                    <h3 class="cert-title">${name}</h3>
                </div>
            `;
            card.addEventListener('click', (e) => {
                if (e.target.closest('.cert-img')) return;
                openCertModal(c);
            });
            certsGrid.appendChild(card);
        });

        const btnSeeAll = document.getElementById('btn-see-all-certs');
        if (btnSeeAll) {
            if (certsData.length <= visibleLimit) {
                btnSeeAll.style.display = 'none';
            } else {
                btnSeeAll.style.display = '';
                btnSeeAll.setAttribute('data-expanded', 'false');
                btnSeeAll.innerHTML = `${translations[currentLang].btn_see_all_certs} <svg viewBox="0 0 24 24" fill="none" class="chevron-arrow"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                btnSeeAll.onclick = () => {
                    const expanded = btnSeeAll.getAttribute('data-expanded') === 'true';
                    const hiddenCards = document.querySelectorAll('.overflow-cert');
                    if (expanded) {
                        hiddenCards.forEach(c => c.classList.add('hidden'));
                        btnSeeAll.setAttribute('data-expanded', 'false');
                        btnSeeAll.innerHTML = `${translations[currentLang].btn_see_all_certs} <svg viewBox="0 0 24 24" fill="none" class="chevron-arrow"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                        document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
                    } else {
                        hiddenCards.forEach(c => c.classList.remove('hidden'));
                        btnSeeAll.setAttribute('data-expanded', 'true');
                        btnSeeAll.innerHTML = `${translations[currentLang].btn_show_less_certs} <svg viewBox="0 0 24 24" fill="none" class="chevron-arrow"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                    }
                };
            }
        }
    }

    async function loadCertificates() {
        const listText = await fetchText('./certificates.txt');
        if (!listText) return;

        const folders = listText.split('\n').map(f => f.trim()).filter(Boolean);
        certsData = [];

        for (const folder of folders) {
            const [name, desc] = await Promise.all([
                fetchText(`./${folder}/name.txt`),
                fetchText(`./${folder}/descryption.txt`)
            ]);

            const folderTranslations = {};
            for (const l of ['tk', 'ru', 'ja']) {
                const [lName, lDesc] = await Promise.all([
                    fetchText(`./${folder}/name_${l}.txt`),
                    fetchText(`./${folder}/descryption_${l}.txt`),
                ]);
                if (lName || lDesc) folderTranslations[l] = { name: lName, desc: lDesc };
            }

            let photoUrl = null;
            if (await checkImage(`./${folder}/photo.jpg`)) photoUrl = `./${folder}/photo.jpg`;
            else if (await checkImage(`./${folder}/photo.png`)) photoUrl = `./${folder}/photo.png`;

            certsData.push({
                folder, name: name || folder, desc: desc || '', photoUrl,
                translations: folderTranslations
            });
        }
        renderCertificates();
    }




    // ============================================
    // SETTINGS & i18n
    // ============================================
    const settingsBtn = document.getElementById('settings-mobile-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close');
    const themeCheckbox = document.getElementById('theme-checkbox');
    const langBtns = document.querySelectorAll('.lang-btn');

    const translations = {
        en: {
            nav_about: "About",
            nav_projects: "Projects",
            nav_skills: "Skills",
            nav_experience: "Experience",
            nav_education: "Education",
            nav_certificates: "Certificates",
            nav_journey: "Journey",
            nav_contact: "Contact",
            nav_settings: "Settings",
            settings_title: "Settings",
            appearance: "Appearance",
            theme: "Theme",
            language: "Language",
            hero_name: "Musa Annagulyýew",
            hero_subtitle: "Android Developer & AR Engineer",
            hero_desc: "Building real apps from Turkmenistan. 370+ users. Targeting MEXT scholarship at University of Tokyo.",
            hero_btn_projects: "View Projects",
            hero_btn_github: "GitHub",
            about_label: "ABOUT ME",
            about_title: "Who I Am",
            about_p1: "I started coding at 12 years old in Turkmenistan — no mentor, no team, no resources. Just curiosity and Android Studio.",
            about_p2: "I build apps that solve real problems. My medicinal plants app has 370+ active users. My next project is an AR marketplace that lets people see products in real space before buying.",
            about_p3: "My long-term goal is the MEXT scholarship at the University of Tokyo. Every app I build is one step closer.",
            stats_title: "Quick Stats",
            stat_age: "Age",
            stat_age_val: "[age] years old",
            stat_exp: "Experience",
            stat_exp_val: "[exp]+ years coding",
            stat_apps: "Published Apps",
            stat_apps_val: "2 on Google Play",
            stat_users: "Active Users",
            stat_goal: "Goal",
            stat_goal_val: "MEXT — Univ. of Tokyo",
            stat_status: "Status",
            stat_status_val: "Open to collaboration",
            projects_label: "PROJECTS",
            projects_title: "What I've Built",
            skills_label: "SKILLS",
            skills_title: "Tech Stack",
            nav_reviews: "Reviews",
            reviews: "Reviews",
            likes: "Likes",
            skills_cat_languages: "Languages",
            skills_cat_android: "Android",
            skills_cat_backend: "Backend & Tools",
            skills_cat_dev: "Dev Tools",
            skills_cat_learning: "Learning",
            certificates_label: "CERTIFICATES",
            certificates_title: "My Achievements",
            btn_see_all_certs: "See all certificates",
            journey_label: "JOURNEY",
            journey_title: "My Path",
            hero_scroll: "scroll",
            footer_text: "Built by Musa Annagulyýew <span class=\"dot\">·</span> Turkmenistan 🇹🇲",
            stats_views: "views",
            stats_likes: "likes",
            contact_label: "CONTACT",
            contact_title: "Let's Connect",
            contact_desc: "I'm open to collaboration, research opportunities, and scholarship connections. Reach out.",
            reviews_label: "REVIEWS",
            reviews_title: "Community Feedback",
            chart_title: "Engagement Over Time",
            chart_hint: "Drag to explore other dates",
            stats_total_views: "Total Reviews",
            stats_total_likes: "Total Likes",
            btn_see_stats: "See statistics",
            pro_in_dev: "In Development",
            pro_users: "Users",
            btn_show_less_certs: "Show less certificates",
            exp_label: "WORK EXPERIENCE",
            exp_title: "Where I've Worked",
            exp_h_iospo: "International Online Subject and Project Olympiad (IOSPO)",
            exp_loc_iospo: "Balkanabat, Turkmenistan",
            exp_role_iospo: "Web Developer",
            exp_date_iospo: "Apr. 2025 — Aug. 2025",
            exp_p_iospo: "IOSPO Student & Admin Portal Website",
            exp_li_iospo_1: "Collaborated with a team to build the official IOSPO website completely from scratch.",
            exp_li_iospo_2: "Developed the student and admin portals, including a user-friendly and secure dashboard interface.",
            exp_li_iospo_3: "Implemented login and password authentication to strengthen system security.",
            exp_li_iospo_4: "Built a full CRUD system to manage users and data efficiently.",
            exp_li_iospo_5: "Designed, managed, and optimized the project's MySQL database, ensuring stability and scalability.",
            exp_h_gunbatar: "\"Gunbatar Shapagy\" Education Center",
            exp_loc_gunbatar: "Balkanabat, Turkmenistan",
            exp_role_gunbatar: "Software Developer",
            exp_date_gunbatar: "Jan. 2024 — Feb. 2025",
            exp_p_web_gunbatar: "Full-Stack Web Application for Education Center Management",
            exp_li_web_gunbatar_1: "Collaborated with a team to deliver a full-featured website from scratch, implementing both frontend (HTML, CSS, JavaScript) and backend (Laravel, PHP) components.",
            exp_li_web_gunbatar_2: "Built main landing pages with responsive design optimized for all device sizes.",
            exp_li_web_gunbatar_3: "Developed an online registration form with validation and secure data handling.",
            exp_li_web_gunbatar_4: "Created Student and Teacher portals with role-based access and full CRUD functionality in Laravel.",
            exp_li_web_gunbatar_5: "Handled server deployment and hosting configuration, ensuring reliable uptime.",
            exp_p_mob_gunbatar: "Education Center Mobile Application",
            exp_li_mob_gunbatar_1: "Developed and launched a mobile application using Java (Android Studio), integrating all website features, connected to Firebase, and successfully published it on the Google Play Store.",
            exp_li_mob_gunbatar_2: "Designed and optimized the MySQL database for the web platform, and used Firebase for managing real-time data in the mobile app.",
            exp_h_berk: "BERK MEBEL",
            exp_loc_berk: "Balkanabat, Turkmenistan",
            exp_role_berk: "3D Design Specialist",
            exp_date_berk: "Sep. 2023 — Present",
            exp_p_berk: "Custom 3D Furniture Design & Product Engineering",
            exp_li_berk_1: "Conceptualized and delivered 190+ bespoke 3D furniture models tailored to individual client specifications and residential layouts using Autodesk 3ds Max and Corona Renderer.",
            exp_li_berk_2: "Produced photorealistic renders for client presentations and production-ready models for manufacturing, ensuring dimensional accuracy and material fidelity.",
            exp_li_berk_3: "Engineered a functional bottle cap prototype for an automotive wash equipment line, optimized for 3D printing fabrication.",
            exp_li_berk_4: "Collaborated directly with clients to translate design requirements into detailed 3D visualizations and technical drawings.",
            exp_li_berk_5: "Maintained a high-volume workflow delivering consistent quality across diverse furniture categories including residential, commercial, and custom-specification pieces.",
            exp_tool_berk_1: "Autodesk 3ds Max",
            exp_tool_berk_2: "Corona Renderer",
            exp_tool_berk_3: "3D Printing",
            exp_tool_berk_4: "Product Design",
            edu_label: "EDUCATION",
            edu_title: "Where I've Learned",
            edu_h_gunbatar: "\"Gunbatar Shapagy\" Education Center",
            edu_desc_gunbatar: "Acquired comprehensive computer science knowledge and practical programming skills — including Android development, web technologies, database design, algorithm fundamentals, and English language proficiency.",
            edu_date_gunbatar: "Sep. 2022 — May 2027",
            edu_h_mekdep3: "Specialized School #3 of Balkanabat",
            edu_desc_mekdep3: "Secondary school specialized in foreign languages.",
            edu_date_mekdep3: "Sep. 2016 — May 2028",
            journey_h_2022: "First Line of Code",
            journey_p_2022: "Started Android development at age 12. Self-taught with zero guidance.",
            journey_h_2024: "First Published App",
            journey_p_2024: "Launched first app on Google Play Store.",
            journey_h_2025: "370+ Users",
            journey_p_2025: "Medicinal plants app reached 370+ active users. Integrated AI assistant and plant recognition.",
            journey_h_2026: "AR Development",
            journey_p_2026: "Started building Görüm — AR marketplace. Learning ARCore and Filament.",
            journey_h_2028: "MEXT Scholarship 🎯",
            journey_p_2028: "Target: University of Tokyo. Department of Computer Science."
        },
        tk: {
            nav_about: "Men barada",
            nav_projects: "Taslamalar",
            nav_skills: "Başarnyklar",
            nav_experience: "Tejribe",
            nav_education: "Bilim",
            nav_certificates: "Sertifikatlar",
            nav_journey: "Syýahat",
            nav_contact: "Aragatnaşyk",
            nav_settings: "Sazlamalar",
            settings_title: "Sazlamalar",
            appearance: "Daşky görnüş",
            theme: "Tema",
            language: "Dil",
            hero_name: "Musa Annagulyýew",
            hero_subtitle: "Android Developer we AR Inžener",
            hero_desc: "Türkmenistandan hakyky programmalary gurýaryn. 370+ ulanyjy. Tokio uniwersitetinde MEXT talyp hakyny almagy maksat edinýärin.",
            hero_btn_projects: "Taslamalary görkez",
            hero_btn_github: "GitHub",
            about_label: "MEN BARADA",
            about_title: "Men kim?",
            about_p1: "Men 12 ýaşymda Türkmenistanda kod ýazmaga başladym — mugallym, topar ýa-da serişde ýokdy. Diňe gyzyklanma we Android Studio Bardy.",
            about_p2: "Men hakyky meseleleri çözýän programmalary gurýaryn. Meniň dermanlyk ösümlikler programmamda 370+ işjeň ulanyjy bar. Indiki taslamam, harytlary satyn almazdan ozal hakyky giňişlikde görmäge mümkinçilik berýän AR söwda meýdançasy.",
            about_p3: "Meniň uzak möhletli maksadym Tokio uniwersitetinde MEXT talyp hakyny almak. Gurýan her bir programmam meni şol maksada ýakynlaşdyrýar.",
            stats_title: "Gysgaça statistika",
            stat_age: "Ýaşy",
            stat_age_val: "[age] ýaşynda",
            stat_exp: "Tejribesi",
            stat_exp_val: "[exp]+ ýyl kod ýazmak tejribesi",
            stat_apps: "Çap edilen programmalar",
            stat_apps_val: "Google Play-de 2 sany",
            stat_users: "Işjeň ulanyjylar",
            stat_goal: "Maksat",
            stat_goal_val: "MEXT — Tokio uniwersiteti",
            stat_status: "Status",
            stat_status_val: "Hyzmatdaşlyga açyk",
            projects_label: "TASLAMALAR",
            projects_title: "Guran zatlarym",
            skills_label: "BAŞARNYKLAR",
            skills_title: "Tehnologiýalar",
            skills_cat_languages: "Diller",
            skills_cat_android: "Android",
            skills_cat_backend: "Backend we Gurallar",
            skills_cat_dev: "Programmirleme Gurallary",
            skills_cat_learning: "Öwrenilýänler",
            nav_reviews: "Synlar",
            reviews: "Synlar",
            likes: "Halanlar",
            certificates_label: "SERTIFIKATLAR",
            certificates_title: "Meniň ýetişjeklerim",
            btn_see_all_certs: "Ähli sertifikatlary gör",
            journey_label: "SYÝAHAT",
            journey_title: "Meniň ýolum",
            hero_scroll: "aşak süýşür",
            footer_text: "Musa Annagulyýew tarapyndan gurnaldy <span class=\"dot\">·</span> Türkmenistan 🇹🇲",
            stats_views: "görenler",
            stats_likes: "halanlar",
            contact_label: "ARAGATNAŞYK",
            contact_title: "Habarlaşalyň",
            contact_desc: "Men hyzmatdaşlyga, gözleg mümkinçiliklerine we talyp haky baglanyşyklaryna açyk. Habarlaşyň.",
            reviews_label: "SYNLAR",
            reviews_title: "Jemgyýetçilik seslenmesi",
            chart_title: "Wagt boýunça işjeňlik",
            chart_hint: "Beýleki seneleri görmek üçin süýşüriň",
            stats_total_views: "Jemi synlar",
            stats_total_likes: "Jemi halanlar",
            btn_see_stats: "Statistikany gör",
            pro_in_dev: "Işlenilýär",
            pro_users: "Ulanyjy",
            btn_show_less_certs: "Az görün",
            exp_label: "TEJRIBE",
            exp_title: "Işleýän ýerlerim",
            exp_h_iospo: "Halkara Onlaýn ders we taslama olimpiadasy (IOSPO)",
            exp_loc_iospo: "Balkanabat, Türkmenistan",
            exp_role_iospo: "Web Developer",
            exp_date_iospo: "Aprel 2025 — Awgust 2025",
            exp_p_iospo: "IOSPO talyplar we admin portal web sahypasy",
            exp_li_iospo_1: "Ofisial IOSPO web sahypasyny noldan gurnamak üçin topar bilen hyzmatdaşlyk etdi.",
            exp_li_iospo_2: "Talyplar we admin portallaryny, şol sanda ulanmaga ýönekeý we howpsuz dolandyryş panelini gurnady.",
            exp_li_iospo_3: "Ulgamyň howpsuzlygyny güýçlendirmek üçin giriş we parol awtentifikasiýasyny durmuşa geçirdi.",
            exp_li_iospo_4: "Ulanyjylary we maglumatlary netijeli dolandyrmak üçin doly CRUD ulgamyny gurdy.",
            exp_li_iospo_5: "Taslamanyň MySQL maglumatlar bazasyny dizaýn etdi, dolandyrdy we optimallaşdyrdy.",
            exp_h_gunbatar: "\"Günbatar Şapagy\" okuw merkezi",
            exp_loc_gunbatar: "Balkanabat, Türkmenistan",
            exp_role_gunbatar: "Programma üpjünçisi",
            exp_date_gunbatar: "Ýanwar 2024 — Fewral 2025",
            exp_p_web_gunbatar: "Okuw merkezini dolandyrmak üçin Full-Stack web programmasy",
            exp_li_web_gunbatar_1: "Noldan doly aýratynlykly web sahypasyny hödürlemek üçin topar bilen hyzmatdaşlyk etdi, hakyky görnüşli (HTML, CSS, JS) we yzky tarapyny (Laravel, PHP) durmuşa geçirdi.",
            exp_li_web_gunbatar_2: "Ähli enjamlar üçin optimallaşdyrylan jogapkärli dizaýnly esasy landing sahypalaryny gurdy.",
            exp_li_web_gunbatar_3: "Tassyklama we howpsuz maglumat işlemegi bilen onlaýn hasaba alyş formasyny gurdy.",
            exp_li_web_gunbatar_4: "Laravel-de rol esasly elýeterlilik we doly CRUD funksiýasy bilen talyplar we mugallymlar portallaryny döretdi.",
            exp_li_web_gunbatar_5: "Serwer ýerleşdirilmegini we hosting sazlamalaryny dolandyryp, ygtybarly wagty üpjün etdi.",
            exp_p_mob_gunbatar: "Okuw merkezi ykjam programmasy",
            exp_li_mob_gunbatar_1: "Java (Android Studio) ulanyp, ähli web sahypasynyň aýratynlyklaryny özünde jemleýän, Firebase-e birikdirilen we Google Play Store-da üstünlikli çap edilen ykjam programmany gurdy we işe girizdi.",
            exp_li_mob_gunbatar_2: "Web meýdançasy üçin MySQL maglumatlar bazasyny dizaýn etdi we optimallaşdyrdy, ykjam programmada hakyky wagtda maglumatlary dolandyrmak üçin Firebase ulandy.",
            exp_h_berk: "BERK MEBEL",
            exp_loc_berk: "Balkanabat, Türkmenistan",
            exp_role_berk: "3D dizaýn hünärmeni",
            exp_date_berk: "Sentýabr 2023 — Häzirki wagt",
            exp_p_berk: "3D mebel dizaýny we önüm inženerligi",
            exp_li_berk_1: "Autodesk 3ds Max we Corona Renderer arkaly 190-dan gowrak aýratyn müşderi we jaý talaplaryna laýyk gelýän 3D mebel modellerini gurdy we hödürledi.",
            exp_li_berk_2: "Müşderi tanyşdyryşlary üçin fotorealistik şekilleri we önümçilik üçin taýýar modelleri öndürdi.",
            exp_li_berk_3: "Awtomobil ýuwuş enjamlary üçin 3D çap etmäge optimallaşdyrylan funksional çüýşe gapagynyň prototipini inženerledi.",
            exp_li_berk_4: "Dizaýn talaplaryny jikme-jik 3D wizualizasiýalara we tehniki çyzgylara geçirmek üçin müşderiler bilen gönümel işledi.",
            exp_li_berk_5: "Jaý, täjirçilik we ýöriteleşdirilen dürli mebel kategoriýalarynda yzygiderli hilli uly göwrümli iş akymyny saklady.",
            exp_tool_berk_1: "Autodesk 3ds Max",
            exp_tool_berk_2: "Corona Renderer",
            exp_tool_berk_3: "3D çap etmek",
            exp_tool_berk_4: "Önüm dizaýny",
            edu_label: "BILIM",
            edu_title: "Okan ýerlerim",
            edu_h_gunbatar: "\"Günbatar Şapagy\" okuw merkezi",
            edu_desc_gunbatar: "Kompýuter ylymlary boýunça giňişleýin bilim we amaly programmirleme endikleri — şol sanda Android işläp düzmek, web tehnologiýalary, maglumatlar bazasynyň dizaýny, algoritmleriň esaslary we iňlis dili endikleri.",
            edu_date_gunbatar: "Sentýabr 2022 — Maý 2027",
            edu_h_mekdep3: "Balkanabat şäheriniň 3-nji ýöriteleşdirilen orta mekdebi",
            edu_desc_mekdep3: "Daşary ýurt dillerine ýöriteleşdirilen orta mekdep.",
            edu_date_mekdep3: "Sentýabr 2016 — Maý 2028",
            journey_h_2022: "Birinji kod setiri",
            journey_p_2022: "12 ýaşymda Android işläp düzmäge başladym. Hiç hili görkezmesiz öz-özüme öwrendim.",
            journey_h_2024: "Ilkinji çap edilen programma",
            journey_p_2024: "Google Play Store-da ilkinji programmany işe girizdim.",
            journey_h_2025: "370+ Ulanyjy",
            journey_p_2025: "Dermanlyk ösümlikler programmasy 370+ işjeň ulanyja ýetdi. AI kömekçisi we ösümlikleri tanamak ulgamy goşuldy.",
            journey_h_2026: "AR Işläp düzmek",
            journey_p_2026: "Görüm — AR söwda meýdançasyny gurup başladym. ARCore we Filament öwrenýärin.",
            journey_h_2028: "MEXT Talyp haky 🎯",
            journey_p_2028: "Maksat: Tokio uniwersiteti. Kompýuter ylymlary bölümi."
        },
        ru: {
            nav_about: "Обо мне",
            nav_projects: "Проекты",
            nav_skills: "Навыки",
            nav_experience: "Опыт",
            nav_education: "Образование",
            nav_certificates: "Сертификаты",
            nav_journey: "Путь",
            nav_contact: "Контакт",
            nav_settings: "Настройки",
            settings_title: "Настройки",
            appearance: "Внешний вид",
            theme: "Тема",
            language: "Язык",
            hero_name: "Муса Аннагулыев",
            hero_subtitle: "Android-разработчик и AR-инженер",
            hero_desc: "Создаю реальные приложения из Туркменистана. 370+ пользователей. Цель — стипендия MEXT в Токийском университете.",
            hero_btn_projects: "Посмотреть проекты",
            hero_btn_github: "GitHub",
            about_label: "ОБО МНЕ",
            about_title: "Кто я",
            about_p1: "Я начал кодить в 12 лет в Туркменистане — без ментора, команды и ресурсов. Только любопытство и Android Studio.",
            about_p2: "Я создаю приложения, которые решают реальные проблемы. Мое приложение о лекарственных растениях имеет более 370 активных пользователей. Мой следующий проект — торговая площадка с дополненной реальностью (AR), которая позволяет увидеть товары в реальном пространстве перед покупкой.",
            about_p3: "Моя долгосрочная цель — стипендия MEXT в Токийском университете. Каждое приложение — это шаг к цели.",
            stats_title: "Краткая статистика",
            stat_age: "Возраст",
            stat_age_val: "[age] лет",
            stat_exp: "Опыт",
            stat_exp_val: "[exp]+ лет программирования",
            stat_apps: "Опубликованные приложения",
            stat_apps_val: "2 в Google Play",
            stat_users: "Активные пользователи",
            stat_goal: "Цель",
            stat_goal_val: "MEXT — Токийский университет",
            stat_status: "Статус",
            stat_status_val: "Открыт для сотрудничества",
            projects_label: "ПРОЕКТЫ",
            projects_title: "Что я создал",
            skills_label: "НАВЫКИ",
            skills_title: "Стек технологий",
            skills_cat_languages: "Языки",
            skills_cat_android: "Android",
            skills_cat_backend: "Бэкенд и инструменты",
            skills_cat_dev: "Инструменты разработки",
            skills_cat_learning: "Изучение",
            nav_reviews: "Отзывы",
            reviews: "Отзывы",
            likes: "Лайки",
            certificates_label: "СЕРТИФИКАТЫ",
            certificates_title: "Мои достижения",
            btn_see_all_certs: "Посмотреть все сертификаты",
            journey_label: "ПУТЬ",
            journey_title: "Моя история",
            hero_scroll: "листайте вниз",
            footer_text: "Создано Мусой Аннагулыевым <span class=\"dot\">·</span> Туркменистан 🇹🇲",
            stats_views: "просмотров",
            stats_likes: "лайков",
            contact_label: "КОНТАКТ",
            contact_title: "Свяжемся",
            contact_desc: "Я открыт для сотрудничества, исследовательских возможностей и связей по стипендиям. Пишите.",
            reviews_label: "ОТЗЫВЫ",
            reviews_title: "Отклики сообщества",
            chart_title: "Активность во времени",
            chart_hint: "Перетащите, чтобы увидеть другие даты",
            stats_total_views: "Всего просмотров",
            stats_total_likes: "Всего лайков",
            btn_see_stats: "Посмотреть статистику",
            pro_in_dev: "В разработке",
            pro_users: "Пользователей",
            btn_show_less_certs: "Показать меньше сертификатов",
            exp_label: "ОПЫТ РАБОТЫ",
            exp_title: "Где я работал",
            exp_h_iospo: "Международная онлайн-олимпиада по предметам и проектам (IOSPO)",
            exp_loc_iospo: "Балканабат, Туркменистан",
            exp_role_iospo: "Веб-разработчик",
            exp_date_iospo: "Апр. 2025 — Авг. 2025",
            exp_p_iospo: "Сайт портала для студентов и администраторов IOSPO",
            exp_li_iospo_1: "Сотрудничал с командой для создания официального сайта IOSPO полностью с нуля.",
            exp_li_iospo_2: "Разработал порталы для студентов и администраторов, включая удобный и безопасный интерфейс панели управления.",
            exp_li_iospo_3: "Внедрил аутентификацию по логину и паролю для усиления безопасности системы.",
            exp_li_iospo_4: "Создал полную систему CRUD для эффективного управления пользователями и данными.",
            exp_li_iospo_5: "Спроектировал, управлял и оптимизировал базу данных MySQL проекта, обеспечивая стабильность и масштабируемость.",
            exp_h_gunbatar: "Учебный центр «Гюнбатар Шапагы»",
            exp_loc_gunbatar: "Балканабат, Туркменистан",
            exp_role_gunbatar: "Разработчик ПО",
            exp_date_gunbatar: "Янв. 2024 — Фев. 2025",
            exp_p_web_gunbatar: "Full-Stack веб-приложение для управления учебным центром",
            exp_li_web_gunbatar_1: "Сотрудничал с командой для создания полнофункционального веб-сайта с нуля, реализуя как фронтенд (HTML, CSS, JavaScript), так и бэкенд (Laravel, PHP) компоненты.",
            exp_li_web_gunbatar_2: "Создал основные целевые страницы с адаптивным дизайном, оптимизированным для всех размеров устройств.",
            exp_li_web_gunbatar_3: "Разработал форму онлайн-регистрации с валидацией и безопасной обработкой данных.",
            exp_li_web_gunbatar_4: "Создал порталы для студентов и преподавателей с доступом на основе ролей и полной функциональностью CRUD на Laravel.",
            exp_li_web_gunbatar_5: "Занимался развертыванием сервера и настройкой хостинга, обеспечивая надежное время работы.",
            exp_p_mob_gunbatar: "Мобильное приложение учебного центра",
            exp_li_mob_gunbatar_1: "Разработал и запустил мобильное приложение на Java (Android Studio), интегрирующее все функции веб-сайта, подключенное к Firebase и успешно опубликованное в Google Play Store.",
            exp_li_mob_gunbatar_2: "Спроектировал и оптимизировал базу данных MySQL для веб-платформы и использовал Firebase для управления данными в реальном времени в мобильном приложении.",
            exp_h_berk: "БЕРК МЕБЕЛЬ",
            exp_loc_berk: "Балканабат, Туркменистан",
            exp_role_berk: "Специалист по 3D-дизайну",
            exp_date_berk: "Сент. 2023 — Наст. время",
            exp_p_berk: "Индивидуальный 3D-дизайн мебели и проектирование изделий",
            exp_li_berk_1: "Разработал и представил более 190 индивидуальных 3D-моделей мебели, адаптированных к спецификациям клиентов и планировкам жилых помещений, используя Autodesk 3ds Max и Corona Renderer.",
            exp_li_berk_2: "Создавал фотореалистичные рендеры для презентаций клиентам и готовые к производству модели для изготовления, обеспечивая точность размеров и достоверность материалов.",
            exp_li_berk_3: "Спроектировал функциональный прототип крышки бутылки для линии оборудования для мойки автомобилей, оптимизированный для 3D-печати.",
            exp_li_berk_4: "Работал напрямую с клиентами над переводом требований к дизайну в подробные 3D-визуализации и технические чертежи.",
            exp_li_berk_5: "Поддерживал большой объем работы, обеспечивая стабильное качество в различных категориях мебели, включая жилую, коммерческую и изготовленную по индивидуальному заказу.",
            exp_tool_berk_1: "Autodesk 3ds Max",
            exp_tool_berk_2: "Corona Renderer",
            exp_tool_berk_3: "3D-печать",
            exp_tool_berk_4: "Дизайн продукта",
            edu_label: "ОБРАЗОВАНИЕ",
            edu_title: "Где я учился",
            edu_h_gunbatar: "Учебный центр «Гюнбатар Шапагы»",
            edu_desc_gunbatar: "Получил всесторонние знания в области компьютерных наук и практические навыки программирования, включая разработку под Android, веб-технологии, проектирование баз данных, основы алгоритмов и знание английского языка.",
            edu_date_gunbatar: "Сент. 2022 — Май 2027",
            edu_h_mekdep3: "Специализированная школа №3 г. Балканабат",
            edu_desc_mekdep3: "Средняя школа со специализацией на иностранных языках.",
            edu_date_mekdep3: "Сент. 2016 — Май 2028",
            journey_h_2022: "Первая строчка кода",
            journey_p_2022: "Начал разработку под Android в 12 лет. Самоучка с нулевым руководством.",
            journey_h_2024: "Первое опубликованное приложение",
            journey_p_2024: "Запустил первое приложение в Google Play Store.",
            journey_h_2025: "370+ пользователей",
            journey_p_2025: "Приложение для лекарственных растений достигло 370+ активных пользователей. Интегрирован ИИ-помощник и распознавание растений.",
            journey_h_2026: "AR-разработка",
            journey_p_2026: "Начал создавать Görüm — AR-маркетплейс. Изучаю ARCore и Filament.",
            journey_h_2028: "Стипендия MEXT 🎯",
            journey_p_2028: "Цель: Токийский университет. Факультет компьютерных наук."
        },
        ja: {
            nav_about: "私について",
            nav_projects: "プロジェクト",
            nav_skills: "スキル",
            nav_experience: "経験",
            nav_education: "学歴",
            nav_certificates: "資格",
            nav_journey: "道のり",
            nav_contact: "連絡先",
            nav_settings: "設定",
            settings_title: "設定",
            appearance: "外観",
            theme: "テーマ",
            language: "言語",
            hero_name: "ムサ・アンナグリエフ",
            hero_subtitle: "Androidデベロッパー ＆ ARエンジニア",
            hero_desc: "トルクメニスタンから実用的なアプリを開発中。370人以上のユーザー。東京大学のMEXT奨学金を目指しています。",
            hero_btn_projects: "プロジェクトを見る",
            hero_btn_github: "GitHub",
            about_label: "自己紹介",
            about_title: "プロフィール",
            about_p1: "12歳の時にトルクメニスタンでプログラミングを始めました。メンターもチームもリソースもありませんでした。好奇心とAndroid Studioだけでした。",
            about_p2: "実社会の課題を解決するアプリを作っています。薬用植物アプリは370人以上のユーザーがいます。次のプロジェクトは、購入前に商品を現実空間で確認できるARマーケットプレイスです。",
            about_p3: "長期的な目標は、東京大学でMEXT奨学金を受けることです。開発するすべてのアプリが、その目標への一歩となります。",
            stats_title: "クイック統計",
            stat_age: "年齢",
            stat_age_val: "[age] 歳",
            stat_exp: "経験",
            stat_exp_val: "プログラミング歴 [exp]年+",
            stat_apps: "公開アプリ",
            stat_apps_val: "Google Playで2つ",
            stat_users: "アクティブユーザー",
            stat_goal: "目標",
            stat_goal_val: "MEXT — 東京大学",
            stat_status: "ステータス",
            stat_status_val: "コラボレーション受付中",
            projects_label: "プロジェクト",
            projects_title: "開発実績",
            skills_label: "スキル",
            skills_title: "技術スタック",
            skills_cat_languages: "言語",
            skills_cat_android: "Android",
            skills_cat_backend: "バックエンド & ツール",
            skills_cat_dev: "開発ツール",
            skills_cat_learning: "学習中",
            nav_reviews: "レビュー",
            reviews: "レビュー",
            likes: "いいね",
            certificates_label: "資格",
            certificates_title: "実績",
            btn_see_all_certs: "すべての証明書を見る",
            journey_label: "道のり",
            journey_title: "これまでの歩み",
            hero_scroll: "スクロール",
            footer_text: "Musa Annagulyýew による制作 <span class=\"dot\">·</span> トルクメニスタン 🇹🇲",
            stats_views: "件表示",
            stats_likes: "いいね",
            contact_label: "連絡先",
            contact_title: "お問い合わせ",
            contact_desc: "コラボレーション、研究機会、奨学金関連の連絡をお待ちしています。ご連絡ください。",
            reviews_label: "レビュー",
            reviews_title: "コミュニティのフィードバック",
            chart_title: "時間の経過に伴うエンゲージメント",
            chart_hint: "ドラッグして他の日付を表示",
            stats_total_views: "総レビュー数",
            stats_total_likes: "総いいね数",
            btn_see_stats: "統計を見る",
            pro_in_dev: "開発中",
            pro_users: "ユーザー",
            btn_show_less_certs: "表示を減らす",
            exp_label: "職務経歴",
            exp_title: "職務経験",
            exp_h_iospo: "国際オンライン主題・プロジェクトオリンピック (IOSPO)",
            exp_loc_iospo: "トルクメニスタン、バルカナバット",
            exp_role_iospo: "Webデベロッパー",
            exp_date_iospo: "2025年4月 — 2025年8月",
            exp_p_iospo: "IOSPO学生・管理者ポータルサイト",
            exp_li_iospo_1: "公式IOSPOウェブサイトをゼロから構築するため、チームと協力しました。",
            exp_li_iospo_2: "ユーザーフレンドリーで安全なダッシュボードインターフェースを含む、学生および管理者用ポータルを開発しました。",
            exp_li_iospo_3: "システムのセキュリティを強化するため、ログインとパスワード認証を実装しました。",
            exp_li_iospo_4: "ユーザーとデータを効率的に管理するための完全なCRUDシステムを構築しました。",
            exp_li_iospo_5: "プロジェクトのMySQLデータベースを設計、管理、最適化し、安定性と拡張性を確保しました。",
            exp_h_gunbatar: "「Gunbatar Shapagy」教育センター",
            exp_loc_gunbatar: "トルクメニスタン、バルカナバット",
            exp_role_gunbatar: "ソフトウェアデベロッパー",
            exp_date_gunbatar: "2024年1月 — 2025年2月",
            exp_p_web_gunbatar: "教育センター管理用フルスタックWebアプリケーション",
            exp_li_web_gunbatar_1: "フロントエンド（HTML、CSS、JavaScript）とバックエンド（Laravel、PHP）の両方のコンポーネントを実装し、ゼロからフル機能のウェブサイトを納品するため、チームと協力しました。",
            exp_li_web_gunbatar_2: "すべてのデバイスサイズに最適化された、レスポンシブデザインの主要なランディングページを構築しました。",
            exp_li_web_gunbatar_3: "バリデーションと安全なデータ処理を備えたオンライン登録フォームを開発しました。",
            exp_li_web_gunbatar_4: "Laravelで役割ベースのアクセスと完全なCRUD機能を備えた学生および教師用ポータルを作成しました。",
            exp_li_web_gunbatar_5: "サーバーのデプロイとホスティング構成を担当し、信頼性の高いアップタイムを確保しました。",
            exp_p_mob_gunbatar: "教育センターモバイルアプリケーション",
            exp_li_mob_gunbatar_1: "Java（Android Studio）を使用してモバイルアプリケーションを開発・リリースし、すべてのウェブサイト機能を統合し、Firebaseに接続して、Google Playストアで正常に公開しました。",
            exp_li_mob_gunbatar_2: "Webプラットフォーム用にMySQLデータベースを設計・最適化し、モバイルアプリでのリアルタイムデータの管理にFirebaseを使用しました。",
            exp_h_berk: "BERK MEBEL",
            exp_loc_berk: "トルクメニスタン、バルカナバット",
            exp_role_berk: "3Dデザインスペシャリスト",
            exp_date_berk: "2023年9月 — 現在",
            exp_p_berk: "カスタム3D家具デザインおよび製品エンジニアリング",
            exp_li_berk_1: "Autodesk 3ds MaxとCorona Rendererを使用して、個々のクライアントの仕様や住宅のレイアウトに合わせた190以上のオーダーメイド3D家具モデルをコンセプト化し、納品しました。",
            exp_li_berk_2: "クライアントへのプレゼンテーション用のフォトリアルなレンダリングと、製造用の生産準備が整ったモデルを作成し、寸法の正確さと素材の忠実さを確保しました。",
            exp_li_berk_3: "3Dプリンティング製造用に最適化された、自動車洗浄装置ライン用の機能的なボトルキャッププロトタイプを設計しました。",
            exp_li_berk_4: "クライアントと直接連携し、デザイン要件を詳細な3Dビジュアライゼーションと技術図面に変換しました。",
            exp_li_berk_5: "住宅、商業、カスタム仕様の各カテゴリーにわたって、一定の品質で大量のワークフローを維持しました。",
            exp_tool_berk_1: "Autodesk 3ds Max",
            exp_tool_berk_2: "Corona Renderer",
            exp_tool_berk_3: "3Dプリント",
            exp_tool_berk_4: "製品デザイン",
            edu_label: "学歴",
            edu_title: "教育",
            edu_h_gunbatar: "「Gunbatar Shapagy」教育センター",
            edu_desc_gunbatar: "Android開発、Webテクノロジー、データベース設計、アルゴリズムの基礎、英語能力を含む、包括的なコンピュータサイエンスの知識と実践的なプログラミングスキルを習得しました。",
            edu_date_gunbatar: "2022年9月 — 2027年5月",
            edu_h_mekdep3: "バルカナバット第3専門学校",
            edu_desc_mekdep3: "外国語に特化した中学校・高校。",
            edu_date_mekdep3: "2016年9月 — 2028年5月",
            journey_h_2022: "最初のコード",
            journey_p_2022: "12歳でAndroid開発を開始。独学でゼロから学びました。",
            journey_h_2024: "最初のアプリ公開",
            journey_p_2024: "Google Playストアで最初のアプリをリリースしました。",
            journey_h_2025: "ユーザー数370人突破",
            journey_p_2025: "薬用植物アプリがアクティブユーザー370人を達成。AIアシスタントと植物認識機能を統合しました。",
            journey_h_2026: "AR開発",
            journey_p_2026: "ARマーケットプレイス「Görüm」の構築を開始。ARCoreとFilamentを学習中。",
            journey_h_2028: "MEXT奨学金獲得 🎯",
            journey_p_2028: "目標：東京大学 コンピュータサイエンス学科。"
        }
    };

    function updateLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                let text = translations[lang][key];

                // Replace dynamic placeholders
                if (text.includes('[age]')) text = text.replace('[age]', age);
                if (text.includes('[exp]')) text = text.replace('[exp]', exp);

                el.innerHTML = text;
            }
        });

        renderProjects();
        renderCertificates();

        localStorage.setItem('portfolio-lang', lang);
        langBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang));
    }

    // Theme Switch
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', () => {
            const theme = themeCheckbox.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
        });
    }

    // Language Switch
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Modal Control
    const openSettings = (e) => {
        e.preventDefault();

        // Prevent Scrollbar Jump
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;

        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        mobileMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        if (hamburger2) hamburger2.classList.remove('active');
    };

    const closeSettings = () => {
        settingsModal.classList.remove('active');

        // Wait for animation to finish before restoring scroll
        setTimeout(() => {
            if (!settingsModal.classList.contains('active')) {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                const navbar = document.getElementById('navbar');
                if (navbar) navbar.style.paddingRight = '';
            }
        }, 400); // matches CSS transition 0.4s
    };

    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    const settingsDesktopBtn = document.getElementById('settings-desktop-btn');
    if (settingsDesktopBtn) settingsDesktopBtn.addEventListener('click', openSettings);

    if (settingsClose) {
        settingsClose.addEventListener('click', closeSettings);
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            // Only close if clicking the backdrop (overlay), not the content
            if (e.target === settingsModal) {
                closeSettings();
            }
        });
    }

    // Initial Load Settings
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    const savedLang = localStorage.getItem('portfolio-lang') || 'en';

    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeCheckbox) themeCheckbox.checked = (savedTheme === 'light');
    updateLanguage(savedLang);

    loadCertificates();
});