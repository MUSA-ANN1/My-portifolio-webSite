/* ============================================
   Musa Annagulyýew — Portfolio Scripts
   Fire particles · Dynamic projects · Modal
   Carousel · Scroll reveal · Auto-calc
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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

    const setTextById = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setTextById('auto-age', age);
    setTextById('auto-exp', exp);
    setTextById('stat-age', age + ' years old');
    setTextById('stat-exp', exp + '+ years coding');

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
            if (await checkImage(url)) shots.push(url);
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

    async function loadProjects() {
        const listText = await fetchText('./projects.txt');
        if (!listText) {
            projectsGrid.innerHTML = '<p style="color:#a0a0a0; grid-column: 1/-1;">Projects could not load.</p>';
            return;
        }

        const folders = listText.split('\n').map(f => f.trim()).filter(Boolean);
        const projects = [];

        for (const folder of folders) {
            const [name, shortDesc, fullDesc, techs, linksRaw, downloads] = await Promise.all([
                fetchText(`./${folder}/name.txt`),
                fetchText(`./${folder}/short%20descryption.txt`),
                fetchText(`./${folder}/full%20descyption.txt`),
                fetchText(`./${folder}/used%20techs.txt`),
                fetchText(`./${folder}/links.txt`),
                fetchText(`./${folder}/downloads.txt`),
            ]);

            const logoExists = await checkImage(`./${folder}/logo.jpg`);
            const screenshots = await getScreenshots(folder);
            const links = parseLinks(linksRaw);

            projects.push({
                folder, name: name || folder,
                shortDesc: shortDesc || '',
                fullDesc: fullDesc || shortDesc || '',
                techs: techs ? techs.split(',').map(t => t.trim()) : [],
                links, downloads, screenshots,
                logoUrl: logoExists ? `./${folder}/logo.jpg` : null,
            });
        }

        // Sort: dev projects first
        projects.sort((a, b) => (b.links.isDev ? 1 : 0) - (a.links.isDev ? 1 : 0));

        // Render cards
        projects.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'project-card fade-up';
            card.style.transitionDelay = (idx * 100) + 'ms';

            // Screenshot area
            let screenshotHTML;
            if (p.screenshots.length) {
                screenshotHTML = createCarousel(p.screenshots, 'proj-' + idx);
            } else {
                const logoInner = p.logoUrl
                    ? `<img src="${p.logoUrl}" alt="${p.name}" style="width:64px;height:64px;border-radius:12px;object-fit:contain;">`
                    : `<div class="card-logo-fallback">${(p.name[0] || '?')}</div>`;
                screenshotHTML = `<div class="card-placeholder">${logoInner}</div>`;
            }

            // Badge
            let badgeHTML = '';
            if (p.links.isDev) badgeHTML = '<span class="project-badge badge-orange">In Development</span>';
            else if (p.downloads) badgeHTML = `<span class="project-badge badge-crimson">${p.downloads} Users</span>`;

            // Links
            let linksHTML = '';
            if (p.links.github) linksHTML += `<a href="${p.links.github}" target="_blank" onclick="event.stopPropagation()" aria-label="GitHub">${githubSVG}</a>`;
            if (p.links.playMarket) linksHTML += `<a href="${p.links.playMarket}" target="_blank" onclick="event.stopPropagation()" aria-label="Play Store">${playSVG}</a>`;
            if (p.links.googleDrive) linksHTML += `<a href="${p.links.googleDrive}" target="_blank" onclick="event.stopPropagation()" aria-label="Download">${downloadSVG}</a>`;

            // Tags
            const tagsHTML = p.techs.map(t => `<span>${t}</span>`).join('');

            // Logo in body
            const logoBody = p.logoUrl
                ? `<img class="card-logo" src="${p.logoUrl}" alt="${p.name}">`
                : `<div class="card-logo-fallback">${p.name[0] || '?'}</div>`;

            card.innerHTML = `
                ${screenshotHTML}
                <div class="card-body">
                    <div class="card-top-row">
                        ${logoBody}
                        <div class="card-links">${badgeHTML}${linksHTML}</div>
                    </div>
                    <h3 class="card-name">${p.name}</h3>
                    <p class="card-desc">${p.shortDesc}</p>
                    <div class="card-tags">${tagsHTML}</div>
                </div>
            `;
            card.addEventListener('click', (e) => {
                // Do not open modal if they clicked the image/carousel area
                if (e.target.closest('.card-carousel') || e.target.closest('.card-placeholder')) return;
                openModal(p);
            });
            projectsGrid.appendChild(card);
            observer.observe(card);
        });

        // Setup Swiper Interactivity
        setupAllCarousels();
    }

    // ============================================
    // PROJECT MODAL
    // ============================================
    function openModal(project) {
        const { name, fullDesc, techs, links, downloads, screenshots, logoUrl } = project;

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
        if (links.isDev) badges += '<span class="project-badge badge-orange">In Development</span>';
        if (downloads) badges += `<span class="project-badge badge-crimson">${downloads} Users</span>`;
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
        document.getElementById('modal-title').textContent = cert.name;
        document.getElementById('modal-desc').textContent = cert.desc;

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
    async function loadCertificates() {
        const certsGrid = document.getElementById('certificates-grid');
        const listText = await fetchText('./certificates.txt');
        if (!listText) {
            if (certsGrid) certsGrid.innerHTML = '<p style="color:#a0a0a0; grid-column: 1/-1;">Could not load certificates.</p>';
            return;
        }

        const folders = listText.split('\n').map(f => f.trim()).filter(Boolean);
        const certs = [];

        for (const folder of folders) {
            const [name, desc] = await Promise.all([
                fetchText(`./${folder}/name.txt`),
                fetchText(`./${folder}/descryption.txt`)
            ]);

            // Allow checking different extensions for the single photo
            let photoUrl = null;
            if (await checkImage(`./${folder}/photo.jpg`)) photoUrl = `./${folder}/photo.jpg`;
            else if (await checkImage(`./${folder}/photo.png`)) photoUrl = `./${folder}/photo.png`;

            certs.push({
                folder,
                name: name || folder,
                desc: desc || '',
                photoUrl: photoUrl
            });
        }

        if (!certsGrid) return;
        certsGrid.innerHTML = '';

        const isMobile = window.innerWidth <= 768;
        const visibleLimit = isMobile ? 5 : 10;

        certs.forEach((c, idx) => {
            const card = document.createElement('div');
            card.className = 'cert-card fade-up visible';
            // Hide elements beyond the limit
            if (idx >= visibleLimit) {
                card.classList.add('hidden', 'overflow-cert');
            }

            const imgHtml = c.photoUrl
                ? `<img src="${c.photoUrl}" alt="${c.name}" class="cert-img">`
                : `<div class="cert-img" style="display:flex;align-items:center;justify-content:center;color:#555;">No Photo</div>`;

            card.innerHTML = `
                ${imgHtml}
                <div class="cert-info">
                    <h3 class="cert-title">${c.name}</h3>
                </div>
            `;
            card.addEventListener('click', (e) => {
                // Do not open modal if they clicked the image
                if (e.target.closest('.cert-img')) return;
                openCertModal(c);
            });
            certsGrid.appendChild(card);
        });

        // See all logic
        const btnSeeAll = document.getElementById('btn-see-all-certs');
        if (btnSeeAll) {
            if (certs.length <= visibleLimit) {
                btnSeeAll.style.display = 'none';
            } else {
                btnSeeAll.addEventListener('click', () => {
                    const expanded = btnSeeAll.getAttribute('data-expanded') === 'true';
                    const hiddenCards = document.querySelectorAll('.overflow-cert');

                    if (expanded) {
                        // Collapse
                        hiddenCards.forEach(c => c.classList.add('hidden'));
                        btnSeeAll.setAttribute('data-expanded', 'false');
                        btnSeeAll.innerHTML = `See all certificates <svg viewBox="0 0 24 24" fill="none" class="chevron-arrow"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        // Scroll back to top of certificates section quickly to avoid jumping feeling lost
                        document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Expand
                        hiddenCards.forEach(c => c.classList.remove('hidden'));
                        btnSeeAll.setAttribute('data-expanded', 'true');
                        btnSeeAll.innerHTML = `Show less certificates <svg viewBox="0 0 24 24" fill="none" class="chevron-arrow"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                    }
                });
            }
        }
    }

    loadCertificates();

});